import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState } from "react";
import { ApplicationModal } from "state/application/actions";
import { useModalOpen, useToggleModal } from "state/application/hooks";
import { CHAIN_INFO } from "../../constants/chains";
import GnosisLogo from "../../assets/svg/gnosis-logo.svg";
import styled from "styled-components/macro";

import AlgebraConfig from "algebra.config";

export default function NetworkCard() {
    const { chainId, connector } = useWeb3React();

    const node = useRef<HTMLDivElement>(null);
    const open = useModalOpen(ApplicationModal.ARBITRUM_OPTIONS);
    const toggle = useToggleModal(ApplicationModal.ARBITRUM_OPTIONS);
    useOnClickOutside(node, open ? toggle : undefined);

    const [implements3085, setImplements3085] = useState(false);
    useEffect(() => {
        // metamask is currently the only known implementer of this EIP
        // here we proceed w/ a noop feature check to ensure the user's version of metamask supports network switching
        // if not, we hide the UI
        if (!chainId) {
            return;
        }
        connector.activate(chainId);
    }, [chainId, connector]);

    const info = chainId ? CHAIN_INFO[chainId] : undefined;
    if (!chainId || !info) {
        return null;
    }

    if (chainId == AlgebraConfig.CHAIN_PARAMS.chainId) {
        return (
            <div className="f" style={{ display: "flex", alignItems: "center" }}>
                <img src={GnosisLogo} width="20" height="20" style={{ borderRadius: "50%" }} />
                <NetworkName className="ml-05" style={{ width: "max-content" }} title={info.label}>
                    {info.label}
                </NetworkName>
            </div>
        );
    }

    return <div title={info.label}>{info.label}</div>;
}

export const NetworkName = styled.div`
    display: block;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
  `}
`;
