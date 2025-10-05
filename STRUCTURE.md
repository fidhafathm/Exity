# Exity Project Structure

This document provides a comprehensive overview of the Exity monorepo structure.

## Directory Tree

```
exity/
├── .github/                          # GitHub-specific files
│   ├── workflows/                    # CI/CD pipelines
│   │   ├── contracts-ci.yml         # Anchor program tests on PR
│   │   ├── frontend-ci.yml          # Frontend tests and build
│   │   └── deploy-devnet.yml        # Auto-deploy to devnet on main
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md     # PR template
│
├── packages/                         # Monorepo packages (managed by workspace)
│   │
│   ├── contracts/                   # Solana smart contracts (Anchor)
│   │   ├── programs/                # Anchor programs directory
│   │   │   ├── exity-core/         # Main tokenization program
│   │   │   │   ├── src/
│   │   │   │   │   ├── lib.rs      # Program entrypoint
│   │   │   │   │   ├── state/      # Account structures
│   │   │   │   │   │   ├── mod.rs
│   │   │   │   │   │   ├── lp_stake.rs      # LP stake tokenization state
│   │   │   │   │   │   ├── marketplace.rs    # Secondary market state
│   │   │   │   │   │   └── vault.rs          # Asset custody state
│   │   │   │   │   ├── instructions/         # Program instructions
│   │   │   │   │   │   ├── mod.rs
│   │   │   │   │   │   ├── create_stake.rs   # Create tokenized LP stake
│   │   │   │   │   │   ├── transfer_stake.rs # Transfer ownership
│   │   │   │   │   │   ├── list_for_sale.rs  # List on marketplace
│   │   │   │   │   │   └── distribute_yield.rs # Yield distribution
│   │   │   │   │   ├── errors.rs             # Custom error codes
│   │   │   │   │   ├── constants.rs          # Program constants
│   │   │   │   │   └── utils.rs              # Helper functions
│   │   │   │   ├── Cargo.toml
│   │   │   │   └── Xargo.toml
│   │   │   │
│   │   │   └── exity-compliance/    # Future: Compliance/KYC program
│   │   │       └── src/
│   │   │
│   │   ├── tests/                   # Integration tests
│   │   │   ├── utils/               # Test utilities
│   │   │   │   ├── mod.rs
│   │   │   │   └── setup.rs         # Common test setup
│   │   │   ├── exity-core.ts        # Core program tests
│   │   │   └── integration.ts       # Cross-program tests
│   │   │
│   │   ├── migrations/              # Anchor migrations
│   │   │   └── deploy.ts
│   │   │
│   │   ├── scripts/                 # Deployment & utility scripts
│   │   │   ├── deploy-devnet.ts     # Deploy to devnet
│   │   │   ├── deploy-mainnet.ts    # Deploy to mainnet
│   │   │   ├── upgrade.ts           # Program upgrade script
│   │   │   ├── initialize.ts        # Initialize program accounts
│   │   │   └── verify.ts            # Verify deployment
│   │   │
│   │   ├── Anchor.toml              # Anchor configuration
│   │   ├── Cargo.toml               # Rust workspace config
│   │   ├── package.json             # NPM scripts for testing
│   │   └── tsconfig.json            # TypeScript config for tests
│   │
│   ├── sdk/                         # TypeScript SDK for developers
│   │   ├── src/
│   │   │   ├── index.ts             # Main SDK export
│   │   │   ├── client/              # Client classes
│   │   │   │   ├── ExityClient.ts   # Main SDK client
│   │   │   │   ├── StakeManager.ts  # LP stake operations
│   │   │   │   └── MarketplaceManager.ts # Marketplace operations
│   │   │   ├── types/               # Re-export shared types
│   │   │   ├── utils/               # SDK utilities
│   │   │   │   ├── pda.ts           # PDA derivation helpers
│   │   │   │   ├── serialization.ts # Borsh helpers
│   │   │   │   └── connection.ts    # Connection utilities
│   │   │   └── constants.ts         # SDK constants
│   │   ├── examples/                # SDK usage examples
│   │   │   ├── create-stake.ts
│   │   │   ├── transfer-stake.ts
│   │   │   └── marketplace.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md                # SDK documentation
│   │
│   ├── shared/                      # Shared types and utilities
│   │   ├── src/
│   │   │   ├── index.ts             # Main exports
│   │   │   ├── types/               # Shared TypeScript types
│   │   │   │   ├── index.ts
│   │   │   │   ├── stake.ts         # LP stake types
│   │   │   │   ├── marketplace.ts   # Marketplace types
│   │   │   │   ├── transaction.ts   # Transaction types
│   │   │   │   └── user.ts          # User/investor types
│   │   │   ├── constants/           # Shared constants
│   │   │   │   ├── index.ts
│   │   │   │   ├── programs.ts      # Program IDs for each network
│   │   │   │   └── tokens.ts        # Token addresses
│   │   │   ├── utils/               # Shared utilities
│   │   │   │   ├── validation.ts    # Input validation
│   │   │   │   ├── formatting.ts    # Number/date formatting
│   │   │   │   └── errors.ts        # Error handling
│   │   │   └── schemas/             # Data validation schemas (Zod)
│   │   │       ├── stake.schema.ts
│   │   │       └── marketplace.schema.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── frontend/                    # React frontend application
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   └── assets/              # Static assets
│   │   │       ├── images/
│   │   │       ├── icons/
│   │   │       └── fonts/
│   │   │
│   │   ├── src/
│   │   │   ├── index.tsx            # App entrypoint
│   │   │   ├── App.tsx              # Root component
│   │   │   │
│   │   │   ├── pages/               # Page components (route level)
│   │   │   │   ├── HomePage/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── HomePage.styles.ts
│   │   │   │   ├── MarketplacePage/
│   │   │   │   ├── StakePage/       # View/manage stakes
│   │   │   │   ├── CreateStakePage/ # Tokenize new LP stake
│   │   │   │   ├── PortfolioPage/   # User portfolio
│   │   │   │   └── AdminPage/       # Future: Admin dashboard
│   │   │   │
│   │   │   ├── components/          # Reusable components
│   │   │   │   ├── common/          # Generic components
│   │   │   │   │   ├── Button/
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Card/
│   │   │   │   │   ├── Modal/
│   │   │   │   │   └── Loader/
│   │   │   │   ├── layout/          # Layout components
│   │   │   │   │   ├── Header/
│   │   │   │   │   ├── Footer/
│   │   │   │   │   ├── Sidebar/
│   │   │   │   │   └── Container/
│   │   │   │   ├── wallet/          # Wallet components
│   │   │   │   │   ├── WalletButton/
│   │   │   │   │   ├── WalletModal/
│   │   │   │   │   └── NetworkSelector/
│   │   │   │   ├── stake/           # Stake-specific components
│   │   │   │   │   ├── StakeCard/
│   │   │   │   │   ├── StakeForm/
│   │   │   │   │   ├── StakeDetails/
│   │   │   │   │   └── TransferModal/
│   │   │   │   └── marketplace/     # Marketplace components
│   │   │   │       ├── ListingCard/
│   │   │   │       ├── PurchaseModal/
│   │   │   │       └── FilterPanel/
│   │   │   │
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   │   ├── useExityProgram.ts    # Anchor program hook
│   │   │   │   ├── useStakes.ts          # Fetch user stakes
│   │   │   │   ├── useMarketplace.ts     # Marketplace data
│   │   │   │   ├── useWallet.ts          # Wallet state
│   │   │   │   └── useTransactions.ts    # Transaction history
│   │   │   │
│   │   │   ├── context/             # React context providers
│   │   │   │   ├── WalletProvider.tsx    # Solana wallet context
│   │   │   │   ├── ProgramProvider.tsx   # Anchor program context
│   │   │   │   ├── ThemeProvider.tsx     # Theme/dark mode
│   │   │   │   └── NotificationProvider.tsx # Toast notifications
│   │   │   │
│   │   │   ├── services/            # Business logic & API calls
│   │   │   │   ├── blockchain/      # Blockchain interactions
│   │   │   │   │   ├── stakeService.ts
│   │   │   │   │   ├── marketplaceService.ts
│   │   │   │   │   └── transactionService.ts
│   │   │   │   └── api/             # Future: Backend API calls
│   │   │   │       └── client.ts
│   │   │   │
│   │   │   ├── utils/               # Utility functions
│   │   │   │   ├── formatters.ts    # Format numbers, dates
│   │   │   │   ├── validators.ts    # Form validation
│   │   │   │   ├── constants.ts     # Frontend constants
│   │   │   │   └── helpers.ts       # General helpers
│   │   │   │
│   │   │   ├── styles/              # Global styles
│   │   │   │   ├── globals.css
│   │   │   │   ├── theme.ts         # Theme configuration
│   │   │   │   └── variables.css    # CSS variables
│   │   │   │
│   │   │   ├── types/               # Frontend-specific types
│   │   │   │   ├── index.ts
│   │   │   │   └── navigation.ts
│   │   │   │
│   │   │   └── config/              # App configuration
│   │   │       ├── environment.ts   # Environment variables
│   │   │       ├── routes.ts        # Route definitions
│   │   │       └── wallets.ts       # Wallet adapter config
│   │   │
│   │   ├── .env.example             # Environment variables template
│   │   ├── .env.development         # Development env
│   │   ├── .env.production          # Production env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts           # Vite configuration
│   │   └── tailwind.config.js       # Tailwind CSS config
│   │
│   └── backend/                     # Future: Node.js backend (indexer/API)
│       ├── src/
│       │   ├── index.ts
│       │   ├── indexer/             # Blockchain indexer
│       │   ├── api/                 # REST API endpoints
│       │   ├── services/            # Business logic
│       │   └── db/                  # Database models
│       ├── package.json
│       └── tsconfig.json
│
├── apps/                             # Standalone applications
│   └── mobile/                       # Future: React Native app
│       └── (React Native structure)
│
├── docs/                             # Documentation
│   ├── README.md                     # Documentation index
│   ├── architecture/                 # Architecture documentation
│   │   ├── overview.md              # System overview
│   │   ├── smart-contracts.md       # Contract architecture
│   │   ├── data-model.md            # Data structures
│   │   └── security.md              # Security considerations
│   ├── guides/                       # User and developer guides
│   │   ├── getting-started.md       # Quick start guide
│   │   ├── creating-stake.md        # How to tokenize LP stake
│   │   ├── marketplace.md           # Using marketplace
│   │   └── integration.md           # Integration guide for devs
│   ├── api/                          # API documentation
│   │   ├── sdk-reference.md         # SDK API reference
│   │   └── program-idl.md           # Smart contract IDL docs
│   ├── deployment/                   # Deployment guides
│   │   ├── devnet.md                # Deploy to devnet
│   │   ├── mainnet.md               # Deploy to mainnet
│   │   └── verification.md          # Program verification
│   └── assets/                       # Documentation assets
│       ├── diagrams/                # Architecture diagrams
│       └── screenshots/             # App screenshots
│
├── scripts/                          # Root-level utility scripts
│   ├── setup.sh                     # Initial project setup
│   ├── build-all.sh                 # Build all packages
│   ├── test-all.sh                  # Run all tests
│   ├── deploy.sh                    # Deployment orchestration
│   └── generate-types.sh            # Generate types from IDL
│
├── config/                           # Root-level configuration
│   ├── devnet.json                  # Devnet configuration
│   ├── testnet.json                 # Testnet configuration
│   └── mainnet.json                 # Mainnet configuration
│
├── .vscode/                          # VSCode workspace settings
│   ├── settings.json                # Shared editor settings
│   ├── extensions.json              # Recommended extensions
│   └── launch.json                  # Debug configurations
│
├── Root Configuration Files
├── .gitignore                        # Git ignore rules
├── .gitattributes                    # Git attributes
├── .prettierrc                       # Prettier configuration
├── .prettierignore                   # Prettier ignore
├── .eslintrc.js                      # Root ESLint config
├── .eslintignore                     # ESLint ignore
├── package.json                      # Root package.json (workspace)
├── pnpm-workspace.yaml              # PNPM workspace config
├── tsconfig.json                     # Root TypeScript config
├── turbo.json                        # Turborepo config (optional)
│
├── Documentation Files
├── README.md                         # Project README
├── CLAUDE.md                         # Claude Code guidance
├── STRUCTURE.md                      # This file
├── CONTRIBUTING.md                   # Contribution guidelines
├── LICENSE                           # MIT License
└── CHANGELOG.md                      # Version changelog
```

