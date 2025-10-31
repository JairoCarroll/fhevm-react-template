/**
 * useEncryption Hook
 * Custom hook for encryption operations
 */

import { useState, useCallback } from 'react';
import { useEncryption as useSdkEncryption } from 'fhevm-sdk/react';
import { encryptValue, batchEncrypt } from '@/lib/fhe/client';
import { validateEncryption, validateBatchEncryption } from '@/lib/utils/validation';
import type { EncryptionType } from '@/types/fhe';

export function useEncryption() {
  const {
    encrypt: sdkEncrypt,
    isEncrypting: sdkIsEncrypting,
    error: sdkError
  } = useSdkEncryption();

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<any>(null);

  const encrypt = useCallback(
    async (value: number | boolean | string, type: EncryptionType) => {
      try {
        setIsEncrypting(true);
        setError(null);

        // Validate input
        const validation = validateEncryption(value, type);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Try SDK encryption first
        let encrypted;
        if (sdkEncrypt) {
          encrypted = await sdkEncrypt(value, type);
        } else {
          // Fallback to direct client
          const result = await encryptValue(value, type);
          encrypted = result.data;
        }

        setLastEncrypted({ value, type, encrypted, timestamp: Date.now() });
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [sdkEncrypt]
  );

  const encryptBatch = useCallback(
    async (values: Array<{ value: number | boolean | string; type: EncryptionType }>) => {
      try {
        setIsEncrypting(true);
        setError(null);

        // Validate batch
        const validation = validateBatchEncryption(values);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        const encrypted = await batchEncrypt(values);
        setLastEncrypted({ batch: true, count: values.length, timestamp: Date.now() });
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Batch encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    []
  );

  return {
    encrypt,
    encryptBatch,
    isEncrypting: sdkIsEncrypting || isEncrypting,
    error: sdkError || error,
    lastEncrypted
  };
}
