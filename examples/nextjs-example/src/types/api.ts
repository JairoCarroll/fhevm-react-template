/**
 * API Type Definitions
 * TypeScript types for API requests and responses
 */

import type { EncryptionType } from './fhe';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface EncryptAPIRequest {
  value: number | boolean | string;
  type: EncryptionType;
  contractAddress?: string;
  userAddress?: string;
}

export interface EncryptAPIResponse {
  success: boolean;
  encrypted: any;
  metadata: {
    type: EncryptionType;
    timestamp: string;
  };
}

export interface DecryptAPIRequest {
  handle: string;
  contractAddress: string;
  userAddress?: string;
  signature?: string;
  publicKey?: string;
  isPublic?: boolean;
}

export interface DecryptAPIResponse {
  success: boolean;
  decrypted: number | boolean | string;
  metadata: {
    handle: string;
    contractAddress: string;
    timestamp: string;
  };
}

export interface ComputeAPIRequest {
  contractAddress: string;
  abi: any[];
  method: string;
  args?: any[];
  userAddress?: string;
}

export interface ComputeAPIResponse {
  success: boolean;
  result: any;
  metadata: {
    contractAddress: string;
    method: string;
    timestamp: string;
  };
}

export interface KeyAPIResponse {
  success: boolean;
  publicKey?: string;
  info?: {
    network: string;
    gatewayUrl: string;
    ready: boolean;
  };
}

export interface FHEOperationRequest {
  operation: 'encrypt' | 'batchEncrypt' | 'createEncryptedInput';
  params: any;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}
