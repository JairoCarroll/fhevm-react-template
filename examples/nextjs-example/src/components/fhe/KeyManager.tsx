/**
 * KeyManager Component
 * Manages FHE encryption keys
 */

'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  getCurrentPublicKey,
  refreshKeys,
  getStoredPublicKey,
  storePublicKey,
  clearStoredKeys
} from '@/lib/fhe/keys';

export default function KeyManager() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    loadPublicKey();
  }, []);

  const loadPublicKey = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Try to get from storage first
      const stored = getStoredPublicKey();
      if (stored) {
        setPublicKey(stored);
        return;
      }

      // Fetch new key
      const key = await getCurrentPublicKey();
      setPublicKey(key);
      storePublicKey(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load public key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError('');

      await refreshKeys();
      const newKey = await getCurrentPublicKey();

      setPublicKey(newKey);
      storePublicKey(newKey);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearStoredKeys();
    setPublicKey('');
    setLastRefresh(null);
  };

  return (
    <Card
      title="Key Manager"
      subtitle="Manage FHE encryption keys"
      footer={
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRefresh}
            isLoading={isLoading}
          >
            Refresh Keys
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClear}
            disabled={!publicKey}
          >
            Clear
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Public Key</h4>
          {publicKey ? (
            <div className="p-3 bg-gray-100 rounded font-mono text-xs break-all">
              {publicKey.substring(0, 100)}...
            </div>
          ) : (
            <div className="p-3 bg-gray-100 rounded text-gray-500 text-sm">
              {isLoading ? 'Loading key...' : 'No key loaded'}
            </div>
          )}
        </div>

        {lastRefresh && (
          <div className="text-sm text-gray-600">
            Last refreshed: {lastRefresh.toLocaleString()}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Keys are stored in session storage and cleared when you close the browser.
        </div>
      </div>
    </Card>
  );
}
