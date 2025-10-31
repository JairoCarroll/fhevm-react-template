/**
 * Security Utilities
 * Helper functions for secure operations
 */

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate numeric input
 */
export function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate encryption type
 */
export function isValidEncryptionType(type: string): boolean {
  const validTypes = [
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uint128',
    'uint256',
    'bool',
    'address'
  ];
  return validTypes.includes(type);
}

/**
 * Rate limiting helper (client-side)
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number = 10, timeWindow: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

/**
 * Hash sensitive data for logging (one-way)
 */
export function hashForLogging(data: string): string {
  // Simple hash for demonstration - use proper hashing in production
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Validate signature format
 */
export function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

/**
 * Secure random number generation
 */
export function secureRandom(min: number, max: number): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const range = max - min;
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return min + (randomBuffer[0] % range);
  }
  // Fallback to Math.random (less secure)
  return Math.floor(Math.random() * (max - min)) + min;
}
