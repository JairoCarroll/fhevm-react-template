'use client';

import React, { useState } from 'react';
import { useFhevm, useEncryption } from 'fhevm-sdk/react';

const CROP_TYPES = ['WHEAT', 'RICE', 'CORN', 'SOYBEANS', 'COTTON'];

export default function TradingInterface() {
  const { client } = useFhevm();
  const { encryptInputs, isEncrypting } = useEncryption();

  const [formData, setFormData] = useState({
    cropType: 'WHEAT',
    quantity: '100',
    price: '1000000000000000000', // 1 ETH in wei
    seller: '',
  });

  const [result, setResult] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client) {
      setResult('Client not initialized');
      return;
    }

    try {
      const userAddress = await client.getAddress();

      // Encrypt trading data
      const encrypted = await encryptInputs(
        '0x0000000000000000000000000000000000000000', // Replace with actual contract
        userAddress,
        [
          { value: Number(formData.quantity), type: 'uint32' },
          { value: BigInt(formData.price), type: 'uint64' },
        ]
      );

      if (encrypted) {
        setResult('Trading data encrypted successfully! Ready to create futures contract.');
        console.log('Encrypted inputs:', encrypted);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Create Futures Contract</h2>
      <p className="text-gray-600 mb-6">
        All trading data is encrypted before being sent to the blockchain
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commodity Type
          </label>
          <select
            value={formData.cropType}
            onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {CROP_TYPES.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (tons) - Will be encrypted
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Ton (wei) - Will be encrypted
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seller Address
          </label>
          <input
            type="text"
            value={formData.seller}
            onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="0x..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isEncrypting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt & Preview Contract'}
        </button>
      </form>

      {result && (
        <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          {result}
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Privacy Note:</strong> Your quantity and price are encrypted before leaving your browser.
          Only you and authorized parties can decrypt this data.
        </p>
      </div>
    </div>
  );
}
