#!/bin/bash

# Exity Setup Script
# This script helps you set up the development environment

set -e

echo "Exity Development Environment Setup"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"

    # Check if version is 18+
    MAJOR_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_warning "Node.js version should be 18 or higher. Current: $NODE_VERSION"
        print_info "Please upgrade Node.js: https://nodejs.org/"
    fi
else
    print_error "Node.js is not installed"
    print_info "Install from: https://nodejs.org/ (LTS version recommended)"
    exit 1
fi

# Check pnpm
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm is installed: $PNPM_VERSION"
else
    print_warning "pnpm is not installed"
    echo ""
    read -p "Would you like to install pnpm now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g pnpm
        print_success "pnpm installed successfully"
    else
        print_error "pnpm is required. Install with: npm install -g pnpm"
        exit 1
    fi
fi

# Check Rust
if command_exists rustc; then
    RUST_VERSION=$(rustc --version)
    print_success "Rust is installed: $RUST_VERSION"
else
    print_warning "Rust is not installed"
    echo ""
    print_info "Rust is required for Solana smart contract development"
    echo ""
    read -p "Would you like to install Rust now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing Rust via rustup..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

        # Source the cargo env
        source "$HOME/.cargo/env"

        print_success "Rust installed successfully"
        print_info "You may need to restart your terminal or run: source ~/.cargo/env"
    else
        print_error "Rust is required for smart contract development"
        print_info "Install manually from: https://rustup.rs/"
        exit 1
    fi
fi

# Check Solana CLI
if command_exists solana; then
    SOLANA_VERSION=$(solana --version)
    print_success "Solana CLI is installed: $SOLANA_VERSION"
else
    print_warning "Solana CLI is not installed"
    echo ""
    read -p "Would you like to install Solana CLI now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing Solana CLI..."
        sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

        # Add to PATH
        export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

        print_success "Solana CLI installed successfully"
        print_info "You may need to restart your terminal or add Solana to PATH"
    else
        print_error "Solana CLI is required for smart contract development"
        print_info "Install manually from: https://docs.solana.com/cli/install-solana-cli-tools"
        exit 1
    fi
fi

# Check Anchor CLI
if command_exists anchor; then
    ANCHOR_VERSION=$(anchor --version)
    print_success "Anchor CLI is installed: $ANCHOR_VERSION"
else
    print_warning "Anchor CLI is not installed"
    echo ""
    read -p "Would you like to install Anchor CLI now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing Anchor CLI (this may take a few minutes)..."
        cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
        print_success "Anchor CLI installed successfully"
    else
        print_error "Anchor CLI is required for smart contract development"
        print_info "Install manually with: cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked"
        exit 1
    fi
fi

echo ""
echo "======================================"
print_success "All prerequisites are installed!"
echo "======================================"
echo ""

# Setup Solana wallet if needed
if ! [ -f "$HOME/.config/solana/id.json" ]; then
    print_warning "No Solana wallet found"
    echo ""
    read -p "Would you like to create a new Solana wallet for development? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        solana-keygen new --no-bip39-passphrase
        print_success "Solana wallet created"
    fi
fi

# Set Solana to devnet
print_info "Setting Solana CLI to devnet..."
solana config set --url devnet
print_success "Solana CLI configured for devnet"

# Install project dependencies
echo ""
print_info "Installing project dependencies..."
cd "$(dirname "$0")/.."
pnpm install

print_success "Dependencies installed"

echo ""
echo "======================================"
print_success "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Initialize smart contracts: cd packages/contracts && anchor init exity-core --no-git"
echo "  2. Initialize frontend: cd packages/frontend && pnpm create vite . --template react-ts"
echo "  3. Start developing!"
echo ""
print_info "For more details, see README.md and STRUCTURE.md"
echo ""
