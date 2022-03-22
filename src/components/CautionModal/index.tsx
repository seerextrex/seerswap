import { Trans } from "@lingui/macro";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import { AgreeButton, CautionList, CautionListItem, CautionModalInner } from "./styled";

const agreementItems = [
    <Trans>
        Using Algebra involves various risks, including, but not limited to, losses while digital assets are being supplied to Algebra, and losses due to the fluctuation of prices of tokens in a
        trading pair or liquidity pool.
    </Trans>,
    <Trans>You use Algebra at your own risk and without warranties of any kind. Algebra is not liable for potential losses.</Trans>,
    <Trans>Before using Algebra, you should review the relevant documentation to make sure you understand how Algebra works.</Trans>,
    <Trans>You are responsible for completing your own due diligence to understand the risks of trading crypto.</Trans>,
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
                <div style={{ textAlign: "center", marginBottom: "2rem", fontWeight: 600 }}>
                    <Trans>Welcome to Algebra, the first concentrated liquidity DEX on Polygon!</Trans>
                </div>
                <p style={{ textAlign: "center" }}>
                    <Trans>
                        Check out our{" "}
                        <a tabIndex={-1} target="_blank" rel="noreferrer noopener" href="https://algebra.finance/static/Algebra_Tech_Paper-51ff302b23209d0432e2453dbd9649a8.pdf">
                            Tech Paper
                        </a>{" "}
                        and read about what{" "}
                        <a target="_blank" rel="noreferrer noopener" href={"https://arxiv.org/pdf/2110.01368.pdf"} tabIndex={-1}>
                            concentrated liquidity is
                        </a>
                        .
                    </Trans>
                </p>
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
