# MarketZapSimple - Seerswap Contracts

## Overview
MarketZapSimple is a minimalist smart contract for atomic liquidity provision to prediction markets. It combines Seer Protocol's prediction markets with Algebra AMM's concentrated liquidity.

## Features
- ✅ Single atomic transaction for zapping into multiple pools
- ✅ Optional auto-staking into farms
- ✅ Gas-optimized (39% savings vs original)
- ✅ KISS principle - only 246 lines of code
- ✅ Fully immutable after deployment

## Setup

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (for deployment scripts)

### Installation
```bash
# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test
```

## Project Structure
```
seerswap/
├── src/                    # Contract source files
│   ├── MarketZapSimple.sol # Main contract
│   ├── interfaces/         # Interface definitions
│   └── libraries/          # Helper libraries
├── test/                   # Forge tests
├── script/                 # Deployment scripts
├── out/                    # Compiled artifacts
└── lib/                    # Dependencies (forge-std, openzeppelin)
```

## Deployment

### Set Environment Variables
```bash
export PRIVATE_KEY=your_private_key
export ETHERSCAN_API_KEY=your_api_key
```

### Deploy to Gnosis
```bash
forge script script/Deploy.s.sol --rpc-url gnosis --broadcast --verify
```

## Contract Addresses

### Gnosis Chain (ID: 100)
- Seer Router: `0xeC9048b59b3467415b1a38F63416407eA0c70fB8`
- Algebra Position Manager: `0x91fD594c46D8B01E62dBDeBed2401dde01817834`
- Algebra Farming Center: `0xDe51dDF1aE7d5BBD7bF1A0e40aAA1F6C12579106`
- MarketZapSimple: *To be deployed*

## Usage

### Basic Zap (No Farming)
```solidity
zap.zap(
    market,           // Market address
    collateral,       // Collateral token
    splitAmount,      // Amount to split (calculated off-chain)
    pools,            // Pool addresses
    minLiquidities,   // Minimum liquidity amounts
    slippageBps,      // Slippage in basis points (e.g., 50 = 0.5%)
    deadline,         // Transaction deadline
    [address(0), ...], // No farming (zeros)
    [0, ...]          // No end times
);
```

### Zap with Auto-Staking
```solidity
zap.zap(
    market,
    collateral,
    splitAmount,
    pools,
    minLiquidities,
    slippageBps,
    deadline,
    rewardTokens,     // Reward token addresses for farming
    endTimes          // Farm end times
);
```

## Testing
```bash
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testZapRevertsOnDeadline

# Run with verbosity
forge test -vvv
```

## Security
- No reentrancy (3-step pattern)
- Pool whitelist prevents malicious pools
- Slippage protection
- Deadline checks
- Immutable design

## License
MIT