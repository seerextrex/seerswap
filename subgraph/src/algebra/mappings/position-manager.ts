/* eslint-disable prefer-const */
import {
  Collect,
  IncreaseLiquidity,
  DecreaseLiquidity,
  NonfungiblePositionManager,
  Transfer
} from '../../../generated/NonfungiblePositionManager/NonfungiblePositionManager'
import { Position, Deposit, PositionSnapshot, Token, Pool, Mint, Factory, Tick, PoolPosition, Market } from '../../../generated/schema'
import { ADDRESS_ZERO, factoryContract, ZERO_BD, ZERO_BI, pools_list, FACTORY_ADDRESS, ONE_BI } from '../utils/constants'
import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { convertTokenToDecimal, loadTransaction } from '../utils'
import { FarmingCenterAddress } from '../../algebra-farming/utils/constants'
import { createTick } from '../utils/tick'
import { 
  updateAlgebraDayData,
  updatePoolDayData,
  updatePoolHourData,
  updateTokenDayData,
  updateTokenHourData,
  updateTickDayData
} from '../utils/intervalUpdates'
import { updateMarketDayData, updateMarketHourData } from '../utils/marketUpdates'
import { Pool as PoolABI } from '../../../generated/Factory/Pool'


export function getPosition(event: ethereum.Event, tokenId: BigInt): Position | null {


  let position = Position.load(tokenId.toString())
  if (position === null) {
    let contract = NonfungiblePositionManager.bind(event.address)
    let positionCall = contract.try_positions(tokenId)

    // the following call reverts in situations where the position is minted
    // and deleted in the same block 
    const stringBoolean = `${positionCall.reverted}`;
    if (!positionCall.reverted) {
      let positionResult = positionCall.value
      let poolAddress = factoryContract.poolByPair(positionResult.value2, positionResult.value3)

      position = new Position(tokenId.toString())
      // The owner gets correctly updated in the Transfer handler
      position.owner = Address.fromString(ADDRESS_ZERO)
      position.pool = poolAddress.toHexString()
      if (pools_list.includes(position.pool)) {
        position.token0 = positionResult.value3.toHexString()
        position.token1 = positionResult.value2.toHexString()
      }
      else {
        position.token0 = positionResult.value2.toHexString()
        position.token1 = positionResult.value3.toHexString()
      }
      position.tickLower = position.pool.concat('#').concat(positionResult.value4.toString())
      position.tickUpper = position.pool.concat('#').concat(positionResult.value5.toString())
      position.liquidity = ZERO_BI
      position.depositedToken0 = ZERO_BD
      position.depositedToken1 = ZERO_BD
      position.withdrawnToken0 = ZERO_BD
      position.withdrawnToken1 = ZERO_BD
      position.collectedToken0 = ZERO_BD
      position.collectedToken1 = ZERO_BD
      position.collectedFeesToken0 = ZERO_BD
      position.collectedFeesToken1 = ZERO_BD
      position.transaction = loadTransaction(event).id
      position.feeGrowthInside0LastX128 = positionResult.value7
      position.feeGrowthInside1LastX128 = positionResult.value8
    }
  }

  return position

  return null
}


function updateFeeVars(position: Position, event: ethereum.Event, tokenId: BigInt): Position {

  let positionManagerContract = NonfungiblePositionManager.bind(event.address)
  let positionResult = positionManagerContract.try_positions(tokenId)
  if (!positionResult.reverted) {
    position.feeGrowthInside0LastX128 = positionResult.value.value7
    position.feeGrowthInside1LastX128 = positionResult.value.value8
  }
  return position
}

