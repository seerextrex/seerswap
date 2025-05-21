import { useEffect } from "react";
import { useGasPrice } from "../../hooks/useGasPrice";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateGasPrice } from "./actions";

import AlgebraConfig from "algebra.config";

export default function GasUpdater(): null {
    const dispatch = useAppDispatch();

    const { chain } = useAccount();
    const chainId = chain?.id;

    const block = useAppSelector((state) => {
        return state.application.blockNumber[chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId];
    });

    const { fetchGasPrice, gasPrice, gasPriceLoading } = useGasPrice();

    useEffect(() => {
        fetchGasPrice();
    }, [dispatch, block]);

    useEffect(() => {
        if (!gasPrice.fetched) return;
        dispatch(updateGasPrice(gasPrice));
    }, [gasPrice, gasPriceLoading]);

    return null;
}
