import { useActiveWeb3React } from "hooks/web3";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { WMATIC_EXTENDED } from "../../constants/tokens";
import AddLiquidityPage from "../AddLiquidityPage";

export function RedirectDuplicateTokenIds(props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; feeAmount?: string }>) {
    const {
        match: {
            params: { currencyIdA, currencyIdB },
        },
    } = props;

    const { chainId } = useActiveWeb3React();

    // prevent weth + eth
    let symbol;

    if (chainId === 137) {
        symbol = "MATIC";
    }

    const isETHOrWETHA = currencyIdA === symbol || (chainId !== undefined && currencyIdA === WMATIC_EXTENDED[chainId]?.address);
    const isETHOrWETHB = currencyIdB === symbol || (chainId !== undefined && currencyIdB === WMATIC_EXTENDED[chainId]?.address);

    if (currencyIdA && currencyIdB && (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))) {
        return <Redirect to={`/add/${currencyIdA}`} />;
    }
    return <AddLiquidityPage {...props} />;
}
