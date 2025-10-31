/**
 * useFHE Hook
 * Custom hook for FHE operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useFhevm } from 'fhevm-sdk/react';
import { initFhevmClient, getFhevmClient } from '@/lib/fhe/client';

export function useFHE() {
  const { client: sdkClient, isInitialized, error: sdkError } = useFhevm();
  const [localClient, setLocalClient] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const client = sdkClient || (await initFhevmClient());
        setLocalClient(client);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize FHE'));
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [sdkClient]);

  const getClient = useCallback(() => {
    return localClient || getFhevmClient();
  }, [localClient]);

  return {
    client: getClient(),
    isReady: isInitialized || (!!localClient && !loading),
    isLoading: loading,
    error: sdkError || error
  };
}
