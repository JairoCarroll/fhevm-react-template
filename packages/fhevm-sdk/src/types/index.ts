import type { BrowserProvider, Signer, Contract } from 'ethers';

/**
 * Core FHEVM types
 */
export interface FhevmInstance {
  encrypt: (value: number | bigint, type: string) => Promise<Uint8Array>;
  createEncryptedInput: (contractAddress: string, userAddress: string) => EncryptedInputBuilder;
  getInstance: () => any;
}

export interface EncryptedInputBuilder {
  add8: (value: number) => EncryptedInputBuilder;
  add16: (value: number) => EncryptedInputBuilder;
  add32: (value: number) => EncryptedInputBuilder;
  add64: (value: bigint) => EncryptedInputBuilder;
  add128: (value: bigint) => EncryptedInputBuilder;
  addBool: (value: boolean) => EncryptedInputBuilder;
  addAddress: (address: string) => EncryptedInputBuilder;
  encrypt: () => Promise<{ handles: Uint8Array[]; inputProof: string }>;
}

export interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: string;
  data?: any;
}

export interface DecryptedOutput {
  value: bigint | number | boolean | string;
  type: string;
}

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl?: string;
  aclAddress?: string;
  kmsSignerAddress?: string;
}

export interface ContractCallOptions {
  gasLimit?: bigint;
  value?: bigint;
  overrides?: any;
}

/**
 * Client configuration
 */
export interface FhevmClientConfig {
  network: NetworkConfig;
  provider?: BrowserProvider;
  signer?: Signer;
}

/**
 * Contract interaction types
 */
export interface ContractInstance {
  address: string;
  abi: any[];
  contract: Contract;
}

/**
 * Decryption request types
 */
export interface DecryptRequest {
  contractAddress: string;
  handle: bigint;
  userAddress: string;
}

export interface DecryptResponse {
  signature: string;
  decryptedValue: bigint | number | boolean;
}

/**
 * Event types
 */
export interface FhevmEvent {
  name: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
}

/**
 * Utility types
 */
export type EncryptionType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'bool' | 'address';

export type SupportedValue = number | bigint | boolean | string;
