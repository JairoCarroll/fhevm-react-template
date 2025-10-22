import { useState, useCallback } from 'react';
import { useFhevm } from '../FhevmProvider';
import type { ContractCallOptions } from '../../types';

interface UseContractWriteConfig {
  address: string;
  abi: any[];
  functionName: string;
}

/**
 * Hook for writing to contracts
 */
export function useContractWrite({ address, abi, functionName }: UseContractWriteConfig) {
  const { client, isInitialized } = useFhevm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const write = useCallback(
    async (args: any[] = [], options?: ContractCallOptions) => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await client.contracts.write(
          address,
          abi,
          functionName,
          args,
          options
        );
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isInitialized, address, abi, functionName]
  );

  const writeWithEncryption = useCallback(
    async (
      encryptedInputs: { handles: Uint8Array[]; inputProof: string },
      options?: ContractCallOptions
    ) => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await client.contracts.callWithEncryption(
          address,
          abi,
          functionName,
          encryptedInputs,
          options
        );
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isInitialized, address, abi, functionName]
  );

  return {
    write,
    writeWithEncryption,
    isLoading,
    error,
    data,
  };
}
