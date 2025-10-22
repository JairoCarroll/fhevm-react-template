# FHEVM SDK

Universal SDK for building confidential applications with Fully Homomorphic Encryption (FHE) on Ethereum Virtual Machine.

## Features

- **Framework-agnostic core**: Works with any JavaScript environment (Node.js, React, Vue, Next.js)
- **Wagmi-like API**: Familiar interface for web3 developers
- **Type-safe**: Full TypeScript support
- **Modular**: Import only what you need
- **Zero configuration**: Works out of the box with sensible defaults

## Installation

```bash
npm install fhevm-sdk ethers fhevmjs
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { createFhevmClient } from 'fhevm-sdk';

// Initialize client
const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
    gatewayUrl: 'https://gateway.fhevm.io'
  }
});

// Encrypt values
const encrypted = await client.encryption.encryptValue(42, 'uint32');

// Decrypt values
const decrypted = await client.decryption.userDecrypt(contractAddress, handle);
```

### React

```tsx
import { FhevmProvider, useFhevm, useEncryption } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{
      network: {
        chainId: 11155111,
        rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY'
      }
    }}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32');
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## API Reference

### Core Client

```typescript
import { FhevmClient } from 'fhevm-sdk';

const client = new FhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'YOUR_RPC_URL',
    gatewayUrl: 'GATEWAY_URL'
  }
});

await client.initialize();
```

### Encryption

```typescript
// Single value encryption
const encrypted = await client.encryption.encryptValue(42, 'uint32');

// Multiple values
const inputs = await client.encryption.encryptInputs(
  contractAddress,
  userAddress,
  [
    { value: 100, type: 'uint32' },
    { value: true, type: 'bool' }
  ]
);
```

### Decryption

```typescript
// User decrypt (requires signature)
const value = await client.decryption.userDecrypt(contractAddress, handle);

// Public decrypt (no signature)
const publicValue = await client.decryption.publicDecrypt(contractAddress, handle);

// Batch decrypt
const values = await client.decryption.batchDecrypt(contractAddress, handles);
```

### Contract Interactions

```typescript
// Read contract
const result = await client.contracts.read(
  contractAddress,
  abi,
  'balanceOf',
  [userAddress]
);

// Write to contract
const tx = await client.contracts.write(
  contractAddress,
  abi,
  'transfer',
  [recipient, amount]
);

// Write with encryption
const encryptedInputs = await client.encryption.encryptInputs(...);
const tx = await client.contracts.callWithEncryption(
  contractAddress,
  abi,
  'transferEncrypted',
  encryptedInputs
);
```

### React Hooks

```tsx
import {
  useFhevm,
  useEncryption,
  useDecryption,
  useContractRead,
  useContractWrite
} from 'fhevm-sdk/react';

// Client access
const { client, isInitialized } = useFhevm();

// Encryption
const { encrypt, encryptInputs, isEncrypting } = useEncryption();

// Decryption
const { userDecrypt, publicDecrypt, isDecrypting } = useDecryption();

// Contract read
const { data, isLoading, refetch } = useContractRead({
  address: contractAddress,
  abi: contractAbi,
  functionName: 'balanceOf',
  args: [userAddress]
});

// Contract write
const { write, writeWithEncryption, isLoading } = useContractWrite({
  address: contractAddress,
  abi: contractAbi,
  functionName: 'transfer'
});
```

## Supported Encryption Types

- `uint8` - 8-bit unsigned integer
- `uint16` - 16-bit unsigned integer
- `uint32` - 32-bit unsigned integer
- `uint64` - 64-bit unsigned integer
- `uint128` - 128-bit unsigned integer
- `bool` - Boolean value
- `address` - Ethereum address

## License

MIT
