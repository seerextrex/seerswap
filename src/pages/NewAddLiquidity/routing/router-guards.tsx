import Loader from "components/Loader";
import { Redirect, Route } from "react-router-dom";

export function RouterGuard({ Component, allowance, redirect, ...rest }: { Component: any; allowance: any; redirect: string; [x: string]: any }) {
    return allowance ? (
        <Route
            {...rest}
            render={function () {
                return <Component {...rest} />;
            }}
        />
    ) : (
        <div className="f f-ac f-jc">
            <Loader size={"36px"} stroke="white" />
        </div>
    );
}
