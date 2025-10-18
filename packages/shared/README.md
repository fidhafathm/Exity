# Shared Package

Shared types, constants, and utilities used across all Exity packages.

## Purpose

This package ensures type safety and consistency across:
- Smart contracts (TypeScript tests)
- Frontend application
- SDK
- Backend (future)

## Structure

```
src/
  types/          # TypeScript interfaces and types
  constants/      # Shared constants (program IDs, etc.)
  schemas/        # Zod validation schemas
  utils/          # Shared utility functions
```

## Usage

```typescript
import { LPStake, MarketplaceListing } from '@exity/shared/types';
import { PROGRAM_IDS } from '@exity/shared/constants';
import { stakeSchema } from '@exity/shared/schemas';

// Use types
const stake: LPStake = {
  fundName: 'Sequoia Fund III',
  stakeAmount: 1_000_000,
  owner: walletPublicKey,
};

// Use constants
const programId = PROGRAM_IDS[network].exityCore;

// Validate data
const validatedData = stakeSchema.parse(inputData);
```

## Key Files

### types/
- `stake.ts` - LP stake types
- `marketplace.ts` - Marketplace types
- `transaction.ts` - Transaction types
- `user.ts` - User/investor types

### constants/
- `programs.ts` - Program IDs for each network
- `tokens.ts` - Token addresses

### schemas/
- `stake.schema.ts` - Stake validation schemas
- `marketplace.schema.ts` - Marketplace validation schemas

## Development

```bash
# Build shared package
pnpm build

# Watch mode
pnpm dev
```

## Important

After updating smart contract structures:
1. Regenerate types from IDL
2. Update types in this package
3. Rebuild: `pnpm build`
4. Update dependent packages (frontend, SDK)
