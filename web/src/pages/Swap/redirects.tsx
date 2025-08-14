import { useEffect } from "react";

import { Redirect, RouteComponentProps } from "react-router-dom";
import { useAppDispatch } from "state/hooks";
import { ApplicationModal, setOpenModal } from "../../state/application/actions";

// Redirects to markets page (new landing page)
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
    return <Redirect to={{ ...location, pathname: "/info/markets" }} />;
}

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