## Package Responsibilities

### packages/contracts
- **Purpose:** Solana smart contracts built with Anchor framework
- **Language:** Rust
- **Key Components:**
  - Programs: Business logic for LP stake tokenization
  - Tests: Integration tests for all program instructions
  - Scripts: Deployment and upgrade scripts

### packages/frontend
- **Purpose:** Web application for end users
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS
- **Key Components:**
  - Pages: Route-level components
  - Components: Reusable UI components
  - Hooks: Custom React hooks for data fetching
  - Services: Business logic for blockchain interactions

### packages/sdk
- **Purpose:** TypeScript SDK for external developers
- **Key Components:**
  - Client classes for interacting with smart contracts
  - Utility functions for PDAs, serialization
  - Examples for common use cases

### packages/shared
- **Purpose:** Shared types, constants, and utilities
- **Key Components:**
  - TypeScript types used across all packages
  - Program IDs for different networks
  - Validation schemas
  - Utility functions

## Naming Conventions

### Files & Folders
- `kebab-case` for folders and files: `lp-stake.rs`, `create-stake-page/`
- `PascalCase` for React components: `StakeCard.tsx`, `HomePage/`
- `camelCase` for TypeScript files: `useStakes.ts`, `stakeService.ts`

### Code
- `snake_case` for Rust: `create_lp_stake`, `distribute_yield`
- `camelCase` for TypeScript/JavaScript: `createStake`, `distributeYield`
- `PascalCase` for types/interfaces: `LPStake`, `MarketplaceListing`
- `SCREAMING_SNAKE_CASE` for constants: `PROGRAM_ID`, `MAX_STAKE_SIZE`

