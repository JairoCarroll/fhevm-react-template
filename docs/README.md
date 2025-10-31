# FHEVM SDK Documentation

Complete documentation for the FHEVM Universal SDK.

## Table of Contents

1. [Getting Started](./getting-started.md)
2. [SDK Reference](./sdk-reference.md)
3. [Examples](./examples.md)
4. [API Documentation](./api.md)
5. [Deployment Guide](./deployment.md)

## Quick Links

- [Main README](../README.md)
- [SDK Package](../packages/fhevm-sdk/README.md)
- [Next.js Example](../examples/nextjs-example/README.md)
- [Node.js Example](../examples/nodejs-example/README.md)

## Overview

The FHEVM SDK provides a universal, framework-agnostic solution for building confidential applications with Fully Homomorphic Encryption on Ethereum.

### Key Features

- Framework-agnostic core (works with any JS/TS environment)
- React hooks for easy integration
- TypeScript support
- Wagmi-like API design
- Comprehensive examples

### Architecture

```
FHEVM SDK
├── Core Services (framework-agnostic)
│   ├── FhevmClient
│   ├── EncryptionService
│   ├── DecryptionService
│   └── ContractService
├── React Integration
│   ├── FhevmProvider
│   └── Hooks (useFhevm, useEncryption, etc.)
└── Types & Utilities
```

## Installation

```bash
npm install fhevm-sdk
```

## Basic Usage

### Framework-Agnostic

```typescript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'YOUR_RPC_URL',
    gatewayUrl: 'https://gateway.fhevm.io'
  }
});

const encrypted = await client.encryption.encryptValue(42, 'uint32');
```

### React

```tsx
import { FhevmProvider, useFhevm, useEncryption } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{ network: { /* ... */ } }}>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { client } = useFhevm();
  const { encrypt } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(100, 'uint32');
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## Next Steps

- Read the [Getting Started Guide](./getting-started.md)
- Explore the [SDK Reference](./sdk-reference.md)
- Check out the [Examples](./examples.md)
- Review the [API Documentation](./api.md)

## Support

- GitHub Issues: [Report bugs](https://github.com/your-repo/issues)
- Documentation: Check individual package READMEs
- Examples: Explore the examples directory
