# Contributing to Exity

Thank you for your interest in contributing to Exity! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Node.js 18+ and pnpm 8+
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/fidhafathm/Exity.git
cd exity

# Install dependencies
pnpm install

# Set up Solana
solana-keygen new              # Create wallet if needed
solana config set --url devnet # Set to devnet

# Build smart contracts
cd packages/contracts
anchor build

# Start frontend
cd ../frontend
cp .env.example .env.development
pnpm dev
```

## Project Structure

See [STRUCTURE.md](STRUCTURE.md) for detailed project structure documentation.

## Development Workflow

### Creating a Feature

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Smart contracts: Work in `packages/contracts/`
   - Frontend: Work in `packages/frontend/`
   - SDK: Work in `packages/sdk/`
   - Shared types: Work in `packages/shared/`

3. **Test your changes:**
   ```bash
   # Test contracts
   cd packages/contracts
   anchor test

   # Test frontend
   cd ../frontend
   pnpm test

   # Test all packages
   cd ../..
   pnpm test
   ```

4. **Lint and format:**
   ```bash
   pnpm lint:fix
   pnpm format
   ```

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add marketplace listing functionality
fix: resolve stake transfer validation issue
docs: update deployment guide
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass:**
   ```bash
   pnpm test
   ```
4. **Create a pull request** with a clear description
5. **Link related issues** in the PR description
6. **Wait for review** from maintainers

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Tested on devnet
- [ ] Tested on mainnet (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components and hooks in React
- Use meaningful variable names

```typescript
// Good
const userStakes = await fetchUserStakes(walletAddress);

// Bad
const data = await fetch(addr);
```

### Rust (Smart Contracts)

- Follow Rust naming conventions
- Use descriptive error messages
- Add comments for complex logic
- Keep functions focused and small

```rust
// Good
pub fn create_tokenized_stake(
    ctx: Context<CreateStake>,
    fund_name: String,
    stake_amount: u64,
) -> Result<()> {
    // Implementation
}

// Bad
pub fn create(ctx: Context<C>, n: String, a: u64) -> Result<()> {
    // Implementation
}
```

## Testing Guidelines

### Smart Contracts

```typescript
// packages/contracts/tests/exity-core.ts
describe('LP Stake Tokenization', () => {
  it('should create a tokenized LP stake', async () => {
    // Test implementation
  });

  it('should transfer stake ownership', async () => {
    // Test implementation
  });
});
```

### Frontend

```typescript
// packages/frontend/src/components/stake/StakeCard/StakeCard.test.tsx
describe('StakeCard', () => {
  it('renders stake information correctly', () => {
    // Test implementation
  });

  it('handles transfer action', () => {
    // Test implementation
  });
});
```

## Documentation

### Code Comments

- Add JSDoc/TSDoc for public APIs
- Explain complex logic with inline comments
- Update README files when adding new packages

### Example

```typescript
/**
 * Creates a tokenized LP stake on-chain
 *
 * @param fundName - Name of the private equity fund
 * @param stakeAmount - Amount in lamports
 * @param metadata - Additional metadata for the stake
 * @returns Transaction signature
 */
export async function createStake(
  fundName: string,
  stakeAmount: number,
  metadata: StakeMetadata
): Promise<string> {
  // Implementation
}
```

## Common Tasks

### Adding a New Smart Contract Instruction

1. Create instruction file in `packages/contracts/programs/exity-core/src/instructions/`
2. Add to `mod.rs`
3. Update program `lib.rs`
4. Write tests in `packages/contracts/tests/`
5. Update types in `packages/shared/src/types/`
6. Update SDK in `packages/sdk/src/client/`

### Adding a New Frontend Page

1. Create page in `packages/frontend/src/pages/`
2. Add route in `src/config/routes.ts`
3. Create necessary components in `src/components/`
4. Add services in `src/services/blockchain/`
5. Create custom hooks if needed

### Updating Shared Types

1. Update types in `packages/shared/src/types/`
2. Rebuild shared package: `cd packages/shared && pnpm build`
3. Update dependent packages (frontend, SDK)
4. Run tests: `pnpm test`

## Deployment

### Devnet Deployment

```bash
cd packages/contracts
anchor build
anchor deploy
anchor run initialize

# Update program IDs in packages/shared/src/constants/programs.ts
```

### Mainnet Deployment

**Important:** Mainnet deployments require:
1. Security audit
2. Thorough testing on devnet
3. Program verification
4. Team approval

## Getting Help

- **Documentation:** See [docs/](docs/) directory
- **Issues:** Create a GitHub issue
- **Discussions:** Use GitHub Discussions
- **Questions:** Ask in project Discord/Slack (if available)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## License

By contributing to Exity, you agree that your contributions will be licensed under the MIT License.
