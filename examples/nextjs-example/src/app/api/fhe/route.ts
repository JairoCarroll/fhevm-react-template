import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from 'fhevm-sdk';

/**
 * FHE Operations API Route
 * Handles general FHE operations on the server side
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, params } = body;

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
        gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
      }
    });

    let result;

    switch (operation) {
      case 'encrypt':
        result = await client.encryption.encryptValue(params.value, params.type);
        break;

      case 'batchEncrypt':
        result = await client.encryption.batchEncrypt(params.values);
        break;

      case 'createEncryptedInput':
        result = await client.encryption.createEncryptedInput(
          params.contractAddress,
          params.userAddress
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('FHE operation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE API endpoint',
    availableOperations: ['encrypt', 'batchEncrypt', 'createEncryptedInput']
  });
}
