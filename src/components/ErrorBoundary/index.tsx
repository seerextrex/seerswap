import { Trans } from "@lingui/macro";
import React, { ErrorInfo } from "react";
import { TYPE } from "../../theme";
import { AutoColumn } from "../Column";
import ReactGA from "react-ga";
import { BodyWrapper, CodeBlockWrapper, FallbackWrapper, SomethingWentWrongWrapper } from "./styled";

type ErrorBoundaryState = {
    error: Error | null;
};

export default class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
    constructor(props: unknown) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log(error);
        ReactGA.exception({
            ...error,
            ...errorInfo,
            fatal: true,
        });
    }

    render() {
        const { error } = this.state;
        if (error !== null) {
            return (
                <FallbackWrapper>
                    <BodyWrapper>
                        <AutoColumn gap={"md"}>
                            <SomethingWentWrongWrapper>
                                <TYPE.label fontSize={24} fontWeight={600}>
                                    <Trans>Something went wrong</Trans>
                                </TYPE.label>
                            </SomethingWentWrongWrapper>
                            <CodeBlockWrapper>
                                <code>
                                    <TYPE.main fontSize={10}>{error.stack}</TYPE.main>
                                </code>
                            </CodeBlockWrapper>
                        </AutoColumn>
                    </BodyWrapper>
                </FallbackWrapper>
            );
        }
        return this.props.children;
    }
}
