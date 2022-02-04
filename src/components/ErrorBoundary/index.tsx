import { Trans } from '@lingui/macro'
import React, { ErrorInfo } from 'react'
import store, { AppState } from '../../state'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { getUserAgent } from '../../utils/getUserAgent'
import ReactGA from 'react-ga'
import { BodyWrapper, CodeBlockWrapper, FallbackWrapper, SomethingWentWrongWrapper } from './styled'

type ErrorBoundaryState = {
    error: Error | null
}

export default class ErrorBoundary extends React.Component<unknown, ErrorBoundaryState> {
    constructor(props: unknown) {
        super(props)
        this.state = { error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log(error)
        ReactGA.exception({
            ...error,
            ...errorInfo,
            fatal: true
        })
    }

    render() {
        const { error } = this.state
        if (error !== null) {
            const encodedBody = encodeURIComponent(issueBody(error))
            return (
                <FallbackWrapper>
                    <BodyWrapper>
                        <AutoColumn gap={'md'}>
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
            )
        }
        return this.props.children
    }
}

function getRelevantState(): null | keyof AppState {
    const path = window.location.hash
    if (!path.startsWith('#/')) {
        return null
    }
    const pieces = path.substring(2).split(/[\/\\?]/)
    switch (pieces[0]) {
        case 'swap':
            return 'swap'
        case 'add':
            if (pieces[1] === 'v2') return 'mint'
            else return 'mintV3'
        case 'remove':
            if (pieces[1] === 'v2') return 'burn'
            else return 'burnV3'
    }
    return null
}

function issueBody(error: Error): string {
    const relevantState = getRelevantState()
    const deviceData = getUserAgent()
    return `## URL

${window.location.href}

${
        relevantState
            ? `## \`${relevantState}\` state

\`\`\`json
${JSON.stringify(store.getState()[relevantState], null, 2)}
\`\`\`
`
            : ''
    }
${
        error.name &&
        `## Error

\`\`\`
${error.name}${error.message && `: ${error.message}`}
\`\`\`
`
    }
${
        error.stack &&
        `## Stacktrace

\`\`\`
${error.stack}
\`\`\`
`
    }
${
        deviceData &&
        `## Device data

\`\`\`json
${JSON.stringify(deviceData, null, 2)}
\`\`\`
`
    }
`
}
