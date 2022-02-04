import { Currency } from '@uniswap/sdk-core'
import React from 'react'
import styled from 'styled-components/macro'
import MaticLogo from '../../assets/images/matic-logo.png'
import AlgebraLogo from '../../assets/images/algebra-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { useActiveWeb3React } from '../../hooks/web3'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { stringToColour } from '../../utils/stringToColour'
import { specialTokens } from './SpecialTokens'

export const getTokenLogoURL = (address: string) =>
    `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledImgLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: Montserrat, serif;
  font-weight: 600;
`

export default function CurrencyLogo({
    currency,
    size = '24px',
    style,
    ...rest
}: {
    currency?: Currency
    size?: string
    style?: React.CSSProperties
}) {
    const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

    const { chainId } = useActiveWeb3React()

    let logo

    if (chainId === 137) {
        logo = MaticLogo
    }

    if (!currency) return <div />

    if (currency?.address?.toLowerCase() in specialTokens) {
        return <StyledImgLogo src={specialTokens[currency?.address.toLowerCase()].logo} size={size}
                              style={style} {...rest} />
    }

    if (currency?.wrapped?.address.toLowerCase() === '0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6'.toLowerCase()) {
        return <StyledImgLogo src={AlgebraLogo} size={size} style={style} {...rest} />
    }

    if (currency?.isNative) {
        return <StyledImgLogo src={logo} size={size} style={style} {...rest} />
    }

    return (
        <StyledLogo
            size={size}
            style={{
                ...style,
                background: stringToColour(currency?.symbol).background,
                color: stringToColour(currency?.symbol).text,
                border: stringToColour(currency?.symbol).border,

                fontSize: size === '18px' ? '8px' : size === '24px' ? '12px' : '14px'
            }}
            {...rest}
        >
            {currency?.symbol?.slice(0, 2)}
        </StyledLogo>
    )
}
