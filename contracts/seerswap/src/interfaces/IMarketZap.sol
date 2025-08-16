// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title IMarketZap Interface
/// @notice Interface for the MarketZap contract that enables atomic liquidity provision to prediction markets
interface IMarketZap {
    /// @notice Parameters for zapping into a market
    struct ZapParams {
        address market;
        address collateralToken;
        uint256 collateralAmount;
        uint256 splitAmount;           // Amount to split into outcome tokens (calculated off-chain)
        address[] pools;
        FarmConfig[] farms;
        uint256[] minLiquidities;      // Minimum liquidity amounts for each pool
        uint256 slippageBps;           // Slippage tolerance in basis points (e.g., 50 = 0.5%)
        uint256 deadline;
    }

    /// @notice Configuration for farming
    struct FarmConfig {
        address rewardToken;
        address bonusRewardToken;
        uint256 startTime;
        uint256 endTime;
    }

    /// @notice Pool allocation details
    struct PoolAllocation {
        address pool;
        address outcomeToken;
        bool isToken0Outcome;
        uint256 outcomeAmount;
        uint256 collateralAmount;
        int24 tickLower;
        int24 tickUpper;
    }

    /// @notice Emitted when a zap is executed successfully
    event ZapExecuted(
        address indexed user,
        address indexed market,
        uint256 collateralAmount,
        uint256[] tokenIds,
        uint256 totalLiquidity
    );

    /// @notice Emitted when an NFT is staked into a farm
    event NFTStaked(
        uint256 indexed tokenId,
        address indexed pool,
        address indexed farmingCenter
    );

    /// @notice Emitted when tokens are recovered by owner
    event TokensRecovered(
        address indexed token,
        uint256 amount,
        address indexed recipient
    );

    /// @notice Error thrown when slippage tolerance is exceeded
    error SlippageExceeded(uint256 expected, uint256 actual);
    
    /// @notice Error thrown when deadline has passed
    error DeadlineExpired(uint256 deadline, uint256 currentTime);
    
    /// @notice Error thrown when pools array is empty
    error NoPoolsProvided();
    
    /// @notice Error thrown when array lengths don't match
    error ArrayLengthMismatch();
    
    /// @notice Error thrown when a transfer fails
    error TransferFailed(address token, address from, address to, uint256 amount);
    
    /// @notice Error thrown when insufficient collateral after split
    error InsufficientCollateral(uint256 required, uint256 available);

    /// @notice Execute atomic zap into market liquidity
    /// @param params The zap parameters
    /// @return tokenIds Array of minted NFT position IDs
    function zapIntoMarket(ZapParams calldata params) external returns (uint256[] memory tokenIds);

    /// @notice Error thrown when insufficient outcome tokens received
    error InsufficientOutcomeTokens(uint256 expected, uint256 received);
    
    /// @notice Error thrown when pool is not whitelisted
    error PoolNotWhitelisted(address pool);

    /// @notice Check if a pool is whitelisted
    /// @param pool The pool address to check
    /// @return isWhitelisted Whether the pool is whitelisted
    function whitelistedPools(address pool) external view returns (bool isWhitelisted);
    
    /// @notice Whitelist or delist pools (admin only)
    /// @param pools Array of pool addresses
    /// @param status Whitelist status to set
    function setPoolWhitelist(address[] calldata pools, bool status) external;

    /// @notice Emergency function to recover stuck tokens
    /// @param token The token to recover
    /// @param amount Amount to recover
    function recoverToken(address token, uint256 amount) external;

    /// @notice Emergency function to recover stuck NFTs
    /// @param nft The NFT contract address
    /// @param tokenId The NFT token ID
    function recoverNFT(address nft, uint256 tokenId) external;
}