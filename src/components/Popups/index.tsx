import { useActivePopups } from '../../state/application/hooks'
import PopupItem from './PopupItem'
import { useURLWarningVisible } from '../../state/user/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { SupportedChainId } from 'constants/chains'
import { FixedPopupColumn, MobilePopupInner, MobilePopupWrapper } from './styled'

export default function Popups() {
    // get all popups
    const activePopups = useActivePopups()

    const urlWarningActive = useURLWarningVisible()

    // need extra padding if network is not L1 Ethereum
    const { chainId } = useActiveWeb3React()
    const isNotOnMainnet = Boolean(chainId && chainId !== SupportedChainId.POLYGON)

    return (
        <>
            <FixedPopupColumn gap='20px' extraPadding={urlWarningActive} xlPadding={isNotOnMainnet}>
                {activePopups.map((item) => (
                    <PopupItem
                        key={item.key}
                        content={item.content}
                        popKey={item.key}
                        removeAfterMs={item.removeAfterMs}
                    />
                ))}
            </FixedPopupColumn>
            <MobilePopupWrapper height={activePopups?.length > 0 ? 'fit-content' : 0}>
                <MobilePopupInner>
                    {activePopups // reverse so new items up front
                        .slice(0)
                        .reverse()
                        .map((item) => (
                            <PopupItem
                                key={item.key}
                                content={item.content}
                                popKey={item.key}
                                removeAfterMs={item.removeAfterMs}
                            />
                        ))}
                </MobilePopupInner>
            </MobilePopupWrapper>
        </>
    )
}
