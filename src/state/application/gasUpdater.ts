import { useEffect } from "react";
import { useGasPrice } from "../../hooks/useGasPrice";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateGasPrice } from "./actions";

import AlgebraConfig from "algebra.config";

export default function GasUpdater(): null {
    const dispatch = useAppDispatch();

    const { chainId } = useWeb3React();

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
