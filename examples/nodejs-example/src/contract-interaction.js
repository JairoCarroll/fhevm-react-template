#!/usr/bin/env node

/**
 * Contract interaction example
 * Demonstrates reading and writing to FHE contracts
 */

import { createFhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Simple ERC20-like ABI for demonstration
const EXAMPLE_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

async function main() {
  console.log('Contract Interaction Example\n');

  if (!process.env.CONTRACT_ADDRESS) {
    console.log('Please set CONTRACT_ADDRESS in .env file');
    process.exit(1);
  }

  try {
    // Setup provider and signer
    const provider = new JsonRpcProvider(
      process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo'
    );

    let signer;
    if (process.env.PRIVATE_KEY) {
      signer = new Wallet(process.env.PRIVATE_KEY, provider);
      console.log(`Using wallet: ${await signer.getAddress()}\n`);
    }

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.CHAIN_ID || '11155111'),
        rpcUrl: process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
        gatewayUrl: process.env.GATEWAY_URL,
      },
      provider,
      signer,
    });

    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Example: Read from contract
    console.log('--- Reading from Contract ---');
    try {
      const balance = await client.contracts.read(
        contractAddress,
        EXAMPLE_ABI,
        'balanceOf',
        [await signer.getAddress()]
      );
      console.log(`Balance: ${balance}`);
    } catch (error) {
      console.log('Read failed (this is normal for demo):', error.message);
    }

    // Example: Write to contract with encrypted data
    if (signer) {
      console.log('\n--- Encrypted Write Example ---');

      const userAddress = await signer.getAddress();
      const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      const amount = 100;

      console.log(`Encrypting amount: ${amount}`);
      const encryptedInputs = await client.encryption.encryptInputs(
        contractAddress,
        userAddress,
        [{ value: amount, type: 'uint64' }]
      );

      console.log('Encrypted successfully!');
      console.log('Ready to call contract with encrypted data');
      console.log('Input proof:', encryptedInputs.inputProof.substring(0, 50) + '...');

      // Note: Actual contract call would look like:
      // await client.contracts.callWithEncryption(
      //   contractAddress,
      //   abi,
      //   'transferEncrypted',
      //   encryptedInputs
      // );
    }

    console.log('\nExample completed!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
