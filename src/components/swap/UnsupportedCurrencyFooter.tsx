import { useState } from 'react'
import { CloseIcon, TYPE } from 'theme'
import { ButtonEmpty } from 'components/Button'
import Modal from 'components/Modal'
import Card from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { useActiveWeb3React } from 'hooks/web3'
import { Currency } from '@uniswap/sdk-core'
import { Trans } from '@lingui/macro'
import { DetailsFooter } from './styled'

export default function UnsupportedCurrencyFooter({
    show,
    currencies
}: {
    show: boolean
    currencies: (Currency | undefined)[]
}) {
    const { chainId } = useActiveWeb3React()
    const [showDetails, setShowDetails] = useState(false)

    const tokens =
        chainId && currencies
            ? currencies.map((currency) => {
                return currency?.wrapped
            })
            : []

    return (
        <DetailsFooter show={show}>
            <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
                <Card padding='2rem'>
                    <AutoColumn gap='lg'>
                        <RowBetween>
                            <TYPE.mediumHeader>
                                <Trans>Unsupported Assets</Trans>
                            </TYPE.mediumHeader>
                            <CloseIcon onClick={() => setShowDetails(false)} />
                        </RowBetween>
                        <AutoColumn gap='lg'>
                            <TYPE.body fontWeight={500}>
                                <Trans>
                                    Some assets are not available through this interface because
                                    they may not work well with the smart
                                    contracts or we are unable to allow trading for legal reasons.
                                </Trans>
                            </TYPE.body>
                        </AutoColumn>
                    </AutoColumn>
                </Card>
            </Modal>
            <ButtonEmpty padding={'0'} onClick={() => setShowDetails(true)}>
                <TYPE.blue>
                    <Trans>Read more about unsupported assets</Trans>
                </TYPE.blue>
            </ButtonEmpty>
        </DetailsFooter>
    )
}
