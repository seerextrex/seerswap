import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

// SEER token contract on Ethereum mainnet
const SEER_TOKEN_ADDRESS = '0xD14Ef697281404646d8E2437a0050794a6a22Fd6' as const;
const SEER_DECIMALS = 18;

// ERC20 ABI for totalSupply
const ERC20_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

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
    // Create public client for Ethereum mainnet
    const client = createPublicClient({
      chain: mainnet,
      transport: http('https://eth.public-rpc.com'),
    });

    // Get total supply from contract
    const totalSupply = await client.readContract({
      address: SEER_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
    });

    // Double the supply as per instructions
    const doubledSupply = totalSupply * 2n;

    // Calculate price per token
    // Market cap = $1,000,000
    const marketCap = 1_000_000;
    const totalSupplyNumber = Number(formatUnits(doubledSupply, SEER_DECIMALS));
    const pricePerToken = marketCap / totalSupplyNumber;

    // Update cache
    cachedSeerInfo = {
      totalSupply: doubledSupply,
      pricePerToken,
      timestamp: Date.now(),
    };

    return {
      totalSupply: doubledSupply,
      pricePerToken,
      decimals: SEER_DECIMALS,
    };
  } catch (error) {
    console.error('Failed to fetch SEER token info:', error);
    
    // Fallback values if fetch fails
    // Approximate total supply based on typical values
    const fallbackSupply = 1_000_000_000n * 10n ** 18n; // 1 billion tokens
    const fallbackDoubledSupply = fallbackSupply * 2n;
    const fallbackTotalSupplyNumber = Number(formatUnits(fallbackDoubledSupply, SEER_DECIMALS));
    const fallbackPricePerToken = 1_000_000 / fallbackTotalSupplyNumber;

    return {
      totalSupply: fallbackDoubledSupply,
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