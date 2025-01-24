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
    return {};
    // const apiURL = AlgebraConfig.API.eternalFarmsAPR;

    // try {
    //     return await fetch(apiURL).then((v) => v.json());
    // } catch (error: any) {
    //     return {};
    // }
}

export async function fetchLimitFarmAPR() {
    return {};
    // const apiURL = AlgebraConfig.API.limitFarmsAPR;

    // try {
    //     return await fetch(apiURL).then((v) => v.json());
    // } catch (error: any) {
    //     return {};
    // }
}

export async function fetchLimitFarmTVL() {
    return {};
    // const apiURL = AlgebraConfig.API.limitFarmsTVL;

    // try {
    //     return await fetch(apiURL).then((v) => v.json());
    // } catch (error: any) {
    //     return {};
    // }
}

export async function fetchEternalFarmTVL() {
    return {};
    // const apiURL = AlgebraConfig.API.eternalFarmsTVL;

    // try {
    //     return await fetch(apiURL).then((v) => v.json());
    // } catch (error: any) {
    //     return {};
    // }
}

export async function fetchPoolsAPR() {
    return {};
    // const apiURL = AlgebraConfig.API.poolsAPR;

    // try {
    //     return await fetch(apiURL).then((v) => v.json());
    // } catch (error: any) {
    //     return {};
    // }
}