function savePositionSnapshot(position: Position, event: ethereum.Event): void {

  let positionSnapshot = new PositionSnapshot(position.id.concat('#').concat(event.block.number.toString()))
  positionSnapshot.owner = position.owner
  positionSnapshot.pool = position.pool
  positionSnapshot.position = position.id
  positionSnapshot.blockNumber = event.block.number
  positionSnapshot.timestamp = event.block.timestamp
  positionSnapshot.liquidity = position.liquidity

  if (pools_list.includes(position.pool)) {
    positionSnapshot.depositedToken0 = position.depositedToken1
    positionSnapshot.depositedToken1 = position.depositedToken0
    positionSnapshot.withdrawnToken0 = position.withdrawnToken1
    positionSnapshot.withdrawnToken1 = position.withdrawnToken0
    positionSnapshot.collectedFeesToken0 = position.collectedFeesToken1
    positionSnapshot.collectedFeesToken1 = position.collectedFeesToken0
    positionSnapshot.transaction = loadTransaction(event).id
    positionSnapshot.feeGrowthInside0LastX128 = position.feeGrowthInside1LastX128
    positionSnapshot.feeGrowthInside1LastX128 = position.feeGrowthInside0LastX128
  }
  else {
    positionSnapshot.depositedToken0 = position.depositedToken0
    positionSnapshot.depositedToken1 = position.depositedToken1
    positionSnapshot.withdrawnToken0 = position.withdrawnToken0
    positionSnapshot.withdrawnToken1 = position.withdrawnToken1
    positionSnapshot.collectedFeesToken0 = position.collectedFeesToken0
    positionSnapshot.collectedFeesToken1 = position.collectedFeesToken1
    positionSnapshot.transaction = loadTransaction(event).id
    positionSnapshot.feeGrowthInside0LastX128 = position.feeGrowthInside0LastX128
    positionSnapshot.feeGrowthInside1LastX128 = position.feeGrowthInside1LastX128
  }

  positionSnapshot.save()
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  //log.error("handleIncreaseLiquidity event tx hash: {}", [event.transaction.hash.toHexString()])
  let position = getPosition(event, event.params.tokenId)
  // position was not able to be fetched
  if (position == null) {
    log.error("Position not found for increase liquidity event tx hash: {}", [event.transaction.hash.toHexString()])
    return
  }
  
  // Load pool and check if it needs initialization
  let pool = Pool.load(event.params.pool.toHexString())
  if (pool == null) {
    log.error("Pool not found for increase liquidity event: {}", [event.params.pool.toHexString()])
    return
  }
  
  let token0 = Token.load(position.token0)
  let token1 = Token.load(position.token1)

  if (token0 == null || token1 == null) {
    // happens all the time for non seer lp
    log.error("Token not found for increase liquidity event tx hash: {}", [event.transaction.hash.toHexString()])
    log.error("token0: {}, token1: {}", [position.token0, position.token1])
    return
  }


  let amount1 = ZERO_BD
  let amount0 = ZERO_BD

  if (pools_list.includes(position.pool))
    amount0 = convertTokenToDecimal(event.params.amount1, token0!.decimals)
  else
    amount0 = convertTokenToDecimal(event.params.amount0, token0!.decimals)

  if (pools_list.includes(position.pool))
    amount1 = convertTokenToDecimal(event.params.amount0, token1!.decimals)
  else
    amount1 = convertTokenToDecimal(event.params.amount1, token1!.decimals)

  position.liquidity = position.liquidity.plus(event.params.liquidity)
  position.depositedToken0 = position.depositedToken0.plus(amount0)
  position.depositedToken1 = position.depositedToken1.plus(amount1)

  // recalculatePosition(position)


  position.save()

  savePositionSnapshot(position, event)
  
  // Check if this is the first liquidity addition (initial mint) to the pool
  // We specifically check if this is happening in the same block as pool creation
  // to avoid double-counting when the template starts working in the next block
  let isInitialMintInCreationBlock = pool.txCount.equals(ZERO_BI) &&
                                     pool.createdAtBlockNumber.equals(event.block.number)
  
  if (isInitialMintInCreationBlock) {
    //log.error("Handling initial mint for pool {} in IncreaseLiquidity (same block as creation)", [pool.id])
    
    // First, replicate handleInitialize logic to set initial price and tick
    // The pool's initialize function has already been called at this point
    let poolContract = PoolABI.bind(Address.fromString(pool.id))
    let globalState = poolContract.try_globalState()
    
    if (!globalState.reverted) {
      pool.sqrtPrice = globalState.value.value0  // price
      pool.tick = BigInt.fromI32(globalState.value.value1)  // tick
      /*log.error("Set initial pool price and tick for pool {}: sqrtPrice={}, tick={}", [
        pool.id,
        pool.sqrtPrice.toString(),
        pool.tick.toString()
      ])*/
    } else {
      log.warning("Could not fetch globalState for pool {} in initial mint", [pool.id])
    }
    
    // Get position details to determine tick range
    let positionManagerContract = NonfungiblePositionManager.bind(event.address)
    let positionResult = positionManagerContract.try_positions(event.params.tokenId)
    
    if (!positionResult.reverted) {
      let bottomTick = positionResult.value.value4
      let topTick = positionResult.value.value5
      
      // Create Mint entity
      let transaction = loadTransaction(event)
      // Calculate the expected Mint event logIndex (typically 2 events before IncreaseLiquidity)
      // This matches the actual Mint event emitted by the pool contract
      // Order: Pool's Mint event -> NFT Transfer event -> IncreaseLiquidity event
      let expectedMintLogIndex = event.logIndex.minus(BigInt.fromI32(2))
      let mintId = transaction.id + '#' + expectedMintLogIndex.toString()
      
      // Check if Mint already exists for idempotency
      let mint = Mint.load(mintId)
      if (mint === null) {
        mint = new Mint(mintId)
        //log.error("Creating Mint entity with id: {} for pool: {}", [mintId, pool.id])
      } else {
        //log.warning("Mint entity {} already exists, skipping creation.", [mintId])
        // Early return to avoid duplicate processing
        return
      }
      
      mint.transaction = transaction.id
      mint.timestamp = transaction.timestamp
      mint.pool = pool.id
      mint.token0 = pool.token0
      mint.token1 = pool.token1
      // The owner/sender for NFT position manager mints
      mint.owner = event.transaction.from
      mint.sender = event.address
      mint.origin = event.transaction.from
      mint.amount = event.params.actualLiquidity
      mint.amount0 = amount0
      mint.amount1 = amount1
      
      let amountUSD = amount0
        .times(token0.derivedMatic)
        .plus(amount1.times(token1.derivedMatic))
      mint.amountUSD = amountUSD
      
      mint.tickLower = BigInt.fromI32(bottomTick)
      mint.tickUpper = BigInt.fromI32(topTick)
      
      // Update pool liquidity and TVL
      let factory = Factory.load(FACTORY_ADDRESS)!
      
      // reset tvl aggregates until new amounts calculated
      factory.totalValueLockedMatic = factory.totalValueLockedMatic.minus(pool.totalValueLockedMatic)
      factory.txCount = factory.txCount.plus(ONE_BI)
      
      // reset market tvl aggregates
      if (token0.market !== null) {
        let market = Market.load(token0.market!)
        if (market !== null) {
          market.totalValueLockedUSD = market.totalValueLockedUSD.minus(pool.totalValueLockedUSD)
          market.save()
        }
      }
      if (token1.market !== null && token1.market !== token0.market) {
        let market = Market.load(token1.market!)
        if (market !== null) {
          market.totalValueLockedUSD = market.totalValueLockedUSD.minus(pool.totalValueLockedUSD)
          market.save()
        }
      }
      
      // update token0 data
      token0.txCount = token0.txCount.plus(ONE_BI)
      token0.totalValueLocked = token0.totalValueLocked.plus(amount0)
      token0.totalValueLockedUSD = token0.totalValueLocked.times(token0.derivedMatic)
      
      // update token1 data
      token1.txCount = token1.txCount.plus(ONE_BI)
      token1.totalValueLocked = token1.totalValueLocked.plus(amount1)
      token1.totalValueLockedUSD = token1.totalValueLocked.times(token1.derivedMatic)
      
      // pool data
      pool.txCount = pool.txCount.plus(ONE_BI)
      
      // Update pool liquidity if position includes current tick
      if (
        pool.tick !== null &&
        BigInt.fromI32(bottomTick).le(pool.tick as BigInt) &&
        BigInt.fromI32(topTick).gt(pool.tick as BigInt)
      ) {
        pool.liquidity = pool.liquidity.plus(event.params.actualLiquidity)
      }
      
      pool.totalValueLockedToken0 = pool.totalValueLockedToken0.plus(amount0)
      pool.totalValueLockedToken1 = pool.totalValueLockedToken1.plus(amount1)
      pool.totalValueLockedMatic = pool.totalValueLockedToken0
        .times(token0.derivedMatic)
        .plus(pool.totalValueLockedToken1.times(token1.derivedMatic))
      pool.totalValueLockedUSD = pool.totalValueLockedMatic
      
      // reset aggregates with new amounts
      factory.totalValueLockedMatic = factory.totalValueLockedMatic.plus(pool.totalValueLockedMatic)
      factory.totalValueLockedUSD = factory.totalValueLockedMatic
      
      // update market tvl aggregates
      if (token0.market !== null) {
        let market = Market.load(token0.market!)
        if (market !== null) {
          market.totalValueLockedUSD = market.totalValueLockedUSD.plus(pool.totalValueLockedUSD)
          market.save()
          updateMarketDayData(market, event)
          updateMarketHourData(market, event)
        }
      }
      if (token1.market !== null && token1.market !== token0.market) {
        let market = Market.load(token1.market!)
        if (market !== null) {
          market.totalValueLockedUSD = market.totalValueLockedUSD.plus(pool.totalValueLockedUSD)
          market.save()
          updateMarketDayData(market, event)
          updateMarketHourData(market, event)
        }
      }
      
      // Create/update tick entities
      let poolAddress = event.params.pool.toHexString()
      let lowerTickId = poolAddress + '#' + BigInt.fromI32(bottomTick).toString()
      let upperTickId = poolAddress + '#' + BigInt.fromI32(topTick).toString()
      
      log.info("Creating ticks for initial mint - lowerTickId: {} upperTickId: {}", [lowerTickId, upperTickId])
      
      let lowerTick = Tick.load(lowerTickId)
      let upperTick = Tick.load(upperTickId)
      
      if (lowerTick === null) {
        log.info("Creating new lowerTick: {}", [lowerTickId])
        lowerTick = createTick(lowerTickId, bottomTick, pool.id, event)
        lowerTick.save()
      }
      
      if (upperTick === null) {
        log.info("Creating new upperTick: {}", [upperTickId])
        upperTick = createTick(upperTickId, topTick, pool.id, event)
        upperTick.save()
      }
      
      let liquidityAmount = event.params.actualLiquidity
      lowerTick.liquidityGross = lowerTick.liquidityGross.plus(liquidityAmount)
      lowerTick.liquidityNet = lowerTick.liquidityNet.plus(liquidityAmount)
      upperTick.liquidityGross = upperTick.liquidityGross.plus(liquidityAmount)
      upperTick.liquidityNet = upperTick.liquidityNet.minus(liquidityAmount)
      
      // Create PoolPosition
      let poolPositionid = pool.id + "#" + event.transaction.from.toHexString() + '#' + BigInt.fromI32(bottomTick).toString() + "#" + BigInt.fromI32(topTick).toString()
      let poolPosition = PoolPosition.load(poolPositionid)
      if (poolPosition) {
        poolPosition.liquidity = poolPosition.liquidity.plus(liquidityAmount)
      } else {
        poolPosition = new PoolPosition(poolPositionid)
        poolPosition.pool = pool.id
        poolPosition.lowerTick = lowerTick.id
        poolPosition.upperTick = upperTick.id
        poolPosition.liquidity = liquidityAmount
        poolPosition.owner = event.transaction.from
      }
      
      // Update all the day/hour data
      updateAlgebraDayData(event)
      updatePoolDayData(event, pool.id)
      updatePoolHourData(event, pool.id)
      updateTokenDayData(token0 as Token, event)
      updateTokenDayData(token1 as Token, event)
      updateTokenHourData(token0 as Token, event)
      updateTokenHourData(token1 as Token, event)
      
      // Save all entities
      token0.save()
      token1.save()
      pool.save()
      poolPosition.save()
      factory.save()
      mint.save()
      
      // Update tick fee vars and save
      updateTickFeeVarsAndSave(lowerTick, event, event.params.pool)
      updateTickFeeVarsAndSave(upperTick, event, event.params.pool)
    } else {
      log.error("Failed to get position details for initial mint handling", [])
    }
  }

  // farming


  let entity = Deposit.load(event.params.tokenId.toString());

  if (entity === null) {
    entity = new Deposit(event.params.tokenId.toString());
    entity.owner = event.transaction.from;
    entity.pool = event.params.pool.toHexString();
    // load pool and read markets
    let pool = Pool.load(event.params.pool.toHexString())
    if (pool == null) {
      log.error("Pool not found for increase liquidity event tx hash: {}", [event.transaction.hash.toHexString()])
      return
    }
    // Use consistent Mint ID format - matching the actual Mint event that would have been emitted
    // by the pool contract (2 events before IncreaseLiquidity)
    entity.mint = event.transaction.hash.toHexString() + '#' + event.logIndex.minus(BigInt.fromI32(2)).toString()
    let mint = Mint.load(entity.mint)

    entity.mintUSD = mint !== null ? mint!.amountUSD! : ZERO_BD
    let recalculatedMintUSD = ZERO_BD;
    let token0 = Token.load(pool.token0)
    let token1 = Token.load(pool.token1)
    if (token0 == null || token1 == null) {
      log.error("Token not found for pool {}", [entity.mint])
      return
    }
    let netAmount0 = position.depositedToken0.minus(position.withdrawnToken0)
    let netAmount1 = position.depositedToken1.minus(position.withdrawnToken1)

    recalculatedMintUSD = netAmount0.times(token0!.derivedMatic).plus(netAmount1.times(token1!.derivedMatic))
    log.info("Recalculated mint USD: {}", [recalculatedMintUSD.toString()])
    entity.mintUSD = recalculatedMintUSD;
    if (mint === null) {
      log.warning("Mint not found for pool {}", [entity.mint])
    }
    entity.market0 = pool.market0
    entity.market1 = pool.market1
    entity.onFarmingCenter = false;
    entity.liquidity = BigInt.fromString("0")
    entity.rangeLength = getRangeLength(event.params.tokenId, event.address)
    entity.L2tokenId = event.params.tokenId
    entity.tokensLockedLimit = BigInt.fromString("0")
    entity.tokensLockedEternal = BigInt.fromString("0")
    entity.tierLimit = BigInt.fromString("0")
    entity.tierEternal = BigInt.fromString("0")
  }
  entity.liquidity = entity.liquidity.plus(event.params.actualLiquidity);
  entity.save();

}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let position = getPosition(event, event.params.tokenId)

  // position was not able to be fetched
  if (position == null) {
    return
  }

  let token0 = Token.load(position.token0)
  let token1 = Token.load(position.token1)

  if (token0 == null || token1 == null) {
    return
  }

  let amount1 = ZERO_BD
  let amount0 = ZERO_BD

  if (pools_list.includes(position.pool))
    amount0 = convertTokenToDecimal(event.params.amount1, token0!.decimals)
  else
    amount0 = convertTokenToDecimal(event.params.amount0, token0!.decimals)

  if (pools_list.includes(position.pool))
    amount1 = convertTokenToDecimal(event.params.amount0, token1!.decimals)
  else
    amount1 = convertTokenToDecimal(event.params.amount1, token1!.decimals)


  position.liquidity = position.liquidity.minus(event.params.liquidity)
  position.withdrawnToken0 = position.withdrawnToken0.plus(amount0)
  position.withdrawnToken1 = position.withdrawnToken1.plus(amount1)


  // update mint amount
  let netAmount0 = position.depositedToken0.minus(position.withdrawnToken0)
  let netAmount1 = position.depositedToken1.minus(position.withdrawnToken1)

  let entity = Deposit.load(event.params.tokenId.toString());
  if (entity) {
    entity.mintUSD = netAmount0.times(token0!.derivedMatic).plus(netAmount1.times(token1!.derivedMatic))
    entity.save()
  }

  position = updateFeeVars(position, event, event.params.tokenId)
  // recalculatePosition(position)

  position.save()

  savePositionSnapshot(position, event)

  //farming

  let deposit = Deposit.load(event.params.tokenId.toString());
  if (deposit) {
    deposit.liquidity = deposit.liquidity.minus(event.params.liquidity)
    deposit.save()
  }
}


