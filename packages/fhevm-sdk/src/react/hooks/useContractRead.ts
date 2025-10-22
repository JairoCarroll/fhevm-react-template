import { useState, useEffect, useCallback } from 'react';
import { useFhevm } from '../FhevmProvider';

interface UseContractReadConfig {
  address: string;
  abi: any[];
  functionName: string;
  args?: any[];
  enabled?: boolean;
}

/**
 * Hook for reading contract data
 */
export function useContractRead<T = any>({
  address,
  abi,
  functionName,
  args = [],
  enabled = true,
}: UseContractReadConfig) {
  const { client, isInitialized } = useFhevm();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const read = useCallback(async () => {
    if (!client || !isInitialized || !enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await client.contracts.read(address, abi, functionName, args);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [client, isInitialized, address, abi, functionName, args, enabled]);

  useEffect(() => {
    read();
  }, [read]);

  return {
    data,
    isLoading,
    error,
    refetch: read,
  };
}
