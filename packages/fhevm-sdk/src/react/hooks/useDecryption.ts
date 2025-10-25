import { useState, useCallback } from 'react';
import { useFhevm } from '../FhevmProvider';

/**
 * Hook for decrypting values
 */
export function useDecryption() {
  const { client, isInitialized } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const userDecrypt = useCallback(
    async (
      contractAddress: string,
      handle: bigint,
      userAddress?: string
    ): Promise<bigint | null> => {
      if (!client || !isInitialized) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const decrypted = await client.decryption.userDecrypt(
          contractAddress,
          handle,
          userAddress
        );
        return decrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  const publicDecrypt = useCallback(
    async (contractAddress: string, handle: bigint): Promise<bigint | null> => {
      if (!client || !isInitialized) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const decrypted = await client.decryption.publicDecrypt(contractAddress, handle);
        return decrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  const batchDecrypt = useCallback(
    async (
      contractAddress: string,
      handles: bigint[],
      userAddress?: string
    ): Promise<bigint[] | null> => {
      if (!client || !isInitialized) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const decrypted = await client.decryption.batchDecrypt(
          contractAddress,
          handles,
          userAddress
        );
        return decrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    userDecrypt,
    publicDecrypt,
    batchDecrypt,
    isDecrypting,
    error,
  };
}
