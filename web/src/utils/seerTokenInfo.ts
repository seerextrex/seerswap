import { formatUnits } from 'viem';

const SEER_DECIMALS = 18;

// Cache for SEER token info
let cachedSeerInfo: {
  totalSupply: bigint;
  pricePerToken: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSeerTokenInfo(): Promise<{
  totalSupply: bigint;
  pricePerToken: number;
  decimals: number;
}> {
  // Check cache
  if (cachedSeerInfo && Date.now() - cachedSeerInfo.timestamp < CACHE_DURATION) {
    return {
      totalSupply: cachedSeerInfo.totalSupply,
      pricePerToken: cachedSeerInfo.pricePerToken,
      decimals: SEER_DECIMALS,
    };
  }

  try {
    // Calculate supply based on time formula:
    // (current time - october 10, 2024) * 266,666,666.667 SEER/month
    const october10_2024 = new Date('2024-10-10T00:00:00Z').getTime();
    const currentTime = Date.now();
    const millisecondsSinceOct10 = currentTime - october10_2024;
    
    // Convert to months (30 days per month for simplicity)
    const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000;
    const monthsSinceOct10 = millisecondsSinceOct10 / millisecondsPerMonth;
    
    // Calculate supply: 266,666,666.667 SEER per month
    const seerPerMonth = 266_666_666.667;
    const totalSupplyNumber = monthsSinceOct10 * seerPerMonth;
    
    // Convert to bigint with decimals
    const totalSupply = BigInt(Math.floor(totalSupplyNumber)) * 10n ** 18n;
    
    // Calculate price per token
    // Market cap = $1,000,000
    const marketCap = 1_000_000;
    const pricePerToken = marketCap / totalSupplyNumber;

    // Update cache
    cachedSeerInfo = {
      totalSupply,
      pricePerToken,
      timestamp: Date.now(),
    };

    return {
      totalSupply,
      pricePerToken,
      decimals: SEER_DECIMALS,
    };
  } catch (error) {
    console.error('Failed to calculate SEER token info:', error);
    
    // Fallback values if calculation fails
    // Use a reasonable default based on expected timeframe
    const fallbackSupply = 533_333_333n * 10n ** 18n; // ~533 million tokens (approx 2 months worth at 266.67M/month)
    const fallbackTotalSupplyNumber = Number(formatUnits(fallbackSupply, SEER_DECIMALS));
    const fallbackPricePerToken = 1_000_000 / fallbackTotalSupplyNumber;

    return {
      totalSupply: fallbackSupply,
      pricePerToken: fallbackPricePerToken,
      decimals: SEER_DECIMALS,
    };
  }
}

/**
 * Calculate APR for a farm based on SEER reward rate and TVL
 * @param rewardRate - Reward rate in SEER tokens per second (with decimals)
 * @param tvl - Total Value Locked in USD
 * @param rewardTokenDecimals - Decimals of the reward token (default: SEER decimals)
 * @returns APR as a percentage
 */
export async function calculateFarmAPR(
  rewardRate: string | bigint,
  tvl: number,
  rewardTokenDecimals: number = SEER_DECIMALS
): Promise<number> {
  if (!tvl || tvl === 0) return 0;

  try {
    const { pricePerToken } = await getSeerTokenInfo();

    // Convert reward rate to number (tokens per second)
    const rewardRateBigInt = typeof rewardRate === 'string' ? BigInt(rewardRate) : rewardRate;
    const rewardPerSecond = Number(formatUnits(rewardRateBigInt, rewardTokenDecimals));

    // Calculate annual rewards in tokens
    const secondsPerYear = 365 * 24 * 60 * 60;
    const annualRewards = rewardPerSecond * secondsPerYear;

    // Calculate annual rewards in USD
    const annualRewardsUSD = annualRewards * pricePerToken;

    // Calculate APR
    const apr = (annualRewardsUSD / tvl) * 100;

    return apr;
  } catch (error) {
    console.error('Failed to calculate APR:', error);
    return 0;
  }
}