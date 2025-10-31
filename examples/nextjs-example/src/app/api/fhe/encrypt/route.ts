import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from 'fhevm-sdk';

/**
 * Encryption API Route
 * Encrypts values using FHEVM
 */
export async function POST(request: NextRequest) {
  try {
    const { value, type, contractAddress, userAddress } = await request.json();

    if (!value || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: value and type' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
        gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
      }
    });

    let encrypted;

    if (contractAddress && userAddress) {
      // Create encrypted input for contract
      const input = await client.encryption.createEncryptedInput(
        contractAddress,
        userAddress
      );
      encrypted = await input.add(type, value);
    } else {
      // Simple encryption
      encrypted = await client.encryption.encryptValue(value, type);
    }

    return NextResponse.json({
      success: true,
      encrypted,
      metadata: {
        type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Encryption failed' },
      { status: 500 }
    );
  }
}
