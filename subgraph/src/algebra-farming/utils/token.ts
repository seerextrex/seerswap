import { ERC20 } from '../../../generated/EternalFarming/ERC20'
import { ERC20SymbolBytes } from '../../../generated/EternalFarming/ERC20SymbolBytes'
import { ERC20NameBytes } from '../../../generated/EternalFarming/ERC20NameBytes'
import { StaticTokenDefinition } from './staticTokenDefinition'
import { BigInt, Address, log } from '@graphprotocol/graph-ts'
import { Token } from '../../../generated/schema';
import { fetchTokenTotalSupply } from '../../algebra/utils/token'
import { ADDRESS_ZERO, ZERO_BD, ZERO_BI } from '../../algebra/utils/constants'

function isNullEthValue(value: string): boolean {
  return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  let symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      } else {
        // try with the static definition
        let staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress)
        if (staticTokenDefinition != null) {
          symbolValue = staticTokenDefinition.symbol
        }
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  let nameResult = contract.try_name()
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      } else {
        // try with the static definition
        let staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress)
        if (staticTokenDefinition != null) {
          nameValue = staticTokenDefinition.name
        }
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = BigInt.fromString("1")
  let decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = BigInt.fromI32(decimalResult.value as i32)
  } else {
    // try with the static definition
    let staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress)
    if (staticTokenDefinition != null) {
      return staticTokenDefinition.decimals
    }
  }

  return decimalValue
}

export function createTokenEntity(tokenAddress: Address, isSeer: boolean, market: Address): boolean {
  // check if token already exists
  let token = Token.load(tokenAddress.toHexString())
  if (tokenAddress.toHexString() == ADDRESS_ZERO) {
    return false;
  }
  if (tokenAddress.toHexString() == "0x68984a7d283ff918e530368e6aaad1fc2af88692"){
    log.error("YOYOYOYOYOYOY",[]);
  }
  if (token !== null) {
    //log.error('token {} already exists', [tokenAddress.toHexString()])
    return true
  }

  token = new Token(tokenAddress.toHexString())
  token.name = fetchTokenName(tokenAddress)
  let decimals = fetchTokenDecimals(tokenAddress)
  // bail if we couldn't figure out the decimals
  if (decimals === null) {
    //log.error('Failed to fetch decimals for token {} in market {}', [tokenAddress.toHexString(), market.toHexString()])
    return false
  }
  token.decimals = decimals
  token.symbol = fetchTokenSymbol(tokenAddress)
  token.totalSupply = fetchTokenTotalSupply(tokenAddress)
  token.derivedMatic = ZERO_BD
  token.volume = ZERO_BD
  token.volumeUSD = ZERO_BD
  token.feesUSD = ZERO_BD
  token.untrackedVolumeUSD = ZERO_BD
  token.totalValueLocked = ZERO_BD
  token.totalValueLockedUSD = ZERO_BD
  token.totalValueLockedUSDUntracked = ZERO_BD
  token.txCount = ZERO_BI
  token.poolCount = ZERO_BI
  token.whitelistPools = []
  token.isSeer = isSeer
  if (market.toHexString() != ADDRESS_ZERO) {
    token.market = market.toHexString()
  }
    if (tokenAddress.toHexString() == "0x68984a7d283ff918e530368e6aaad1fc2af88692"){
    log.error("YOYOYOYOYOYOY2121",[token.isSeer.toString(), token.id]);
  }
  token.save()
  return true
}