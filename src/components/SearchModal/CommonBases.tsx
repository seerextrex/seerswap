import { Token, Currency } from "@uniswap/sdk-core";
import { Trans } from "@lingui/macro";
import { Text } from "rebass";
import styled from "styled-components/macro";
import { useAccount } from "wagmi";

import { COMMON_BASES } from "../../constants/routing";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { AutoRow } from "../Row";
import CurrencyLogo from "../CurrencyLogo";
import { WrappedCurrency } from "../../models/types";

const BaseWrapper = styled.div<{
    disable?: boolean;
}>`
    border: 1px solid ${({ theme }) => theme.bg3};
    border-radius: 10px;
    display: flex;
    padding: 6px;

    align-items: center;
    :hover {
        cursor: ${({ disable }) => !disable && "pointer"};
        background-color: ${({ theme, disable }) => !disable && theme.bg2};
    }

    background-color: ${({ theme, disable }) => disable && theme.bg3};
    opacity: ${({ disable }) => disable && "0.4"};
`;

export default function CommonBases({ currencyId, onSelect, selectedCurrency }: { currencyId?: string; selectedCurrency?: Token | null; onSelect: (currency: Token) => void }) {
    const { chain } = useAccount();
    const chainId = chain?.id;

    return (
        <AutoColumn gap="md">
            <AutoRow>
                <Text fontWeight={500} fontSize={14}>
                    <Trans>Common bases</Trans>
                </Text>
                <QuestionHelper text={<Trans>These tokens are commonly paired with other tokens.</Trans>} />
            </AutoRow>
            <AutoRow gap="4px">
                {(chainId ? COMMON_BASES[chainId] : []).map((currency: Currency) => {
                    if (currency.isToken) {
                        const token = currency as Token;
                        const selected = selectedCurrency?.equals(token);
                        return (
                            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={currencyId + token.address}>
                                <CurrencyLogo currency={token as WrappedCurrency} style={{ marginRight: 8 }} />
                                <Text fontWeight={500} fontSize={16}>
                                    {token.symbol}
                                </Text>
                            </BaseWrapper>
                        );
                    }
                    return null;
                })}
            </AutoRow>
        </AutoColumn>
    );
}
