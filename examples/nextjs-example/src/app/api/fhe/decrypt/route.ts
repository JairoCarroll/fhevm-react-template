import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from 'fhevm-sdk';

/**
 * Decryption API Route
 * Handles decryption of encrypted values
 */
export async function POST(request: NextRequest) {
  try {
    const {
      handle,
      contractAddress,
      userAddress,
      signature,
      publicKey,
      isPublic = false
    } = await request.json();

    if (!handle || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: handle and contractAddress' },
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

    let decrypted;

    if (isPublic) {
      // Public decryption (no signature required)
      decrypted = await client.decryption.publicDecrypt(contractAddress, handle);
    } else {
      // User decryption (requires signature)
      if (!userAddress || !signature || !publicKey) {
        return NextResponse.json(
          { error: 'Missing required fields for user decryption: userAddress, signature, publicKey' },
          { status: 400 }
        );
      }

      decrypted = await client.decryption.userDecrypt(
        contractAddress,
        handle,
        userAddress,
        signature,
        publicKey
      );
    }

    return NextResponse.json({
      success: true,
      decrypted,
      metadata: {
        handle,
        contractAddress,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Decryption failed' },
      { status: 500 }
    );
  }
}