export function handleCollect(event: Collect): void {
  let position = getPosition(event, event.params.tokenId)

  // position was not able to be fetched
  if (position == null) {
    return
  }

  let token0 = Token.load(position.token0)
  let token1 = Token.load(position.token1)

  if (token0 == null || token1 == null) {
    return
  }

  let amount1 = ZERO_BD
  let amount0 = ZERO_BD


  if (pools_list.includes(position.pool))
    amount0 = convertTokenToDecimal(event.params.amount1, token0!.decimals)
  else
    amount0 = convertTokenToDecimal(event.params.amount0, token0!.decimals)


  if (pools_list.includes(position.pool))
    amount1 = convertTokenToDecimal(event.params.amount0, token1!.decimals)
  else
    amount1 = convertTokenToDecimal(event.params.amount1, token1!.decimals)


  position.collectedToken0 = position.collectedToken0.plus(amount0)
  position.collectedToken1 = position.collectedToken1.plus(amount1)

  position.collectedFeesToken0 = position.collectedToken0.minus(position.withdrawnToken0)
  position.collectedFeesToken1 = position.collectedToken1.minus(position.withdrawnToken1)

  position = updateFeeVars(position, event, event.params.tokenId)

  // recalculatePosition(position)

  position.save()

  savePositionSnapshot(position, event)
}

