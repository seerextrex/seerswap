# SeerSwap - Prediction Market DEX

A decentralized exchange frontend specifically designed for prediction markets, combining the power of concentrated liquidity AMM with prediction market functionality.

## Overview

SeerSwap merges two powerful DeFi primitives:
- **Seer**: A prediction market platform for creating and trading on future outcomes
- **Swapr**: A concentrated liquidity AMM forked from Algebra (similar to Uniswap V3)

This creates a unique prediction market-focused DEX that allows users to provide liquidity and trade on prediction market outcomes with advanced features like concentrated liquidity and infinite farming.

## Project Structure

This is a monorepo with three main workspaces:

```
├── contracts/          # Smart contracts (read-only reference)
│   ├── seer/          # Prediction market contracts
│   └── swapr/         # Concentrated liquidity AMM contracts
├── subgraph/          # Custom subgraph merging Seer + Swapr data  
└── web/               # React frontend application
```

### Contracts
- **Seer contracts**: Prediction market functionality including market creation, trading, and resolution
- **Swapr contracts**: Concentrated liquidity AMM with core, periphery, and tokenomics modules
- These are read-only references for development

### Subgraph
- Custom hand-coded subgraph that merges Seer and Swapr functionality
- Provides unified GraphQL API for the frontend
- Includes enhanced features beyond the original implementations

### Web Frontend
- React application migrated from Ethers v5 to Wagmi
- TypeScript with generated GraphQL types
- Concentrated liquidity interface with prediction market specialization
- Features infinite farming (staking/yield farming) functionality

## Key Features

- **Prediction Market Trading**: Create and trade on prediction markets
- **Concentrated Liquidity**: Provide liquidity in specific price ranges for better capital efficiency  
- **Infinite Farming**: Advanced yield farming and staking mechanisms
- **Multi-chain Support**: Supports Ethereum, Gnosis Chain, and other networks
- **Advanced Analytics**: Comprehensive pool and market analytics

## Getting Started

### Prerequisites
- Node.js >= 18.13.0
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swapr-algebra-ui
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
cd web
yarn start
```

The application will be available at `http://localhost:3000`

### Development Commands

**Web Frontend:**
```bash
cd web

# Start development server
yarn start

# Generate GraphQL types
yarn graphql:generate

# Build for production
yarn build

# Run tests
yarn test
```

**Subgraph:**
```bash
cd subgraph

# Build subgraph
yarn build

# Deploy to local node
yarn deploy-local
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wagmi** for Ethereum interactions
- **Redux Toolkit** for state management
- **GraphQL** with code generation
- **Styled Components** for styling
- **Lingui** for internationalization

### Blockchain Integration
- **Viem/Wagmi** for blockchain interactions
- **ConnectKit** for wallet connections
- **Ethers v6** for contract interactions

### Data Layer
- **The Graph** for indexing blockchain data
- **Apollo Client** for GraphQL queries
- Custom subgraph combining Seer and Swapr data

## Contributing

This project is actively developed with focus on:
- Enhancing prediction market functionality
- Improving concentrated liquidity features
- Adding new farming mechanisms
- Expanding multi-chain support

### Development Notes
- Use generated GraphQL types from `yarn graphql:generate`
## License

This project is licensed under GPL-3.0-or-later.

## Architecture

The system combines:
1. **Smart Contracts** handling core logic for both prediction markets and AMM functionality
2. **Subgraph** providing unified data indexing and querying
3. **Frontend** offering a seamless user experience for both prediction market participation and liquidity provision

The unique combination enables users to trade prediction market outcomes while providing concentrated liquidity, creating new opportunities for yield generation in prediction markets.