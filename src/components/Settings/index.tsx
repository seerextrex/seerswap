import { t, Trans } from '@lingui/macro'
import { useRef, useState } from 'react'
import { Text } from 'rebass'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import { Percent } from '@uniswap/sdk-core'
import { Break, EmojiWrapper, MenuFlyout, ModalContentWrapper, StyledCloseIcon, StyledMenu, StyledMenuButton, StyledMenuIcon } from './styled'

export default function SettingsTab({ placeholderSlippage }: { placeholderSlippage: Percent }) {
    const node = useRef<HTMLDivElement>()
    const open = useModalOpen(ApplicationModal.SETTINGS)
    const toggle = useToggleSettingsMenu()

    const [expertMode, toggleExpertMode] = useExpertModeManager()
    const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

    // show confirmation view before turning on
    const [showConfirmation, setShowConfirmation] = useState(false)

    useOnClickOutside(node, open ? toggle : undefined)

    return (
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
        <StyledMenu ref={node as any}>
            <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}
                   maxHeight={100}>
                <ModalContentWrapper>
                    <AutoColumn gap='lg'>
                        <RowBetween style={{ padding: '0 2rem' }}>
                            <div />
                            <Text fontWeight={500} fontSize={20}>
                                <Trans>Are you sure?</Trans>
                            </Text>
                            <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
                        </RowBetween>
                        <Break />
                        <AutoColumn gap='lg' style={{ padding: '0 2rem' }}>
                            <Text fontWeight={500} fontSize={20}>
                                <Trans>
                                    Expert mode turns off the confirm transaction prompt and allows
                                    high slippage trades that often result
                                    in bad rates and lost funds.
                                </Trans>
                            </Text>
                            <Text fontWeight={600} fontSize={20}>
                                <Trans>ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.</Trans>
                            </Text>
                            <ButtonError
                                error={true}
                                padding={'12px'}
                                onClick={() => {
                                    const confirmWord = t`confirm`
                                    if (window.prompt(t`Please type the word "${confirmWord}" to enable expert mode.`) === confirmWord) {
                                        toggleExpertMode()
                                        setShowConfirmation(false)
                                    }
                                }}
                            >
                                <Text fontSize={20} fontWeight={500} id='confirm-expert-mode'>
                                    <Trans>Turn On Expert Mode</Trans>
                                </Text>
                            </ButtonError>
                        </AutoColumn>
                    </AutoColumn>
                </ModalContentWrapper>
            </Modal>
            <StyledMenuButton onClick={toggle} id='open-settings-dialog-button'>
                <StyledMenuIcon />
                {expertMode ? (
                    <EmojiWrapper>
            <span role='img' aria-label='wizard-icon'>
              😎
            </span>
                    </EmojiWrapper>
                ) : null}
            </StyledMenuButton>
            {open && (
                <MenuFlyout>
                    <AutoColumn gap='md' style={{ padding: '1rem' }}>
                        <Text fontWeight={600} fontSize={14}>
                            <Trans>Transaction Settings</Trans>
                        </Text>
                        <TransactionSettings placeholderSlippage={placeholderSlippage} />
                        <Text fontWeight={600} fontSize={14}>
                            <Trans>Interface Settings</Trans>
                        </Text>
                        <RowBetween>
                            <RowFixed>
                                <TYPE.black fontWeight={400} fontSize={14} color={'#080064'}>
                                    <Trans>Expert Mode</Trans>
                                </TYPE.black>
                                <QuestionHelper
                                    text={
                                        <Trans>Allow high price impact trades and skip the confirm
                                            screen. Use at your own risk.</Trans>
                                    }
                                />
                            </RowFixed>
                            <Toggle
                                id='toggle-expert-mode-button'
                                isActive={expertMode}
                                toggle={
                                    expertMode
                                        ? () => {
                                            toggleExpertMode()
                                            setShowConfirmation(false)
                                        }
                                        : () => {
                                            toggle()
                                            setShowConfirmation(true)
                                        }
                                }
                            />
                        </RowBetween>
                        <RowBetween>
                            <RowFixed>
                                <TYPE.black fontWeight={400} fontSize={14} color={'#080064'}>
                                    <Trans>Multihops</Trans>
                                </TYPE.black>
                                <QuestionHelper
                                    text={<Trans>Restricts swaps to direct pairs only.</Trans>} />
                            </RowFixed>
                            <Toggle
                                id='toggle-disable-multihop-button'
                                isActive={!singleHopOnly}
                                toggle={() => {
                                    setSingleHopOnly(!singleHopOnly)
                                }}
                            />
                        </RowBetween>
                    </AutoColumn>
                </MenuFlyout>
            )}
        </StyledMenu>
    )
}
