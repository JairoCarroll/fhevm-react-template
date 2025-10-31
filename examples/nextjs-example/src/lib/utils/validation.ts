/**
 * Validation Utilities
 * Input validation and data verification
 */

import type { EncryptionType } from '@/types/fhe';

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): {
  valid: boolean;
  error?: string;
} {
  if (!address) {
    return { valid: false, error: 'Contract address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid contract address format' };
  }

  return { valid: true };
}

/**
 * Validate encryption value and type
 */
export function validateEncryption(
  value: any,
  type: EncryptionType
): {
  valid: boolean;
  error?: string;
} {
  // Validate type
  const validTypes: EncryptionType[] = [
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uint128',
    'uint256',
    'bool',
    'address'
  ];

  if (!validTypes.includes(type)) {
    return { valid: false, error: `Invalid encryption type: ${type}` };
  }

  // Validate value based on type
  if (type === 'bool') {
    if (typeof value !== 'boolean') {
      return { valid: false, error: 'Value must be a boolean' };
    }
  } else if (type === 'address') {
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return { valid: false, error: 'Invalid address format' };
    }
  } else {
    // Numeric types
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { valid: false, error: 'Value must be a number' };
    }

    if (numValue < 0) {
      return { valid: false, error: 'Value must be non-negative' };
    }

    // Check bounds based on type
    const maxValues: Record<string, bigint> = {
      uint8: BigInt(2 ** 8 - 1),
      uint16: BigInt(2 ** 16 - 1),
      uint32: BigInt(2 ** 32 - 1),
      uint64: BigInt(2 ** 64 - 1),
      uint128: BigInt(2 ** 128 - 1),
      uint256: BigInt(2 ** 256 - 1)
    };

    const maxValue = maxValues[type];
    if (maxValue && BigInt(numValue) > maxValue) {
      return { valid: false, error: `Value exceeds maximum for ${type}` };
    }
  }

  return { valid: true };
}

/**
 * Validate decryption request
 */
export function validateDecryption(params: {
  contractAddress: string;
  handle: string;
  userAddress?: string;
  signature?: string;
  publicKey?: string;
}): {
  valid: boolean;
  error?: string;
} {
  const { contractAddress, handle, userAddress, signature, publicKey } = params;

  // Validate contract address
  const addressValidation = validateContractAddress(contractAddress);
  if (!addressValidation.valid) {
    return addressValidation;
  }

  // Validate handle
  if (!handle) {
    return { valid: false, error: 'Handle is required' };
  }

  // If user decryption, validate signature components
  if (userAddress || signature || publicKey) {
    if (!userAddress) {
      return { valid: false, error: 'User address is required for user decryption' };
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return { valid: false, error: 'Invalid user address format' };
    }

    if (!signature) {
      return { valid: false, error: 'Signature is required for user decryption' };
    }

    if (!publicKey) {
      return { valid: false, error: 'Public key is required for user decryption' };
    }
  }

  return { valid: true };
}

/**
 * Validate array of values for batch encryption
 */
export function validateBatchEncryption(
  values: Array<{ value: any; type: EncryptionType }>
): {
  valid: boolean;
  error?: string;
} {
  if (!Array.isArray(values)) {
    return { valid: false, error: 'Values must be an array' };
  }

  if (values.length === 0) {
    return { valid: false, error: 'Values array cannot be empty' };
  }

  if (values.length > 100) {
    return { valid: false, error: 'Maximum 100 values allowed per batch' };
  }

  for (let i = 0; i < values.length; i++) {
    const validation = validateEncryption(values[i].value, values[i].type);
    if (!validation.valid) {
      return {
        valid: false,
        error: `Invalid value at index ${i}: ${validation.error}`
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize and validate string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  let sanitized = input.trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"\']/g, '');

  return sanitized;
}
