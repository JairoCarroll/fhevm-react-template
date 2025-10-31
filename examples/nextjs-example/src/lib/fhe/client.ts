/**
 * Client-side FHE Operations
 * Handles encryption and decryption on the client
 */

import { createFhevmClient, type FhevmClient } from 'fhevm-sdk';
import type { EncryptedValue, EncryptionType } from '@/types/fhe';

let clientInstance: FhevmClient | null = null;

/**
 * Initialize FHEVM client for browser environment
 */
export async function initFhevmClient(config?: {
  chainId?: number;
  rpcUrl?: string;
  gatewayUrl?: string;
}): Promise<FhevmClient> {
  if (clientInstance) {
    return clientInstance;
  }

  const defaultConfig = {
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
    gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
  };

  clientInstance = await createFhevmClient({
    network: { ...defaultConfig, ...config }
  });

  return clientInstance;
}

/**
 * Get existing client instance
 */
export function getFhevmClient(): FhevmClient | null {
  return clientInstance;
}

/**
 * Encrypt a value on the client
 */
export async function encryptValue(
  value: number | boolean | string,
  type: EncryptionType
): Promise<EncryptedValue> {
  const client = await initFhevmClient();
  const encrypted = await client.encryption.encryptValue(value, type);

  return {
    data: encrypted,
    type,
    timestamp: Date.now()
  };
}

/**
 * Encrypt multiple values
 */
export async function batchEncrypt(
  values: Array<{ value: number | boolean | string; type: EncryptionType }>
): Promise<EncryptedValue[]> {
  const client = await initFhevmClient();
  const encrypted = await client.encryption.batchEncrypt(values);

  return encrypted.map((data, index) => ({
    data,
    type: values[index].type,
    timestamp: Date.now()
  }));
}

/**
 * Create encrypted input for contract
 */
export async function createEncryptedInput(
  contractAddress: string,
  userAddress: string
) {
  const client = await initFhevmClient();
  return client.encryption.createEncryptedInput(contractAddress, userAddress);
}

/**
 * Decrypt a value (requires user signature)
 */
export async function decryptValue(
  contractAddress: string,
  handle: string,
  userAddress: string,
  signature: string,
  publicKey: string
): Promise<number | boolean | string> {
  const client = await initFhevmClient();
  return client.decryption.userDecrypt(
    contractAddress,
    handle,
    userAddress,
    signature,
    publicKey
  );
}

/**
 * Public decrypt (no signature required)
 */
export async function publicDecrypt(
  contractAddress: string,
  handle: string
): Promise<number | boolean | string> {
  const client = await initFhevmClient();
  return client.decryption.publicDecrypt(contractAddress, handle);
}

/**
 * Get public key for encryption
 */
export async function getPublicKey(): Promise<string> {
  const client = await initFhevmClient();
  return client.getPublicKey();
}

/**
 * Reset client instance (useful for testing or re-initialization)
 */
export function resetClient(): void {
  clientInstance = null;
}
