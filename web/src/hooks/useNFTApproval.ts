import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { useAccount, usePublicClient } from "wagmi";
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "../constants/addresses";
import NON_FUN_POS_MAN from "../abis/non-fun-pos-man.json";
import { publicClientToProvider } from "../utils/ethersAdapters";

export function useNFTApproval(tokenId: string | undefined) {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const publicClient = usePublicClient({ chainId });
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;
        
        async function checkApproval() {
            if (!tokenId || !chainId || !publicClient) {
                setIsApproved(false);
                return;
            }

            setLoading(true);
            try {
                const provider = publicClientToProvider(publicClient);
                const nftContract = new Contract(
                    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                    NON_FUN_POS_MAN,
                    provider
                );
                
                const approvedAddress = await nftContract.getApproved(tokenId);
                if (!cancelled) {
                    setIsApproved(approvedAddress.toLowerCase() === FARMING_CENTER[chainId].toLowerCase());
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error checking NFT approval:", error);
                    setIsApproved(false);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        checkApproval();
        
        return () => {
            cancelled = true;
        };
    }, [tokenId, chainId, publicClient]);

    return { isApproved, loading };
}