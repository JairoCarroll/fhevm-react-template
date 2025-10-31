import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from 'fhevm-sdk';
import { ethers } from 'ethers';

/**
 * Homomorphic Computation API Route
 * Performs computations on encrypted data
 */
export async function POST(request: NextRequest) {
  try {
    const {
      contractAddress,
      abi,
      method,
      args = [],
      userAddress
    } = await request.json();

    if (!contractAddress || !abi || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: contractAddress, abi, method' },
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

    // Execute contract method
    const result = await client.contracts.read(
      contractAddress,
      abi,
      method,
      args
    );

    return NextResponse.json({
      success: true,
      result,
      metadata: {
        contractAddress,
        method,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Computation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Computation failed' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve computation status or info
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contractAddress = searchParams.get('contract');

  return NextResponse.json({
    message: 'Homomorphic Computation API',
    availableMethods: [
      'read - Read from contract',
      'write - Write to contract with encrypted data',
      'compute - Perform computation on encrypted values'
    ],
    contractAddress: contractAddress || 'Not specified'
  });
}
