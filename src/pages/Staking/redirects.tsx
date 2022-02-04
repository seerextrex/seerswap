import { useActiveWeb3React } from 'hooks/web3'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { WMATIC_EXTENDED } from '../../constants/tokens'
import { NewIncentivePage } from './NewIncentivePage'

export function RedirectDuplicateTokenStakingIds(
    props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; rewardTokenId: string }>
) {
    const {
        match: {
            params: { currencyIdA, currencyIdB, rewardTokenId }
        }
    } = props

    const { chainId } = useActiveWeb3React()

    // prevent weth + eth
    let symbol

    if (chainId === 137) {
        symbol = 'MATIC'
    }

    const isETHOrWETHA =
        currencyIdA === symbol || (chainId !== undefined && currencyIdA === WMATIC_EXTENDED[chainId]?.address)
    const isETHOrWETHB =
        currencyIdB === symbol || (chainId !== undefined && currencyIdB === WMATIC_EXTENDED[chainId]?.address)

    if (
        currencyIdA &&
        currencyIdB &&
        (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))
    ) {
        return <Redirect to={`/new-incentive/${currencyIdA}`} />
    }
    return <NewIncentivePage {...props} />
}