## Component Organization (Frontend)

Each feature-based component follows this structure:

```
ComponentName/
├── index.tsx              # Component logic
├── ComponentName.styles.ts # Styled components (if not using Tailwind)
├── ComponentName.test.tsx  # Component tests
└── ComponentName.types.ts  # Component-specific types
```

## Adding New Features

### New Smart Contract Program
1. Create new program in `packages/contracts/programs/[program-name]/`
2. Follow the same structure as `exity-core`
3. Add tests in `packages/contracts/tests/`
4. Update deployment scripts

### New Frontend Feature
1. Create page component in `packages/frontend/src/pages/`
2. Create reusable components in `src/components/[feature]/`
3. Add business logic in `src/services/`
4. Create custom hooks in `src/hooks/`

### New Package
1. Create folder in `packages/` or `apps/`
2. Add to `pnpm-workspace.yaml`
3. Add build/test scripts to root `package.json`

## Environment Configuration

### Networks
- **Devnet:** `config/devnet.json`, `packages/contracts/Anchor.toml`
- **Testnet:** `config/testnet.json`
- **Mainnet:** `config/mainnet.json`, `packages/contracts/Anchor.toml`

### Frontend Environment Variables
- `.env.development` - Development configuration
- `.env.production` - Production configuration
- `.env.example` - Template for required variables

