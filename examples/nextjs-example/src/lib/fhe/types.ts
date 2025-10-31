/**
 * FHE Type Definitions
 * Common types for FHE operations
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

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
  userAddress?: string;
  signature?: string;
  publicKey?: string;
}

export interface EncryptionRequest {
  value: number | boolean | string;
  type: EncryptionType;
  contractAddress?: string;
  userAddress?: string;
}

export interface FHEConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl: string;
  aclAddress?: string;
  kmsSignerAddress?: string;
}

export interface ContractCallParams {
  contractAddress: string;
  abi: any[];
  method: string;
  args?: any[];
  encrypted?: boolean;
}
