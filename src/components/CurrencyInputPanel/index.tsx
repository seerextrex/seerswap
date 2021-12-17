import { Pair } from '@uniswap/v2-sdk'
import { Currency, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { useState, useCallback, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components/macro'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ButtonGray } from '../Button'
import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import { Trans } from '@lingui/macro'
import useTheme from '../../hooks/useTheme'
import { Lock } from 'react-feather'
import { AutoColumn } from 'components/Column'
import { FiatValue } from './FiatValue'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import Loader from '../Loader'
import useUSDCPrice from '../../hooks/useUSDCPrice'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  // background-color: ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.bg2)};
  background-color: transparent;
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%!important;
  `}
`

const FixedContainer = styled.div`
  width: 100%;
  height: 60px;
  align-items: center;
  position: absolute;
  display: flex;
  justify-content: center;
  z-index: 2;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  // border: 1px solid ${({ theme, hideInput }) => (hideInput ? ' transparent' : theme.bg2)};
  // background-color: ${({ theme }) => theme.bg1};
  background-color: transparent;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  :focus, ;
  // :hover {
  // border: 1px solid ${({ theme, hideInput }) => (hideInput ? ' transparent' : theme.bg3)};
  // }
`

const CurrencySelect = styled(ButtonGray)<{ selected: boolean; hideInput?: boolean }>`
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? '#759FE3' : theme.winterMainButton)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 16px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  height: ${({ hideInput }) => (hideInput ? '38px' : '35px')};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  padding: 0 15px;
  justify-content: space-between;
  margin-right: ${({ hideInput }) => (hideInput ? '0' : '12px')};
  :focus,
  :hover {
    background-color: ${({ selected, theme }) =>
      selected ? darken(0.05, '#759FE3') : darken(0.05, theme.winterMainButton)};
  }

  ${({ shallow }) =>
    shallow &&
    css`
      padding: 0;
      background-color: transparent;
      box-shadow: none;
      &:hover {
        background-color: transparent;
      }
    `}

  ${({ swap }) =>
    swap &&
    css`
      width: 218px;
    `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`{
    width: 100%;
    margin: 10px 0 0 0;
  }`}
`

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ hideCurrency }) => (hideCurrency ? '1rem 1rem 0.75rem 0' : '1rem 1rem 0.75rem 1rem')};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`{
    flex-direction: column;
    // height: 120px;
  }`}
`
const AutoColumnStyled = styled(AutoColumn)`
  left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  bottom: -25% !important;
  `}
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0 1rem 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  padding: ${({ shallow }) => (shallow ? '0' : '0 1rem 1rem')};
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: ${({ centered }) => (centered ? 'center' : 'space-between')};
  width: 100%;
  position: relative;
`
const NumericalInputStyled = styled(NumericalInput)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`{
    width: 100%;
    text-align: left!important;
    font-size: 18px!important;
    margin: 15px 0 10px;
  }`}
