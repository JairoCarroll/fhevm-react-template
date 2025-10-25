#!/usr/bin/env node

/**
 * Encryption example - encrypt values from command line
 */

import { createFhevmClient } from 'fhevm-sdk';
import dotenv from 'dotenv';

dotenv.config();

async function encrypt() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npm run encrypt <value> <type>');
    console.log('Types: uint8, uint16, uint32, uint64, uint128, bool');
    console.log('Example: npm run encrypt 42 uint32');
    process.exit(1);
  }

  const [value, type] = args;

  console.log(`Encrypting: ${value} (${type})\n`);

  try {
    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.CHAIN_ID || '11155111'),
        rpcUrl: process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
        gatewayUrl: process.env.GATEWAY_URL,
      },
    });

    let parsedValue;
    if (type.includes('64') || type.includes('128')) {
      parsedValue = BigInt(value);
    } else if (type === 'bool') {
      parsedValue = value === 'true';
    } else {
      parsedValue = Number(value);
    }

    const encrypted = await client.encryption.encryptValue(parsedValue, type);

    console.log('Encrypted successfully!');
    console.log(`Length: ${encrypted.length} bytes`);
    console.log(`Data: ${Array.from(encrypted).join(',')}`);
  } catch (error) {
    console.error('Encryption failed:', error.message);
    process.exit(1);
  }
}

encrypt();
