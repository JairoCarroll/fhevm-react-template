/**
 * BankingExample Component
 * Demonstrates confidential banking operations with FHE
 */

'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';
import { useDecryption } from 'fhevm-sdk/react';

export default function BankingExample() {
  const [balance, setBalance] = useState('10000');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [encryptedBalance, setEncryptedBalance] = useState<any>(null);

  const { encrypt, isEncrypting } = useEncryption();
  const { decrypt, isDecrypting } = useDecryption();

  const handleEncryptBalance = async () => {
    if (!balance) {
      alert('Please enter a balance');
      return;
    }

    try {
      const encrypted = await encrypt(parseInt(balance), 'uint64');
      setEncryptedBalance(encrypted);
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Failed to encrypt balance');
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !recipient) {
      alert('Please fill in all transfer fields');
      return;
    }

    try {
      // Encrypt the transfer amount
      const encryptedAmount = await encrypt(parseInt(transferAmount), 'uint64');

      // In a real app, this would call a smart contract
      console.log('Transfer details:', {
        recipient,
        amount: encryptedAmount,
        from: 'Current User'
      });

      alert('Transfer initiated! In a real app, this would call a smart contract.');
    } catch (err) {
      console.error('Transfer error:', err);
      alert('Failed to initiate transfer');
    }
  };

  return (
    <Card
      title="Confidential Banking"
      subtitle="Manage private financial transactions"
    >
      <div className="space-y-6">
        {/* Balance Section */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Private Balance</h4>

          <div className="space-y-3">
            <Input
              label="Balance (USD)"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Enter balance"
            />

            <Button
              variant="primary"
              onClick={handleEncryptBalance}
              isLoading={isEncrypting}
              className="w-full"
            >
              Encrypt Balance
            </Button>

            {encryptedBalance && (
              <div className="p-3 bg-green-100 border border-green-400 rounded">
                <p className="text-sm font-semibold text-green-800 mb-1">
                  Balance Encrypted
                </p>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {JSON.stringify(encryptedBalance).substring(0, 100)}...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Section */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Confidential Transfer</h4>

          <div className="space-y-3">
            <Input
              label="Recipient Address"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
            />

            <Input
              label="Transfer Amount (USD)"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount"
            />

            <Button
              variant="success"
              onClick={handleTransfer}
              isLoading={isEncrypting}
              className="w-full"
            >
              Execute Confidential Transfer
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h5 className="font-semibold text-blue-800 mb-2">How it works:</h5>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Balances are encrypted and stored on-chain</li>
            <li>Transfers happen without revealing amounts</li>
            <li>Only authorized parties can decrypt balances</li>
            <li>All computations happen on encrypted data</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
