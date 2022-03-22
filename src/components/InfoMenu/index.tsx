import { Trans } from "@lingui/macro";
import { Grid, StopCircle } from "react-feather";
import { NavLink } from "react-router-dom";
import { MenuList, MenuListItem, MenuListItemIcon, MenuListItemTitle } from "./styled";

const infoMenuList = [
    {
        title: <Trans>Pools</Trans>,
        icon: <Grid size={18} />,
        link: "pools",
    },
    {
        title: <Trans>Tokens</Trans>,
        icon: <StopCircle size={18} />,
        link: "tokens",
    },
];

export function InfoMenu() {
    return (
        <MenuList>
            {infoMenuList.map((el, i) => (
                <MenuListItem
                    as={NavLink}
                    to={`/info/${el.link}`}
                    activeStyle={{
                        borderBottom: "3px solid #ffbf00",
                        color: "#ffd967",
                        fontWeight: 600,
                    }}
                    key={i}
                >
                    <MenuListItemIcon>{el.icon}</MenuListItemIcon>
                    <MenuListItemTitle>{el.title}</MenuListItemTitle>
                </MenuListItem>
            ))}
        </MenuList>
    );
}
