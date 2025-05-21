import { useAccount } from "wagmi";
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

    const { chain } = useAccount();

    // prevent weth + eth
    let symbol;

    if (chain?.id === AlgebraConfig.CHAIN_PARAMS.chainId) {
        symbol = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
    }

    const isETHOrWETHA = currencyIdA === symbol || (chain?.id !== undefined && currencyIdA === WXDAI_EXTENDED[chain.id]?.address);
    const isETHOrWETHB = currencyIdB === symbol || (chain?.id !== undefined && currencyIdB === WXDAI_EXTENDED[chain.id]?.address);

    if (currencyIdA && currencyIdB && (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))) {
        return <Redirect to={`/add/${currencyIdA}`} />;
    }
    return <NewAddLiquidityPage {...props} />;
}
