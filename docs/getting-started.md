# Getting Started with FHEVM SDK

This guide will help you get started with the FHEVM Universal SDK.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Basic understanding of Ethereum and Web3
- MetaMask or compatible wallet (for web applications)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fhevm-react-template
npm install
```

### 2. Build the SDK

```bash
npm run build:sdk
```

### 3. Run Examples

```bash
# Next.js web application
npm run dev:nextjs

# Node.js CLI
npm run dev:nodejs
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # Universal FHEVM SDK
│       ├── src/
│       │   ├── core/        # Framework-agnostic core
│       │   ├── react/       # React hooks and providers
│       │   ├── types/       # TypeScript definitions
│       │   └── helpers/     # Utility functions
│       └── README.md
├── examples/
│   ├── nextjs-example/      # Next.js web app
│   ├── nodejs-example/      # Node.js CLI
│   └── agricultural-futures/ # Smart contract example
├── templates/               # Template projects
├── docs/                    # Documentation
└── README.md
```

## Configuration

Each example includes an `.env.example` file. Copy it to `.env` and configure:

```env
# Network Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# FHEVM Configuration
NEXT_PUBLIC_FHEVM_GATEWAY_URL=https://gateway.fhevm.io

# Deployment (optional)
PRIVATE_KEY=your_private_key_for_deployment
```

## Your First FHE Application

### Step 1: Initialize the Client

```typescript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    gatewayUrl: 'https://gateway.fhevm.io'
  }
});
```

### Step 2: Encrypt Data

```typescript
// Encrypt a single value
const encrypted = await client.encryption.encryptValue(42, 'uint32');

// Batch encrypt multiple values
const batch = await client.encryption.batchEncrypt([
  { value: 100, type: 'uint32' },
  { value: true, type: 'bool' }
]);
```

### Step 3: Interact with Contracts

```typescript
// Create encrypted input for contract
const input = await client.encryption.createEncryptedInput(
  contractAddress,
  userAddress
);
await input.add('uint32', 42);

// Call contract with encrypted data
await client.contracts.write(
  contractAddress,
  abi,
  'setEncryptedValue',
  [input]
);
```

### Step 4: Decrypt Results

```typescript
// User decrypt (requires signature)
const decrypted = await client.decryption.userDecrypt(
  contractAddress,
  handle,
  userAddress,
  signature,
  publicKey
);

// Public decrypt (no signature)
const publicValue = await client.decryption.publicDecrypt(
  contractAddress,
  handle
);
```

## Using with React

```tsx
import { FhevmProvider, useFhevm, useEncryption } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{
      network: {
        chainId: 11155111,
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
        gatewayUrl: 'https://gateway.fhevm.io'
      }
    }}>
      <EncryptionComponent />
    </FhevmProvider>
  );
}

function EncryptionComponent() {
  const { isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const result = await encrypt(100, 'uint32');
    console.log('Encrypted:', result);
  };

  if (!isInitialized) {
    return <div>Initializing FHEVM...</div>;
  }

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

## Next Steps

- Explore the [SDK Reference](./sdk-reference.md)
- Review [Examples](./examples.md)
- Learn about [API Routes](./api.md)
- Read the [Deployment Guide](./deployment.md)

## Common Issues

### FHEVM Not Initializing

Ensure your RPC URL is correct and the network is supported.

### Encryption Fails

Check that the value type matches the encryption type (uint8, uint16, etc.).

### Decryption Requires Signature

User decryption requires an EIP-712 signature. Use `publicDecrypt` if no signature is needed.

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs GitHub](https://github.com/zama-ai/fhevmjs)
- [Example Applications](../examples/)
