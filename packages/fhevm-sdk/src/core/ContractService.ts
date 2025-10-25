import { Contract } from 'ethers';
import type { FhevmClient } from './FhevmClient';
import type { ContractCallOptions, ContractInstance } from '../types';

/**
 * Contract Service - simplified contract interactions with encrypted data
 */
export class ContractService {
  private contracts: Map<string, ContractInstance> = new Map();

  constructor(private client: FhevmClient) {}

  /**
   * Create or get contract instance
   */
  getContract(address: string, abi: any[]): Contract {
    const key = address.toLowerCase();

    if (this.contracts.has(key)) {
      return this.contracts.get(key)!.contract;
    }

    if (!this.client.provider) {
      throw new Error('Provider not available');
    }

    const contract = new Contract(
      address,
      abi,
      this.client.signer || this.client.provider
    );

    this.contracts.set(key, {
      address,
      abi,
      contract,
    });

    return contract;
  }

  /**
   * Call contract method with encrypted inputs
   */
  async callWithEncryption(
    contractAddress: string,
    abi: any[],
    methodName: string,
    encryptedInputs: { handles: Uint8Array[]; inputProof: string },
    options?: ContractCallOptions
  ): Promise<any> {
    const contract = this.getContract(contractAddress, abi);

    // Prepare transaction options
    const txOptions: any = {};
    if (options?.gasLimit) txOptions.gasLimit = options.gasLimit;
    if (options?.value) txOptions.value = options.value;
    if (options?.overrides) Object.assign(txOptions, options.overrides);

    // Call contract method with encrypted data
    const tx = await contract[methodName](
      encryptedInputs.inputProof,
      ...encryptedInputs.handles,
      txOptions
    );

    return await tx.wait();
  }

  /**
   * Read contract method (view/pure functions)
   */
  async read(
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[] = []
  ): Promise<any> {
    const contract = this.getContract(contractAddress, abi);
    return await contract[methodName](...params);
  }

  /**
   * Write to contract (state-changing functions)
   */
  async write(
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[] = [],
    options?: ContractCallOptions
  ): Promise<any> {
    const contract = this.getContract(contractAddress, abi);

    const txOptions: any = {};
    if (options?.gasLimit) txOptions.gasLimit = options.gasLimit;
    if (options?.value) txOptions.value = options.value;
    if (options?.overrides) Object.assign(txOptions, options.overrides);

    const tx = await contract[methodName](...params, txOptions);
    return await tx.wait();
  }

  /**
   * Listen to contract events
   */
  onEvent(
    contractAddress: string,
    abi: any[],
    eventName: string,
    callback: (event: any) => void
  ): () => void {
    const contract = this.getContract(contractAddress, abi);

    contract.on(eventName, callback);

    // Return cleanup function
    return () => {
      contract.off(eventName, callback);
    };
  }

  /**
   * Get past events
   */
  async getPastEvents(
    contractAddress: string,
    abi: any[],
    eventName: string,
    fromBlock: number = 0,
    toBlock: number | 'latest' = 'latest'
  ): Promise<any[]> {
    const contract = this.getContract(contractAddress, abi);

    const filter = contract.filters[eventName]();
    return await contract.queryFilter(filter, fromBlock, toBlock);
  }

  /**
   * Clear cached contracts
   */
  clearCache(): void {
    this.contracts.clear();
  }
}
