
export async function fetchPoolsAPR() {

    const apiURL = 'https://api.algebra.finance/api/APR/pools/'

    try {
        return await fetch(apiURL).then(v => v.json())

    } catch (error: any) {
        return {}
    }

} 