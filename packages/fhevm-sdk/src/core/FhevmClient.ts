import type { BrowserProvider, Signer } from 'ethers';
import type { FhevmClientConfig, FhevmInstance, NetworkConfig } from '../types';
import { EncryptionService } from './EncryptionService';
import { DecryptionService } from './DecryptionService';
import { ContractService } from './ContractService';

/**
 * Main FHEVM Client - framework-agnostic core
 * Can be used in React, Vue, Node.js, or any JavaScript environment
 */
export class FhevmClient {
  public network: NetworkConfig;
  public provider?: BrowserProvider;
  public signer?: Signer;
  public fhevmInstance?: FhevmInstance;

  public encryption: EncryptionService;
  public decryption: DecryptionService;
  public contracts: ContractService;

  private initialized = false;

  constructor(config: FhevmClientConfig) {
    this.network = config.network;
    this.provider = config.provider;
    this.signer = config.signer;

    // Initialize services
    this.encryption = new EncryptionService(this);
    this.decryption = new DecryptionService(this);
    this.contracts = new ContractService(this);
  }

  /**
   * Initialize the FHEVM instance
   * Must be called before using encryption/decryption features
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Dynamic import to support different environments
      const fhevmjs = await import('fhevmjs');

      this.fhevmInstance = await fhevmjs.createInstance({
        chainId: this.network.chainId,
        network: this.network.rpcUrl,
        gatewayUrl: this.network.gatewayUrl,
        aclAddress: this.network.aclAddress,
        kmsSignerAddress: this.network.kmsSignerAddress,
      }) as FhevmInstance;

      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM: ${error}`);
    }
  }

  /**
   * Update provider and signer (useful for wallet connections)
   */
  updateProvider(provider: BrowserProvider, signer?: Signer): void {
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Check if client is ready for operations
   */
  isReady(): boolean {
    return this.initialized && !!this.fhevmInstance;
  }

  /**
   * Get current user address
   */
  async getAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('No signer available');
    }
    return await this.signer.getAddress();
  }
}

export type { FhevmClientConfig };
