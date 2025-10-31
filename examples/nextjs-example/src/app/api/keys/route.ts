import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from 'fhevm-sdk';

/**
 * Key Management API Route
 * Handles FHEVM key operations
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
        gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
      }
    });

    switch (action) {
      case 'publicKey':
        const publicKey = await client.getPublicKey();
        return NextResponse.json({
          success: true,
          publicKey
        });

      case 'info':
        return NextResponse.json({
          success: true,
          info: {
            network: process.env.NEXT_PUBLIC_CHAIN_ID,
            gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL,
            ready: true
          }
        });

      default:
        return NextResponse.json({
          message: 'Key Management API',
          availableActions: ['publicKey', 'info']
        });
    }
  } catch (error) {
    console.error('Key management error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Key operation failed' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for key generation or refresh
 */
export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json();

    const client = await createFhevmClient({
      network: {
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
        gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
      }
    });

    switch (action) {
      case 'refresh':
        // Re-initialize client to refresh keys
        const newClient = await createFhevmClient({
          network: {
            chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
            rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
            gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io'
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Keys refreshed successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Key operation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Key operation failed' },
      { status: 500 }
    );
  }
}