## Deployment Locations

### Smart Contract Deployment Scripts
- Single program: `packages/contracts/scripts/deploy-devnet.ts`
- All programs: `scripts/deploy.sh` (root level)

### Frontend Deployment
- Build output: `packages/frontend/dist/`
- Deploy to: Vercel, Netlify, or custom hosting

## Design Assets

### Location
- Static images: `packages/frontend/public/assets/images/`
- Icons: `packages/frontend/public/assets/icons/`
- Fonts: `packages/frontend/public/assets/fonts/`
- Documentation diagrams: `docs/assets/diagrams/`

## Future Expansion Paths

### Backend Indexer
```
packages/backend/
├── src/
│   ├── indexer/           # Blockchain indexer
│   ├── api/               # REST API
│   └── db/                # Database models
```

### Mobile App
```
apps/mobile/
├── src/
│   ├── screens/           # Mobile screens
│   └── navigation/        # Navigation setup
```

### Additional Smart Contract Programs
```
packages/contracts/programs/
├── exity-core/            # Main program
├── exity-compliance/      # KYC/AML
├── exity-governance/      # DAO (future)
└── exity-derivatives/     # Derivatives (future)
```

## Development Workflow

### Two-Developer Parallel Work
- **Developer 1 (Contracts):** Works in `packages/contracts/`
- **Developer 2 (Frontend):** Works in `packages/frontend/`
- **Shared:** Coordinate changes in `packages/shared/`

### Avoiding Conflicts
1. Use feature branches: `feature/marketplace-listing`, `feature/stake-ui`
2. Contract changes → Update IDL → PR → Frontend uses new types
3. Separate files within `packages/shared/src/types/` for different features

## Quick Start Commands

```bash
# Initial setup
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Development
pnpm dev:frontend          # Start frontend dev server
cd packages/contracts && anchor test  # Test contracts

# Deployment
pnpm deploy:devnet         # Deploy to devnet
pnpm deploy:mainnet        # Deploy to mainnet
```

## Important Notes

1. **Program IDs:** After deployment, update `packages/shared/src/constants/programs.ts`
2. **Type Generation:** After contract changes, regenerate types from IDL
3. **Workspace:** Use `pnpm install` at root to manage all packages
4. **Security:** Never commit private keys or sensitive data
