'use client';

import React, { useState, useEffect } from 'react';
import { FhevmProvider } from 'fhevm-sdk/react';
import { BrowserProvider } from 'ethers';

export function Providers({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | undefined>();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
    }
  }, []);

  const config = {
    network: {
      chainId: 11155111, // Sepolia
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
      gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.fhevm.io',
    },
    provider,
  };

  return <FhevmProvider config={config}>{children}</FhevmProvider>;
}
