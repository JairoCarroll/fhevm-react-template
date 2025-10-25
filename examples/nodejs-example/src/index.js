#!/usr/bin/env node

/**
 * Node.js CLI Example for FHEVM SDK
 * Demonstrates framework-agnostic usage
 */

import { createFhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('FHEVM SDK - Node.js CLI Example\n');

  try {
    // Initialize FHEVM client
    console.log('Initializing FHEVM client...');
    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.CHAIN_ID || '11155111'),
        rpcUrl: process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
        gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.fhevm.io',
      },
    });

    console.log('FHEVM client initialized successfully!\n');

    // Demonstrate encryption
    console.log('--- Encryption Demo ---');
    const valueToEncrypt = 42;
    console.log(`Encrypting value: ${valueToEncrypt}`);

    const encrypted = await client.encryption.encryptValue(valueToEncrypt, 'uint32');
    console.log(`Encrypted (${encrypted.length} bytes): ${Array.from(encrypted).slice(0, 10).join(', ')}...`);

    // Demonstrate batch encryption
    console.log('\n--- Batch Encryption Demo ---');
    const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
    const contractAddress = '0x0000000000000000000000000000000000000000';

    const inputs = [
      { value: 100, type: 'uint32' },
      { value: 1000000000000000000n, type: 'uint64' },
      { value: true, type: 'bool' },
    ];

    console.log('Encrypting multiple inputs:', inputs);
    const encryptedInputs = await client.encryption.encryptInputs(
      contractAddress,
      userAddress,
      inputs
    );

    console.log(`Encrypted ${encryptedInputs.handles.length} values`);
    console.log('Input proof:', encryptedInputs.inputProof.substring(0, 50) + '...');

    console.log('\n--- SDK Info ---');
    console.log(`Network: ${client.network.chainId}`);
    console.log(`RPC: ${client.network.rpcUrl}`);
    console.log(`Gateway: ${client.network.gatewayUrl || 'Not configured'}`);
    console.log(`Client Ready: ${client.isReady()}`);

    console.log('\nExample completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
