# Node.js FHEVM CLI Example

Command-line interface example demonstrating FHEVM SDK usage in Node.js environment.

## Features

- Framework-agnostic SDK usage
- CLI encryption/decryption tools
- Contract interaction examples
- No frontend dependencies
- Pure Node.js environment

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

## Usage Examples

### Basic Demo

Run the main example showing encryption and SDK features:

```bash
npm run dev
```

Output:
```
FHEVM SDK - Node.js CLI Example

Initializing FHEVM client...
FHEVM client initialized successfully!

--- Encryption Demo ---
Encrypting value: 42
Encrypted (XXX bytes): ...
```

### Encrypt Values

Encrypt any value from the command line:

```bash
npm run encrypt 42 uint32
npm run encrypt 1000000000000000000 uint64
npm run encrypt true bool
```

### Contract Interaction

Interact with FHE contracts:

```bash
npm run contract
```

## SDK Integration

### Import and Initialize

```javascript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'YOUR_RPC_URL',
    gatewayUrl: 'YOUR_GATEWAY_URL'
  }
});
```

### Encrypt Values

```javascript
// Single value
const encrypted = await client.encryption.encryptValue(42, 'uint32');

// Multiple values
const inputs = await client.encryption.encryptInputs(
  contractAddress,
  userAddress,
  [
    { value: 100, type: 'uint32' },
    { value: 1000n, type: 'uint64' }
  ]
);
```

### Contract Calls

```javascript
// Read from contract
const balance = await client.contracts.read(
  contractAddress,
  abi,
  'balanceOf',
  [userAddress]
);

// Write with encrypted data
const tx = await client.contracts.callWithEncryption(
  contractAddress,
  abi,
  'transferEncrypted',
  encryptedInputs
);
```

## Scripts

- `npm run dev` - Run main demo
- `npm run encrypt <value> <type>` - Encrypt a value
- `npm run contract` - Contract interaction example

## Use Cases

- Backend services requiring encryption
- CLI tools for FHE operations
- Automated trading bots
- Data migration scripts
- Testing and development

## License

MIT
