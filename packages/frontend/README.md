# Exity Frontend

React web application for interacting with Exity smart contracts.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Solana Wallet Adapter
- Anchor

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.development

# Start dev server
pnpm dev
```

## Development

```bash
# Start dev server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Environment Variables

Create `.env.development` with:

```env
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_EXITY_CORE_PROGRAM_ID=your_program_id
```

## Project Structure

```
src/
  pages/          # Route-level components
  components/     # Reusable components
  hooks/          # Custom React hooks
  context/        # React context providers
  services/       # Business logic
  utils/          # Utility functions
  styles/         # Global styles
```

## Key Features

- Connect Solana wallet
- View LP stakes
- Create tokenized stakes
- Transfer stake ownership
- Marketplace for trading stakes
- Portfolio management
