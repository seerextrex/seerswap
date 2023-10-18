import { useWeb3React } from "@web3-react/core";
import { NewAddLiquidityPage } from "pages/NewAddLiquidity";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { WXDAI_EXTENDED } from "../../constants/tokens";

import AlgebraConfig from "algebra.config";

export function RedirectDuplicateTokenIdsNew(props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; step: string }>) {
    const {
        match: {
            params: { currencyIdA, currencyIdB, step },
        },
    } = props;

    const { chainId } = useWeb3React();

    // prevent weth + eth
    let symbol;

    if (chainId === AlgebraConfig.CHAIN_PARAMS.chainId) {
        symbol = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
    }

    const isETHOrWETHA = currencyIdA === symbol || (chainId !== undefined && currencyIdA === WXDAI_EXTENDED[chainId]?.address);
    const isETHOrWETHB = currencyIdB === symbol || (chainId !== undefined && currencyIdB === WXDAI_EXTENDED[chainId]?.address);

    if (currencyIdA && currencyIdB && (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))) {
        return <Redirect to={`/add/${currencyIdA}`} />;
    }
    return <NewAddLiquidityPage {...props} />;
}
