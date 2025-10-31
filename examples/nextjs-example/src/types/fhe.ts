/**
 * FHE Type Definitions
 * TypeScript types for FHE operations
 */

export type EncryptionType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'bool'
  | 'address';

export interface EncryptedValue {
  data: any;
  type: EncryptionType;
  timestamp: number;
}

export interface DecryptionResult {
  value: number | boolean | string;
  handle: string;
  contractAddress: string;
  timestamp: number;
}

export interface EncryptionRequest {
  value: number | boolean | string;
  type: EncryptionType;
  contractAddress?: string;
  userAddress?: string;
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
  userAddress?: string;
  signature?: string;
  publicKey?: string;
  isPublic?: boolean;
}

export interface FHEConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl: string;
  aclAddress?: string;
  kmsSignerAddress?: string;
}

export interface EncryptedInput {
  add: (type: EncryptionType, value: number | boolean | string) => Promise<any>;
  encrypt: () => Promise<any>;
}

export interface BatchEncryptionItem {
  value: number | boolean | string;
  type: EncryptionType;
}

export interface ComputationParams {
  contractAddress: string;
  abi: any[];
  method: string;
  args?: any[];
  encryptedInputs?: any;
}
