# FHEVM Universal SDK Template

**Universal SDK for building confidential applications with Fully Homomorphic Encryption (FHE) on Ethereum.**

A framework-agnostic FHEVM SDK with comprehensive examples for React, Next.js, Vue, and Node.js - making it simple, consistent, and developer-friendly to build privacy-preserving applications.

🌐 **Live Application**: [https://fhe-agricultural-futures.vercel.app/](https://fhe-agricultural-futures.vercel.app/)

🔗 **Smart Contract**: [Sepolia Testnet - 0x3aA0E7401D4992423A77390e529598e805196ba4](https://sepolia.etherscan.io/address/0x3aA0E7401D4992423A77390e529598e805196ba4)

🎥 **Demo Video**: Download and watch `demo.mp4` in the repository to see the platform in action

## Overview

This project provides a **complete FHEVM SDK** that works across any JavaScript/TypeScript environment, along with ready-to-use examples demonstrating integration with popular frameworks.

### What's Included

- **Universal SDK Package** (`packages/fhevm-sdk`) - Framework-agnostic core with React hooks
- **Next.js Example** - Full-featured web application with SDK integration
- **Private Agricultural Futures** - Complete React/Next.js trading platform with FHE
- **Agricultural Futures** - Smart contract project with Hardhat deployment
- **Node.js CLI Example** - Backend/CLI usage demonstrations

## Quick Start

### Installation

Install all packages from the root:

```bash
npm install
```

### Build the SDK

```bash
npm run build:sdk
```

### Run Examples

```bash
# Next.js web application
npm run dev:nextjs

# Node.js CLI
npm run dev:nodejs

# Compile and deploy contracts
npm run compile:contracts
npm run deploy:contracts
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
│   ├── nextjs-example/              # Next.js web app with complete SDK integration
│   │   ├── src/
│   │   │   ├── app/                 # Next.js App Router
│   │   │   │   ├── api/             # API routes (encrypt, decrypt, compute, keys)
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/          # React components
│   │   │   │   ├── ui/              # UI components (Button, Input, Card)
│   │   │   │   ├── fhe/             # FHE components (FHEProvider, KeyManager, ComputationDemo)
│   │   │   │   └── examples/        # Use case examples (BankingExample, MedicalExample)
│   │   │   ├── lib/                 # Utilities
│   │   │   │   ├── fhe/             # FHE client/server integration
│   │   │   │   └── utils/           # Security and validation
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   └── types/               # TypeScript types
│   ├── private-agricultural-futures/ # Complete agricultural futures trading platform
│   │   ├── src/                     # React/Next.js application
│   │   │   ├── app/                 # Next.js App Router with layout and pages
│   │   │   ├── components/          # Trading UI components (5 modular components)
│   │   │   ├── hooks/               # Custom hooks (useWallet, useContract)
│   │   │   └── lib/                 # Utilities, types, and constants
│   │   └── contracts/               # Solidity smart contracts
│   ├── nodejs-example/              # Node.js CLI
│   └── agricultural-futures/        # Smart contract example with Hardhat
├── templates/               # Template projects (reference to examples)
├── docs/                    # Documentation
│   ├── getting-started.md
│   └── README.md
└── README.md
```

## FHEVM SDK Features

### Framework-Agnostic Core

Works with any JavaScript environment:

```typescript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'YOUR_RPC_URL',
    gatewayUrl: 'https://gateway.fhevm.io'
  }
});

// Encrypt values
const encrypted = await client.encryption.encryptValue(42, 'uint32');

// Decrypt with user signature
const decrypted = await client.decryption.userDecrypt(contractAddress, handle);

// Contract interactions
await client.contracts.write(contractAddress, abi, 'transfer', [recipient, amount]);
```

### React Integration

Wagmi-like hooks for React applications:

```tsx
import { FhevmProvider, useFhevm, useEncryption } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{ network: { chainId: 11155111, rpcUrl: '...' } }}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(100, 'uint32');
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Available Hooks

- `useFhevm()` - Access FHEVM client
- `useEncryption()` - Encrypt values
- `useDecryption()` - Decrypt values with EIP-712 signatures
- `useContract()` - Get contract instance
- `useContractRead()` - Read contract data
- `useContractWrite()` - Write to contracts with encryption

## SDK Capabilities

### Encryption Service

- Encrypt single values
- Batch encrypt multiple values
- Support for uint8, uint16, uint32, uint64, uint128, bool, address
- Create encrypted inputs for contract calls

### Decryption Service

- User decrypt with EIP-712 signatures
- Public decrypt (no signature required)
- Batch decryption
- Gateway integration

### Contract Service

- Simplified contract interactions
- Encrypted data handling
- Event listening
- Automatic ABI parsing

## Examples

### 1. Next.js Example

Full-featured web application demonstrating:

- Complete FHEVM SDK integration
- API routes for server-side FHE operations (encrypt, decrypt, compute)
- Custom React hooks (useFHE, useEncryption, useComputation)
- UI component library (Button, Input, Card)
- FHE-specific components (FHEProvider, KeyManager, ComputationDemo)
- Real-world use cases (BankingExample, MedicalExample)
- Wallet connection (MetaMask)
- TypeScript + Tailwind CSS
- Security utilities and validation

**Features:**
- **API Routes**: `/api/fhe/*` for encryption/decryption/computation, `/api/keys` for key management
- **Client-side Integration**: Complete lib/fhe with client.ts, server.ts, keys.ts
- **Custom Hooks**: useFHE, useEncryption, useComputation for easy integration
- **UI Components**: Reusable Button, Input, Card components
- **FHE Components**: KeyManager, ComputationDemo, custom FHEProvider
- **Examples**: Banking and Medical record use cases

**Start:**
```bash
npm run dev:nextjs
# Open http://localhost:3000
```

### 2. Private Agricultural Futures

Complete trading platform demonstrating:

- Full-stack React/Next.js application
- Confidential commodity futures trading
- MetaMask wallet integration
- 5 modular React components (WalletConnect, CreateContract, TraderProfile, ContractsList, MarketData)
- Custom hooks for Web3 interactions (useWallet, useContract)
- TypeScript + Bootstrap 5
- Cyberpunk-themed UI
- Smart contract integration with FHE
- Complete CRUD operations for futures contracts

**Start:**
```bash
cd examples/private-agricultural-futures
npm install
npm run dev
# Open http://localhost:3000
```

### 3. Agricultural Futures

Smart contract project with:

- Confidential commodity trading contracts
- FHE smart contracts (Solidity)
- Hardhat deployment scripts
- SDK integration examples

**Deploy:**
```bash
npm run compile:contracts
npm run deploy:contracts
```

### 4. Node.js CLI Example

Backend/CLI usage:

- Command-line encryption tools
- Contract interaction scripts
- No frontend dependencies
- Pure Node.js environment

**Run:**
```bash
npm run dev:nodejs
```

## Development Workflow

### Setup

1. Clone and install dependencies:
```bash
git clone <repo-url>
cd fhevm-react-template
npm install
```

2. Build the SDK:
```bash
npm run build:sdk
```

3. Run examples:
```bash
npm run dev:nextjs    # Next.js app
npm run dev:nodejs    # Node.js CLI
```

### Testing

```bash
# Test SDK
npm run test:sdk

# Test all packages
npm run test:all
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Smart Contract Integration

### Solidity Setup

```solidity
import { FHE, euint64, euint32 } from "@fhevm/solidity/lib/FHE.sol";

contract MyContract {
    euint32 private encryptedValue;

    function setEncryptedValue(bytes calldata encryptedInput) external {
        euint32 value = FHE.asEuint32(encryptedInput);
        encryptedValue = value;
        FHE.allow(encryptedValue, msg.sender);
    }
}
```

### SDK Usage

```typescript
// Encrypt input
const encrypted = await client.encryption.encryptInputs(
  contractAddress,
  userAddress,
  [{ value: 42, type: 'uint32' }]
);

// Call contract
await client.contracts.callWithEncryption(
  contractAddress,
  abi,
  'setEncryptedValue',
  encrypted
);

// Decrypt result
const decrypted = await client.decryption.userDecrypt(
  contractAddress,
  handle
);
```

## Use Cases

- **DeFi**: Confidential trading, private balances
- **Gaming**: Hidden game state, private randomness
- **Voting**: Anonymous voting systems
- **Healthcare**: Private medical records
- **Supply Chain**: Confidential pricing and quantities

## Architecture

### Design Principles

1. **Framework-agnostic core** - Works everywhere
2. **Modular adapters** - Framework-specific layers (React, Vue, etc.)
3. **Type-safe** - Full TypeScript support
4. **Developer-friendly** - Wagmi-like API
5. **Extensible** - Easy to add new features

### Package Organization

```
fhevm-sdk/
├── core/           # Framework-agnostic services
│   ├── FhevmClient.ts
│   ├── EncryptionService.ts
│   ├── DecryptionService.ts
│   └── ContractService.ts
├── react/          # React-specific hooks
│   ├── FhevmProvider.tsx
│   └── hooks/
└── types/          # TypeScript types
```

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or compatible Web3 wallet (for web examples)

## Configuration

Each example includes `.env.example` files:

```env
# Network
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
CHAIN_ID=11155111

# FHEVM
FHEVM_GATEWAY_URL=https://gateway.fhevm.io
ACL_ADDRESS=
KMS_SIGNER_ADDRESS=

# Wallet (for deployment)
PRIVATE_KEY=your_private_key
```

## API Documentation

Comprehensive API documentation is available in:

- [SDK README](packages/fhevm-sdk/README.md)
- [Next.js Example README](examples/nextjs-example/README.md)
- [Private Agricultural Futures README](examples/private-agricultural-futures/README.md)
- [Agricultural Futures README](examples/agricultural-futures/README.md)
- [Node.js Example README](examples/nodejs-example/README.md)

## Deployment

### Deploy Contracts

```bash
cd examples/agricultural-futures
npm run deploy
```

### Deploy Next.js App

```bash
cd examples/nextjs-example
npm run build
npm run start
```

Or deploy to Vercel:
```bash
vercel deploy
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs GitHub](https://github.com/zama-ai/fhevmjs)
- [Solidity FHE Library](https://github.com/zama-ai/fhevm)
- [Example Applications](https://github.com/zama-ai/fhevm-hardhat-template)

## License

MIT

## Support

- GitHub Issues: [Report bugs or request features]
- Documentation: Check individual package READMEs
- Examples: Explore the examples directory

---

Built with [Zama FHEVM](https://www.zama.ai/fhevm) - Confidential Smart Contracts
