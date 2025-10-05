# Exity SDK

TypeScript SDK for interacting with Exity smart contracts.

## Installation

```bash
npm install @exity/sdk
# or
pnpm add @exity/sdk
```

## Usage

```typescript
import { ExityClient } from '@exity/sdk';
import { Connection, Keypair } from '@solana/web3.js';

// Initialize client
const connection = new Connection('https://api.devnet.solana.com');
const wallet = Keypair.generate();
const client = new ExityClient(connection, wallet);

// Create a tokenized LP stake
const signature = await client.createStake({
  fundName: 'Sequoia Fund III',
  stakeAmount: 1_000_000,
  metadata: {
    fundDescription: 'Late-stage venture capital fund',
    vestingPeriod: 365 * 24 * 60 * 60, // 1 year in seconds
  },
});

// Transfer stake
await client.transferStake(stakePublicKey, recipientPublicKey);

// List on marketplace
await client.listStake(stakePublicKey, priceInLamports);

// Purchase from marketplace
await client.purchaseStake(listingPublicKey);
```

## API Reference

### ExityClient

Main client for interacting with Exity programs.

#### Methods

- `createStake(params)` - Create a new tokenized LP stake
- `transferStake(stake, recipient)` - Transfer stake ownership
- `listStake(stake, price)` - List stake on marketplace
- `purchaseStake(listing)` - Purchase stake from marketplace
- `getStake(publicKey)` - Fetch stake details
- `getUserStakes(wallet)` - Get all stakes for a wallet
- `getMarketplaceListings()` - Get all active listings

## Examples

See [examples/](examples/) directory for more usage examples.

## Development

```bash
# Build SDK
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm dev
```
