/**
 * React hooks and adapters for FHEVM SDK
 * Provides wagmi-like interface for React applications
 */

export { FhevmProvider, useFhevm } from './FhevmProvider';
export { useEncryption } from './hooks/useEncryption';
export { useDecryption } from './hooks/useDecryption';
export { useContract } from './hooks/useContract';
export { useContractWrite } from './hooks/useContractWrite';
export { useContractRead } from './hooks/useContractRead';

export type { FhevmProviderProps } from './FhevmProvider';
