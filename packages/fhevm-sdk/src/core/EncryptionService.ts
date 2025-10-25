import type { FhevmClient } from './FhevmClient';
import type { EncryptedInput, EncryptionType, SupportedValue } from '../types';

/**
 * Encryption Service - handles all encryption operations
 */
export class EncryptionService {
  constructor(private client: FhevmClient) {}

  /**
   * Encrypt a single value
   */
  async encryptValue(value: SupportedValue, type: EncryptionType): Promise<Uint8Array> {
    if (!this.client.fhevmInstance) {
      throw new Error('FHEVM instance not initialized. Call initialize() first.');
    }

    const numericValue = this.convertToNumeric(value, type);
    return await this.client.fhevmInstance.encrypt(numericValue, type);
  }

  /**
   * Create encrypted input for contract call
   * Supports chaining multiple values
   */
  async createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): Promise<any> {
    if (!this.client.fhevmInstance) {
      throw new Error('FHEVM instance not initialized');
    }

    return this.client.fhevmInstance.createEncryptedInput(contractAddress, userAddress);
  }

  /**
   * Encrypt multiple values in a single input
   */
  async encryptInputs(
    contractAddress: string,
    userAddress: string,
    inputs: Array<{ value: SupportedValue; type: EncryptionType }>
  ): Promise<EncryptedInput> {
    const inputBuilder = await this.createEncryptedInput(contractAddress, userAddress);

    // Add each input to the builder
    for (const input of inputs) {
      this.addValueToBuilder(inputBuilder, input.value, input.type);
    }

    // Encrypt and return
    const encrypted = await inputBuilder.encrypt();
    return {
      handles: encrypted.handles,
      inputProof: encrypted.inputProof,
    };
  }

  /**
   * Helper to add value to input builder based on type
   */
  private addValueToBuilder(builder: any, value: SupportedValue, type: EncryptionType): void {
    switch (type) {
      case 'uint8':
        builder.add8(Number(value));
        break;
      case 'uint16':
        builder.add16(Number(value));
        break;
      case 'uint32':
        builder.add32(Number(value));
        break;
      case 'uint64':
        builder.add64(BigInt(value));
        break;
      case 'uint128':
        builder.add128(BigInt(value));
        break;
      case 'bool':
        builder.addBool(Boolean(value));
        break;
      case 'address':
        builder.addAddress(String(value));
        break;
      default:
        throw new Error(`Unsupported encryption type: ${type}`);
    }
  }

  /**
   * Convert value to numeric type
   */
  private convertToNumeric(value: SupportedValue, type: EncryptionType): number | bigint {
    if (type === 'bool') {
      return value ? 1 : 0;
    }

    if (type === 'address') {
      // Convert address to BigInt for encryption
      const hex = String(value).replace('0x', '');
      return BigInt('0x' + hex);
    }

    if (type === 'uint64' || type === 'uint128') {
      return BigInt(value);
    }

    return Number(value);
  }
}
