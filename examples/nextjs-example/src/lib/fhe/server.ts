/**
 * Server-side FHE Operations
 * Handles encryption and decryption on the server (API routes)
 */

import { createFhevmClient } from 'fhevm-sdk';

/**
 * Server-side client initialization
 * Used in API routes
 */
export async function createServerFhevmClient() {
  return createFhevmClient({
    network: {
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
      rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
      gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
    }
  });
}

/**
 * Server-side encryption
 */
export async function serverEncrypt(
  value: number | boolean | string,
  type: string
) {
  const client = await createServerFhevmClient();
  return client.encryption.encryptValue(value, type);
}

/**
 * Server-side decryption
 */
export async function serverDecrypt(
  contractAddress: string,
  handle: string,
  userAddress?: string,
  signature?: string,
  publicKey?: string
) {
  const client = await createServerFhevmClient();

  if (userAddress && signature && publicKey) {
    return client.decryption.userDecrypt(
      contractAddress,
      handle,
      userAddress,
      signature,
      publicKey
    );
  }

  return client.decryption.publicDecrypt(contractAddress, handle);
}

/**
 * Execute contract read operation
 */
export async function serverContractRead(
  contractAddress: string,
  abi: any[],
  method: string,
  args: any[] = []
) {
  const client = await createServerFhevmClient();
  return client.contracts.read(contractAddress, abi, method, args);
}

/**
 * Execute contract write operation
 */
export async function serverContractWrite(
  contractAddress: string,
  abi: any[],
  method: string,
  args: any[] = []
) {
  const client = await createServerFhevmClient();
  return client.contracts.write(contractAddress, abi, method, args);
}
