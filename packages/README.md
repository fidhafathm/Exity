# Packages

This directory contains all the monorepo packages.

## Structure

- **contracts/** - Solana smart contracts (Anchor/Rust)
- **frontend/** - React web application
- **sdk/** - TypeScript SDK for developers
- **shared/** - Shared types, constants, and utilities
- **backend/** - Backend API and indexer (future)

## Getting Started

Each package has its own README with specific setup instructions.

### Contracts
```bash
cd contracts
anchor build
anchor test
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### SDK
```bash
cd sdk
pnpm build
```

### Shared
```bash
cd shared
pnpm build
```
