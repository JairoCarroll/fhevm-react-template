import type { FhevmClient } from './FhevmClient';
import type { DecryptRequest, DecryptResponse } from '../types';

/**
 * Decryption Service - handles EIP-712 signing and decryption
 */
export class DecryptionService {
  constructor(private client: FhevmClient) {}

  /**
   * User decrypt - uses EIP-712 signature to decrypt user-owned values
   */
  async userDecrypt(
    contractAddress: string,
    handle: bigint,
    userAddress?: string
  ): Promise<bigint> {
    if (!this.client.signer) {
      throw new Error('Signer not available for decryption');
    }

    const address = userAddress || (await this.client.getAddress());

    // Create EIP-712 signature for decryption
    const signature = await this.createDecryptSignature(contractAddress, handle, address);

    // Call gateway to decrypt
    const decryptedValue = await this.callGatewayDecrypt(
      contractAddress,
      handle,
      address,
      signature
    );

    return decryptedValue;
  }

  /**
   * Public decrypt - decrypt publicly accessible values (no signature needed)
   */
  async publicDecrypt(contractAddress: string, handle: bigint): Promise<bigint> {
    // For public values, no signature is needed
    return await this.callGatewayDecrypt(contractAddress, handle);
  }

  /**
   * Batch decrypt multiple handles
   */
  async batchDecrypt(
    contractAddress: string,
    handles: bigint[],
    userAddress?: string
  ): Promise<bigint[]> {
    const results: bigint[] = [];

    for (const handle of handles) {
      try {
        const value = await this.userDecrypt(contractAddress, handle, userAddress);
        results.push(value);
      } catch (error) {
        console.error(`Failed to decrypt handle ${handle}:`, error);
        results.push(0n);
      }
    }

    return results;
  }

  /**
   * Create EIP-712 signature for decryption request
   */
  private async createDecryptSignature(
    contractAddress: string,
    handle: bigint,
    userAddress: string
  ): Promise<string> {
    if (!this.client.signer) {
      throw new Error('No signer available');
    }

    const domain = {
      name: 'FHEVMDecryption',
      version: '1',
      chainId: this.client.network.chainId,
      verifyingContract: contractAddress,
    };

    const types = {
      Decrypt: [
        { name: 'handle', type: 'uint256' },
        { name: 'user', type: 'address' },
      ],
    };

    const value = {
      handle: handle.toString(),
      user: userAddress,
    };

    try {
      const signature = await this.client.signer.signTypedData(domain, types, value);
      return signature;
    } catch (error) {
      throw new Error(`Failed to create decrypt signature: ${error}`);
    }
  }

  /**
   * Call gateway to perform decryption
   */
  private async callGatewayDecrypt(
    contractAddress: string,
    handle: bigint,
    userAddress?: string,
    signature?: string
  ): Promise<bigint> {
    const gatewayUrl = this.client.network.gatewayUrl;

    if (!gatewayUrl) {
      throw new Error('Gateway URL not configured');
    }

    const payload: any = {
      contractAddress,
      handle: handle.toString(),
    };

    if (userAddress && signature) {
      payload.userAddress = userAddress;
      payload.signature = signature;
    }

    try {
      const response = await fetch(`${gatewayUrl}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Gateway error: ${response.statusText}`);
      }

      const data = await response.json();
      return BigInt(data.decryptedValue);
    } catch (error) {
      throw new Error(`Gateway decryption failed: ${error}`);
    }
  }
}
