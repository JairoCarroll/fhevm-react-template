# Next.js FHEVM Example

Complete Next.js application showcasing FHEVM SDK integration for confidential trading.

## Features

- **FHEVM Provider Setup**: Demonstrates how to integrate FHEVM SDK with Next.js
- **React Hooks**: Uses `useFhevm`, `useEncryption`, and `useDecryption` hooks
- **Wallet Integration**: MetaMask wallet connection
- **Real-time Encryption**: Encrypt values directly in the browser
- **Trading Interface**: Create confidential futures contracts
- **Type-safe**: Full TypeScript support

## Getting Started

### Install Dependencies

From the root of the monorepo:

```bash
npm install
```

Or from this directory:

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Run Development Server

From the root:

```bash
npm run dev:nextjs
```

Or from this directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## SDK Integration

### 1. Provider Setup

```tsx
// app/providers.tsx
import { FhevmProvider } from 'fhevm-sdk/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FhevmProvider config={{
      network: {
        chainId: 11155111,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
        gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL
      }
    }}>
      {children}
    </FhevmProvider>
  );
}
```

### 2. Using Hooks

```tsx
// In your components
import { useFhevm, useEncryption } from 'fhevm-sdk/react';

function MyComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32');
    console.log(encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## Components

- **WalletConnect**: MetaMask wallet connection
- **EncryptionDemo**: Test encryption functionality
- **TradingInterface**: Create confidential futures contracts

## Building for Production

```bash
npm run build
npm run start
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
