'use client';

import React, { useState } from 'react';
import { useFhevm, useEncryption, useDecryption } from 'fhevm-sdk/react';
import WalletConnect from '@/components/WalletConnect';
import EncryptionDemo from '@/components/EncryptionDemo';
import TradingInterface from '@/components/TradingInterface';

export default function Home() {
  const { isInitialized, error } = useFhevm();
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            FHEVM Next.js Example
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Confidential Trading Platform with Fully Homomorphic Encryption
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error initializing FHEVM: {error.message}
            </div>
          )}

          {!isInitialized && !error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Initializing FHEVM...
            </div>
          )}

          {isInitialized && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              FHEVM SDK Ready
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <WalletConnect onConnect={() => setIsConnected(true)} />

          {isConnected && isInitialized && (
            <>
              <EncryptionDemo />
              <TradingInterface />
            </>
          )}
        </div>

        <footer className="text-center mt-16 text-gray-600">
          <p>Built with FHEVM SDK - Universal SDK for Confidential Applications</p>
        </footer>
      </div>
    </main>
  );
}