`
const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '16px' : '16px')};
`

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  color: ${({ theme }) => theme.primaryText1};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  pointer-events: ${({ disabled }) => (!disabled ? 'initial' : 'none')};
  margin-left: 0.25rem;

  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const MaxButton = styled.button`
  background-color: #245376;
  border-radius: 6px;
  color: white;
  margin-right: 10px;
  border: none;
  padding: 4px 6px;

  &:hover {
    background-color: ${darken(0.05, '#245376')};
  }
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: ReactNode
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: CurrencyAmount<Token> | null
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  showBalance?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  hideCurrency?: boolean
  centered?: boolean
  disabled: boolean
  shallow: boolean
  swap: boolean
  page: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  showBalance,
  hideCurrency = false,
  centered = false,
  disabled,
  shallow = false,
  swap = false,
  page,
  ...rest
}: CurrencyInputPanelProps) {
  const { chainId } = useActiveWeb3React()
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const balance = useCurrencyBalance(account ?? undefined, currency)

  const currentPrice = useUSDCPrice(currency)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  if (currency && currency.symbol === 'MATIC') {
    if (chainId === 137) {
      currency.symbol = 'MATIC'
      currency.name = 'Matic'
    }
  }

  return (
    <InputPanel id={id} hideInput={hideInput} {...rest}>
      {locked && (
        <FixedContainer style={{ height: `${page === 'pool' ? '30px' : '80px'}` }}>
          <AutoColumnStyled
            gap="sm"
            justify="center"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginTop: '18px',
              position: 'absolute',
              bottom: '10%',
            }}
          >
            {/* <Lock /> */}
            <TYPE.label fontSize="14px">
              <Trans>Price is outside specified price range. Single-asset deposit only.</Trans>
            </TYPE.label>
          </AutoColumnStyled>
        </FixedContainer>
      )}

      <Container hideInput={hideInput}>
        <InputRow
          hideCurrency={hideCurrency}
          style={
            hideInput
              ? { borderRadius: '8px', padding: `${page === 'pool' ? '0' : ''}` }
              : { padding: `${page === 'pool' ? '0' : ''}` }
          }
          selected={!onCurrencySelect}
        >
          {!hideCurrency && (
            <CurrencySelect
              selected={!!currency}
              hideInput={hideInput}
              className="open-currency-select-button"
              // style={{ backgroundColor: '#0f2e40', color: '#4cc1d5', border: '1px solid #153448' }}
              shallow={shallow}
              swap={swap}
              disabled={shallow}
              onClick={() => {
                if (onCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner centered={centered}>
                <RowFixed>
                  {pair ? (
                    <span style={{ marginRight: '0.5rem' }}>
                      <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                    </span>
                  ) : currency ? (
                    <CurrencyLogo style={{ marginRight: '0.5rem' }} currency={currency} size={'24px'} />
                  ) : null}
                  {pair ? (
                    <StyledTokenName className="pair-name-container">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </StyledTokenName>
                  ) : (
                    <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                      {(currency && currency.symbol && currency.symbol.length > 20 ? (
                        currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      ) : currency ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <span>
                            {shallow && showBalance && balance
                              ? `${balance.toSignificant(4)} ${currency.symbol}`
                              : currency.symbol}
                          </span>
                          {showBalance && balance && !shallow ? (
                            <span
                              style={{
                                position: 'absolute',
                                right: 0,
                                fontSize: '13px',
                              }}
                              title={balance.toExact()}
                            >
                              {+balance.toFixed() < 0.0001 ? '< 0.0001' : balance.toSignificant(4)}
                            </span>
                          ) : (
                            showBalance &&
                            !balance && (
                              <span
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                }}
                              >
                                <Loader />
                              </span>
                            )
                          )}
                        </div>
                      ) : null) || <Trans>Select a token</Trans>}
                    </StyledTokenName>
                  )}
                </RowFixed>
                {/* {onCurrencySelect && <StyledDropDown selected={!!currency} />} */}
              </Aligner>
            </CurrencySelect>
          )}
          {swap && currency && showMaxButton && <MaxButton onClick={onMax}>Max</MaxButton>}
          {!hideInput && (
            <>
              <NumericalInputStyled
                style={{ backgroundColor: 'transparent', textAlign: hideCurrency ? 'left' : 'right', fontSize: '20px' }}
                className="token-amount-input"
                value={value}
                disabled={disabled}
                onUserInput={(val) => {
                  if (val === '.') val = '0.'
                  onUserInput(val)
                }}
              />
            </>
          )}
        </InputRow>
        {!hideInput && !hideBalance && !locked && value ? (
          <FiatRow shallow={shallow}>
            <RowBetween>
              <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
            </RowBetween>
          </FiatRow>
        ) : currency && swap && currentPrice ? (
          <FiatRow>
            <RowBetween>{`1 ${currency.symbol} = $${currentPrice.toFixed()}`}</RowBetween>
          </FiatRow>
        ) : (
          currency && (
            <FiatRow>
              <RowBetween>Estimating...</RowBetween>
            </FiatRow>
          )
        )}
      </Container>
      {onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
        />
      )}
    </InputPanel>
  )
}
