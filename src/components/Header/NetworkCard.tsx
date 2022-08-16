import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useActiveWeb3React } from "hooks/web3";
import { useEffect, useRef, useState } from "react";
import { ApplicationModal } from "state/application/actions";
import { useModalOpen, useToggleModal } from "state/application/hooks";
import { switchToNetwork } from "utils/switchToNetwork";
import { CHAIN_INFO, SupportedChainId } from "../../constants/chains";

export default function NetworkCard() {
    const { chainId, library } = useActiveWeb3React();

    const node = useRef<HTMLDivElement>(null);
    const open = useModalOpen(ApplicationModal.ARBITRUM_OPTIONS);
    const toggle = useToggleModal(ApplicationModal.ARBITRUM_OPTIONS);
    useOnClickOutside(node, open ? toggle : undefined);

    const [implements3085, setImplements3085] = useState(false);
    useEffect(() => {
        // metamask is currently the only known implementer of this EIP
        // here we proceed w/ a noop feature check to ensure the user's version of metamask supports network switching
        // if not, we hide the UI
        if (!library?.provider?.request || !chainId || !library?.provider?.isMetaMask) {
            return;
        }
        switchToNetwork({ library, chainId })
            .then((x) => x ?? setImplements3085(true))
            .catch(() => setImplements3085(false));
    }, [library, chainId]);

    const info = chainId ? CHAIN_INFO[chainId] : undefined;
    if (!chainId || !info || !library || !library?.provider?.isMetaMask) {
        return null;
    }

    return <div title={info.label}>{info.label}</div>;
}
