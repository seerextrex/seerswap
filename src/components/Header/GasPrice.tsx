import { useAppSelector } from "../../state/hooks";
import { GasPriceWrapper } from "./styled";

export function GasPrice() {
    const gasPrice = useAppSelector((state) => state.application.gasPrice.fetched);

    return <GasPriceWrapper>{`Gas price: ${Math.round(gasPrice)}`}</GasPriceWrapper>;
}