export function handleTransfer(event: Transfer): void {

  let position = getPosition(event, event.params.tokenId)

  // position was not able to be fetched
  if (position == null) {
    return
  }

  let token0 = Token.load(position.token0)
  let token1 = Token.load(position.token1)

  if (token0 === null || token1 === null) {
    return
  }


  position.owner = event.params.to
  position.save()

  savePositionSnapshot(position, event)

  // farming


  let entity = Deposit.load(event.params.tokenId.toString());

  if (entity != null) {
    entity.owner = event.params.to;

    if (event.params.to == FarmingCenterAddress) {
      entity.onFarmingCenter = true
      entity.owner = event.params.from;
    }

    if (event.params.from == FarmingCenterAddress) {
      entity.onFarmingCenter = false
    }
    entity.save();
  }

}

function getRangeLength(tokenId: BigInt, eventAddress: Address): BigInt {
  let contract = NonfungiblePositionManager.bind(eventAddress)
  let positionCall = contract.try_positions(tokenId)

  // the following call reverts in situations where the position is minted
  // and deleted in the same block 
  if (!positionCall.reverted) {
    let positionResult = positionCall.value
    return BigInt.fromI32(positionResult.value5 - positionResult.value4)
  }
  else {
    return BigInt.fromString('0')
  }
}

function updateTickFeeVarsAndSave(tick: Tick, event: ethereum.Event, poolAddress: Address): void {
  // not all ticks are initialized so obtaining null is expected behavior
  let poolContract = PoolABI.bind(poolAddress)

  // Try to get tick data from contract, but handle failures gracefully
  let tickResult = poolContract.try_ticks(tick.tickIdx.toI32())
  if (!tickResult.reverted) {
    tick.feeGrowthOutside0X128 = tickResult.value.value2
    tick.feeGrowthOutside1X128 = tickResult.value.value3
  } else {
    // Log the error but continue - tick will still be saved with default fee values
    log.error("Failed to fetch tick data from contract for tick {} in pool {}", [
      tick.tickIdx.toString(),
      poolAddress.toHexString()
    ])
  }
  
  tick.save()
  updateTickDayData(tick, event)
}