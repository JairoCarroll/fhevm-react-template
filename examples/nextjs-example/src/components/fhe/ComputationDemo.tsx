/**
 * ComputationDemo Component
 * Demonstrates homomorphic computation on encrypted data
 */

'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useComputation } from '@/hooks/useComputation';
import { useEncryption } from '@/hooks/useEncryption';

export default function ComputationDemo() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');
  const [contractAddress, setContractAddress] = useState('');

  const { encrypt, isEncrypting } = useEncryption();
  const { compute, isComputing, result, error } = useComputation();

  const handleCompute = async () => {
    if (!value1 || !value2 || !contractAddress) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Encrypt both values
      const encrypted1 = await encrypt(parseInt(value1), 'uint32');
      const encrypted2 = await encrypt(parseInt(value2), 'uint32');

      // Note: This is a demonstration
      // In a real application, you would call a smart contract method
      console.log('Encrypted values:', { encrypted1, encrypted2 });

      alert('Computation would be performed on contract. This is a demo.');
    } catch (err) {
      console.error('Computation error:', err);
    }
  };

  return (
    <Card
      title="Homomorphic Computation Demo"
      subtitle="Perform calculations on encrypted data"
    >
      <div className="space-y-4">
        <Input
          label="Contract Address"
          type="text"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value 1"
            type="number"
            placeholder="Enter a number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />

          <Input
            label="Value 2"
            type="number"
            placeholder="Enter a number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
          >
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
            <option value="multiply">Multiply (×)</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error.message}
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Result:</h4>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleCompute}
          isLoading={isEncrypting || isComputing}
          className="w-full"
        >
          Compute on Encrypted Data
        </Button>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <strong>Note:</strong> This demo encrypts the values. In a production app,
          these would be sent to a smart contract for homomorphic computation,
          and the result would remain encrypted until you decrypt it.
        </div>
      </div>
    </Card>
  );
}
