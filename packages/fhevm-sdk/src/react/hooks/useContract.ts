import { useMemo } from 'react';
import { useFhevm } from '../FhevmProvider';
import type { Contract } from 'ethers';

/**
 * Hook for contract instance
 */
export function useContract(address: string, abi: any[]): Contract | null {
  const { client, isInitialized } = useFhevm();

  return useMemo(() => {
    if (!client || !isInitialized) {
      return null;
    }

    return client.contracts.getContract(address, abi);
  }, [client, isInitialized, address, abi]);
}
