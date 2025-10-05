# Exity Smart Contracts

Solana smart contracts for tokenizing private equity LP stakes, built with Anchor.

## Setup

```bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Build programs
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy
```

## Programs

### exity-core
Main program for LP stake tokenization and marketplace operations.

**Features:**
- Create tokenized LP stakes
- Transfer stake ownership
- List stakes for sale on marketplace
- Purchase stakes from marketplace
- Distribute yield to stakeholders

## Structure

```
programs/
  exity-core/
    src/
      lib.rs              # Program entrypoint
      state/              # Account structures
      instructions/       # Program instructions
      errors.rs           # Custom errors
      constants.rs        # Constants
```

## Testing

```bash
# Run all tests
anchor test

# Run specific test file
anchor test -- --test exity-core
```

## Deployment

```bash
# Deploy to devnet
npm run deploy:devnet

# Deploy to mainnet (requires security audit)
npm run deploy:mainnet
```

After deployment, update program IDs in `packages/shared/src/constants/programs.ts`.
