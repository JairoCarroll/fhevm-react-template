/**
 * useComputation Hook
 * Custom hook for homomorphic computation operations
 */

import { useState, useCallback } from 'react';
import { useFhevm, useContractRead, useContractWrite } from 'fhevm-sdk/react';

interface ComputationParams {
  contractAddress: string;
  abi: any[];
  method: string;
  args?: any[];
}

export function useComputation() {
  const { client, isInitialized } = useFhevm();
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(
    async (params: ComputationParams) => {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsComputing(true);
        setError(null);

        const { contractAddress, abi, method, args = [] } = params;

        // Execute computation via contract read
        const computeResult = await client.contracts.read(
          contractAddress,
          abi,
          method,
          args
        );

        setResult(computeResult);
        return computeResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Computation failed');
        setError(error);
        throw error;
      } finally {
        setIsComputing(false);
      }
    },
    [client, isInitialized]
  );

  const executeWithEncryption = useCallback(
    async (params: ComputationParams & { encryptedInputs?: any }) => {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsComputing(true);
        setError(null);

        const { contractAddress, abi, method, args = [], encryptedInputs } = params;

        // Merge encrypted inputs with args
        const finalArgs = encryptedInputs ? [...args, encryptedInputs] : args;

        // Execute contract write with encrypted data
        const computeResult = await client.contracts.write(
          contractAddress,
          abi,
          method,
          finalArgs
        );

        setResult(computeResult);
        return computeResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encrypted computation failed');
        setError(error);
        throw error;
      } finally {
        setIsComputing(false);
      }
    },
    [client, isInitialized]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsComputing(false);
  }, []);

  return {
    compute,
    executeWithEncryption,
    isComputing,
    result,
    error,
    reset
  };
}
