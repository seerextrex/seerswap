import { useEffect } from "react";

import { Redirect, RouteComponentProps } from "react-router-dom";
import { useAppDispatch } from "state/hooks";
import { ApplicationModal, setOpenModal } from "../../state/application/actions";

// Redirects to markets page (new landing page)
export function RedirectToMarkets({ location }: RouteComponentProps) {
    return <Redirect to={{ ...location, pathname: "/info/markets" }} />;
}

// Keep old name for backward compatibility during migration
export const RedirectPathToSwapOnly = RedirectToMarkets;

// Redirects to markets page (new landing page)
export function RedirectToSwap(props: RouteComponentProps<{ outputCurrency: string }>) {
    return (
        <Redirect
            to={{
                ...props.location,
                pathname: "/info/markets",
            }}
        />
    );
}

export function OpenClaimAddressModalAndRedirectToSwap(props: RouteComponentProps) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setOpenModal(ApplicationModal.ADDRESS_CLAIM));
    }, [dispatch]);
    return <RedirectPathToSwapOnly {...props} />;
}
