# Exity

> Tokenizing private equity LP stakes on Solana

Exity is a blockchain-based platform that enables tokenization and fractionalization of private equity Limited Partner (LP) stakes, creating liquidity in traditionally illiquid assets.

##  Project Structure

This is a monorepo containing:
- **Smart Contracts** (`packages/contracts/`) - Solana programs built with Anchor
- **Frontend** (`packages/frontend/`) - React application for users
- **SDK** (`packages/sdk/`) - TypeScript SDK for developers
- **Shared** (`packages/shared/`) - Shared types and utilities

##  Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+

### Setup

```bash
# Install dependencies
pnpm install

# Build smart contracts
cd packages/contracts
anchor build
anchor deploy

# Start frontend
cd ../frontend
cp .env.example .env.development
pnpm dev
```

See [docs/guides/getting-started.md](docs/guides/getting-started.md) for detailed setup instructions.

##  Packages

| Package | Description | Commands |
|---------|-------------|----------|
| `contracts` | Solana smart contracts | `anchor build`, `anchor test` |
| `frontend` | React web application | `pnpm dev`, `pnpm build` |
| `sdk` | TypeScript SDK | `pnpm build`, `pnpm test` |
| `shared` | Shared types/utilities | `pnpm build` |

##  Development

```bash
# Run all tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Build everything
pnpm build
```

##  Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [Smart Contract Documentation](docs/architecture/smart-contracts.md)
- [API Reference](docs/api/sdk-reference.md)
- [Deployment Guide](docs/deployment/devnet.md)

##  Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

##  License

MIT License - see [LICENSE](LICENSE)