/**
 * FHEVM SDK - Universal SDK for building confidential applications
 * Framework-agnostic core with adapters for React, Vue, and Node.js
 */

export { FhevmClient, type FhevmClientConfig } from './core/FhevmClient';
export { EncryptionService } from './core/EncryptionService';
export { DecryptionService } from './core/DecryptionService';
export { ContractService } from './core/ContractService';

export type {
  EncryptedInput,
  DecryptedOutput,
  ContractCallOptions,
  NetworkConfig,
  FhevmInstance,
} from './types';

export { createFhevmClient, initializeFhevm } from './helpers';
