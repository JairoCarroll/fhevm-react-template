'use client';

import React, { useState } from 'react';
import { useEncryption } from 'fhevm-sdk/react';

export default function EncryptionDemo() {
  const { encrypt, isEncrypting, error } = useEncryption();
  const [value, setValue] = useState<string>('42');
  const [encryptedResult, setEncryptedResult] = useState<string>('');

  const handleEncrypt = async () => {
    const encrypted = await encrypt(Number(value), 'uint32');
    if (encrypted) {
      setEncryptedResult(Array.from(encrypted).join(','));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Encryption Demo</h2>
      <p className="text-gray-600 mb-6">
        Test the FHEVM SDK encryption functionality
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value to Encrypt
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter a number"
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={isEncrypting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error.message}
          </div>
        )}

        {encryptedResult && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Encrypted Result (bytes):</p>
            <p className="font-mono text-xs break-all">{encryptedResult.substring(0, 200)}...</p>
            <p className="text-xs text-gray-500 mt-2">
              Length: {encryptedResult.split(',').length} bytes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
