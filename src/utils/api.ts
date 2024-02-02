import AlgebraConfig from "algebra.config";

export async function fetchMerklFarmAPR() {
    const apiURL = "https://api.angle.money/v2/merkl?AMMs[]=swapr&chainIds[]=100";

    try {
        return await fetch(apiURL).then((v) => v.json());
    } catch (error: any) {
        return {};
    }
}

export async function fetchEternalFarmAPR() {
    const apiURL = AlgebraConfig.API.eternalFarmsAPR;

    try {
        return await fetch(apiURL).then((v) => v.json());
    } catch (error: any) {
        return {};
    }
}

export async function fetchLimitFarmAPR() {
    const apiURL = AlgebraConfig.API.limitFarmsAPR;

    try {
        return await fetch(apiURL).then((v) => v.json());
    } catch (error: any) {
        return {};
    }
}

export async function fetchLimitFarmTVL() {
    const apiURL = AlgebraConfig.API.limitFarmsTVL;

    try {
        return await fetch(apiURL).then((v) => v.json());
    } catch (error: any) {
        return {};
    }
}

export async function fetchEternalFarmTVL() {
    const apiURL = AlgebraConfig.API.eternalFarmsTVL;

    try {
        return await fetch(apiURL).then((v) => v.json());
    } catch (error: any) {
        return {};
    }
}

export async function fetchPoolsAPR() {
    const apiURL = AlgebraConfig.API.poolsAPR;

    try {
        return await fetch(apiURL).then((v) => v.json());
    } catch (error: any) {
        return {};
    }
}
