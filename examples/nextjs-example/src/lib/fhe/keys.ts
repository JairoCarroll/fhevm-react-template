/**
 * Key Management Utilities
 * Handles FHEVM key operations
 */

import { getFhevmClient, initFhevmClient } from './client';

/**
 * Get the current public key
 */
export async function getCurrentPublicKey(): Promise<string> {
  const client = await initFhevmClient();
  return client.getPublicKey();
}

/**
 * Fetch public key from API
 */
export async function fetchPublicKeyFromAPI(): Promise<string> {
  const response = await fetch('/api/keys?action=publicKey');
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch public key');
  }

  return data.publicKey;
}

/**
 * Refresh encryption keys
 */
export async function refreshKeys(): Promise<void> {
  const response = await fetch('/api/keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'refresh' })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to refresh keys');
  }
}

/**
 * Validate public key format
 */
export function isValidPublicKey(key: string): boolean {
  // Basic validation - adjust based on actual key format
  return typeof key === 'string' && key.length > 0;
}

/**
 * Store public key in session storage
 */
export function storePublicKey(key: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('fhevm_public_key', key);
  }
}

/**
 * Retrieve public key from session storage
 */
export function getStoredPublicKey(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('fhevm_public_key');
  }
  return null;
}

/**
 * Clear stored keys
 */
export function clearStoredKeys(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('fhevm_public_key');
  }
}
