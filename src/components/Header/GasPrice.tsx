import { Trans } from "@lingui/macro";
import { useAppSelector } from "../../state/hooks";
import { GasPriceWrapper } from "./styled";

export function GasPrice() {
    const gasPrice = useAppSelector((state) => state.application.gasPrice.fetched);

    return (
        <GasPriceWrapper>
            <Trans>{`Gas price: ${gasPrice && Math.round(gasPrice)}`}</Trans>
        </GasPriceWrapper>
    );
}
