/**
 * FHEProvider Component
 * Provides FHE context to the application
 * This is a wrapper around the SDK's FhevmProvider with additional functionality
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FhevmProvider } from 'fhevm-sdk/react';
import { initFhevmClient } from '@/lib/fhe/client';
import type { FHEConfig } from '@/types/fhe';

interface FHEContextValue {
  isReady: boolean;
  error: Error | null;
  config: FHEConfig | null;
}

const FHEContext = createContext<FHEContextValue>({
  isReady: false,
  error: null,
  config: null
});

export function useFHEContext() {
  return useContext(FHEContext);
}

interface FHEProviderProps {
  children: React.ReactNode;
  config?: Partial<FHEConfig>;
}

export default function CustomFHEProvider({ children, config }: FHEProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fheConfig, setFheConfig] = useState<FHEConfig | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const defaultConfig: FHEConfig = {
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
          rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
          gatewayUrl: process.env.NEXT_PUBLIC_FHEVM_GATEWAY_URL || 'https://gateway.fhevm.io',
          ...config
        };

        setFheConfig(defaultConfig);

        // Initialize client
        await initFhevmClient({
          chainId: defaultConfig.chainId,
          rpcUrl: defaultConfig.rpcUrl,
          gatewayUrl: defaultConfig.gatewayUrl
        });

        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize FHE'));
      }
    }

    initialize();
  }, [config]);

  const contextValue: FHEContextValue = {
    isReady,
    error,
    config: fheConfig
  };

  return (
    <FHEContext.Provider value={contextValue}>
      <FhevmProvider
        config={{
          network: fheConfig
            ? {
                chainId: fheConfig.chainId,
                rpcUrl: fheConfig.rpcUrl,
                gatewayUrl: fheConfig.gatewayUrl
              }
            : undefined
        }}
      >
        {children}
      </FhevmProvider>
    </FHEContext.Provider>
  );
}
