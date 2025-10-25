import { FhevmClient } from '../core/FhevmClient';
import type { FhevmClientConfig, NetworkConfig } from '../types';

/**
 * Helper function to create and initialize FHEVM client
 * @example
 * const client = await createFhevmClient({
 *   network: {
 *     chainId: 11155111,
 *     rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
 *     gatewayUrl: 'https://gateway.fhevm.io'
 *   }
 * });
 */
export async function createFhevmClient(config: FhevmClientConfig): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.initialize();
  return client;
}

/**
 * Initialize FHEVM for a specific network
 * Shorthand for common configurations
 */
export async function initializeFhevm(
  chainId: number,
  rpcUrl: string,
  gatewayUrl?: string
): Promise<FhevmClient> {
  const network: NetworkConfig = {
    chainId,
    rpcUrl,
    gatewayUrl,
  };

  return await createFhevmClient({ network });
}

/**
 * Predefined network configurations
 */
export const NETWORKS = {
  SEPOLIA: {
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/',
    gatewayUrl: 'https://gateway.fhevm.io',
  },
  LOCAL: {
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
  },
  MAINNET: {
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    gatewayUrl: 'https://gateway.fhevm.io',
  },
};
