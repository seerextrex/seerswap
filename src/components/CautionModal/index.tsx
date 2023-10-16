import { t, Trans } from "@lingui/macro";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import { AgreeButton, CautionList, CautionListItem, CautionModalInner } from "./styled";

const agreementItems = [
    t`Using Swapr involves various risks, including, but not limited to, losses while digital assets are being supplied to Swapr, and losses due to the fluctuation of prices of tokens in a trading pair or liquidity pool.`,
    t`You use Swapr at your own risk and without warranties of any kind. Swapr is not liable for potential losses.`,
    t`Before using Swapr, you should review the relevant documentation to make sure you understand how Swapr works.`,
    t`You are responsible for completing your own due diligence to understand the risks of trading crypto.`,
];

export default function CautionModal() {
    const [cautionModal, toggleCautionModal] = useState(() => {
        const accepted = localStorage.getItem("cautionAccepted");
        return !accepted;
    });

    const handleAgreement = useCallback(() => {
        localStorage.setItem("cautionAccepted", "true");
        toggleCautionModal(false);
    }, []);

    return (
        <Modal isOpen={cautionModal} onDismiss={() => {}}>
            <CautionModalInner>
                <p>
                    <Trans>Please confirm that you agree with the following paragraphs:</Trans>
                </p>
                <CautionList>
                    {agreementItems.map((el, i) => (
                        <CautionListItem key={i}>{el}</CautionListItem>
                    ))}
                </CautionList>
                <AgreeButton onClick={handleAgreement}>
                    <Trans>I agree</Trans>
                </AgreeButton>
            </CautionModalInner>
        </Modal>
    );
}
