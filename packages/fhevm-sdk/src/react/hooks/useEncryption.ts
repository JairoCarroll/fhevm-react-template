import { useState, useCallback } from 'react';
import { useFhevm } from '../FhevmProvider';
import type { EncryptionType, SupportedValue, EncryptedInput } from '../../types';

/**
 * Hook for encrypting values
 */
export function useEncryption() {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: SupportedValue, type: EncryptionType): Promise<Uint8Array | null> => {
      if (!client || !isInitialized) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encryption.encryptValue(value, type);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  const encryptInputs = useCallback(
    async (
      contractAddress: string,
      userAddress: string,
      inputs: Array<{ value: SupportedValue; type: EncryptionType }>
    ): Promise<EncryptedInput | null> => {
      if (!client || !isInitialized) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encryption.encryptInputs(
          contractAddress,
          userAddress,
          inputs
        );
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    encrypt,
    encryptInputs,
    isEncrypting,
    error,
  };
}
