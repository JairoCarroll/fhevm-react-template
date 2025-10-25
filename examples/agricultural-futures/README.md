# Agricultural Futures Trading Example

Confidential agricultural commodity futures trading platform powered by FHEVM SDK.

## Overview

This example demonstrates how to use the FHEVM SDK to build a privacy-preserving agricultural futures trading platform where:

- Trading quantities remain encrypted
- Prices are confidential
- Contract values are computed on encrypted data
- Only authorized parties can decrypt their own data

## Features

- **Confidential Trading**: All sensitive data encrypted end-to-end
- **Multi-Commodity**: Support for WHEAT, RICE, CORN, SOYBEANS, and COTTON
- **Two-Party Confirmation**: Mutual confirmation system
- **Automated Settlement**: 30-day settlement period
- **SDK Integration**: Uses FHEVM SDK for all encryption/decryption

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Compile Contracts

```bash
npm run compile
```

### Deploy

```bash
# Deploy to Sepolia testnet
npm run deploy

# Deploy to local network
npm run deploy:local
```

## Using the SDK

This example showcases how to integrate the FHEVM SDK with smart contracts:

```typescript
import { createFhevmClient } from 'fhevm-sdk';

// Initialize SDK
const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    gatewayUrl: process.env.FHEVM_GATEWAY_URL
  }
});

// Encrypt trading data
const encrypted = await client.encryption.encryptInputs(
  contractAddress,
  userAddress,
  [
    { value: quantity, type: 'uint32' },
    { value: price, type: 'uint64' }
  ]
);

// Call contract with encrypted data
await client.contracts.callWithEncryption(
  contractAddress,
  abi,
  'createFuturesContract',
  encrypted
);
```

## Smart Contract

The `PrivateAgriculturalFutures.sol` contract demonstrates:

- Encrypted state variables using FHEVM types (euint32, euint64)
- FHE computations on encrypted data
- Access control for encrypted data
- Event emission for public transparency while maintaining data privacy

## License

MIT
