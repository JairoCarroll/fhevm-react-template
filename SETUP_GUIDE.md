# Setup Guide

Complete setup guide for the FHEVM Universal SDK Template.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- MetaMask browser extension (for web examples)

## Installation Steps

### 1. Clone or Download Repository

```bash
git clone <repository-url>
cd fhevm-react-template
```

### 2. Install Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for all packages and examples using npm workspaces.

### 3. Build the SDK

```bash
npm run build:sdk
```

This compiles the FHEVM SDK package that all examples depend on.

## Running Examples

### Next.js Web Application

1. Navigate to the example:
```bash
cd examples/nextjs-example
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_GATEWAY_URL=https://gateway.fhevm.io
```

4. Start development server:
```bash
npm run dev
# Or from root: npm run dev:nextjs
```

5. Open browser at http://localhost:3000

### Node.js CLI Example

1. Navigate to the example:
```bash
cd examples/nodejs-example
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env`:
```env
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
GATEWAY_URL=https://gateway.fhevm.io
CHAIN_ID=11155111
```

4. Run the example:
```bash
npm run dev
# Or from root: npm run dev:nodejs
```

### Agricultural Futures Contract Example

1. Navigate to the example:
```bash
cd examples/agricultural-futures
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env`:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
```

4. Compile contracts:
```bash
npm run compile
```

5. Deploy to Sepolia:
```bash
npm run deploy
```

## Environment Variables

### Required for Web Examples

- `NEXT_PUBLIC_RPC_URL` - Ethereum RPC endpoint (Alchemy, Infura, etc.)
- `NEXT_PUBLIC_GATEWAY_URL` - FHEVM gateway URL (default: https://gateway.fhevm.io)

### Required for Node.js Examples

- `RPC_URL` - Ethereum RPC endpoint
- `GATEWAY_URL` - FHEVM gateway URL
- `CHAIN_ID` - Network chain ID (11155111 for Sepolia)

### Required for Contract Deployment

- `SEPOLIA_RPC_URL` - Sepolia testnet RPC URL
- `PRIVATE_KEY` - Deployer wallet private key (never commit this!)

### Optional

- `CONTRACT_ADDRESS` - Deployed contract address
- `ACL_ADDRESS` - FHEVM ACL contract address
- `KMS_SIGNER_ADDRESS` - KMS signer contract address

## Getting RPC Endpoints

### Alchemy (Recommended)

1. Visit https://www.alchemy.com/
2. Sign up for free account
3. Create new app for Ethereum Sepolia
4. Copy API key
5. Use: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

### Infura

1. Visit https://infura.io/
2. Sign up for free account
3. Create new project
4. Copy endpoint URL for Sepolia

## Wallet Setup

### MetaMask

1. Install MetaMask browser extension
2. Create or import wallet
3. Switch to Sepolia Testnet
4. Get test ETH from faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

## Troubleshooting

### "Cannot find module 'fhevm-sdk'"

**Solution:** Build the SDK first:
```bash
npm run build:sdk
```

### "Failed to initialize FHEVM"

**Possible causes:**
- RPC URL not configured
- Network connectivity issues
- Invalid chain ID

**Solution:**
- Check `.env` configuration
- Verify RPC URL is accessible
- Ensure chain ID matches your RPC network

### "Provider not available"

**Solution:**
- Install MetaMask browser extension
- Connect wallet to application
- Ensure wallet is unlocked

### "Transaction failed" during deployment

**Possible causes:**
- Insufficient gas
- Insufficient balance
- Network congestion

**Solution:**
- Ensure wallet has enough ETH for gas
- Try increasing gas limit
- Wait and retry during off-peak hours

### Workspace dependencies not resolving

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
```

## Development Tips

### Hot Reload

All examples support hot reload:
- Next.js: Automatic on file changes
- Node.js: Restart script manually or use nodemon

### Testing Changes to SDK

1. Make changes in `packages/fhevm-sdk/src`
2. Rebuild: `npm run build:sdk`
3. Examples will automatically use updated SDK

### Using in Your Own Project

Install from the workspace:
```json
{
  "dependencies": {
    "fhevm-sdk": "workspace:*"
  }
}
```

Or publish to npm and install normally:
```bash
npm install fhevm-sdk ethers fhevmjs
```

## Next Steps

1. Explore the examples
2. Read the [API Documentation](packages/fhevm-sdk/README.md)
3. Build your own confidential application
4. Check out the [video demo](demo.mp4)

## Support

If you encounter issues:

1. Check this guide
2. Review example README files
3. Check GitHub issues
4. Consult [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
