import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmClient } from '../core/FhevmClient';
import type { FhevmClientConfig } from '../types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isInitialized: false,
  error: null,
});

export interface FhevmProviderProps {
  config: FhevmClientConfig;
  children: React.ReactNode;
}

/**
 * FHEVM Provider - wraps your React app to provide FHEVM functionality
 * Similar to WagmiConfig or Web3Provider
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const fhevmClient = new FhevmClient(config);
        await fhevmClient.initialize();
        setClient(fhevmClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to initialize FHEVM client:', err);
      }
    };

    initClient();
  }, [config]);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access FHEVM client
 */
export function useFhevm() {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }

  return context;
}
