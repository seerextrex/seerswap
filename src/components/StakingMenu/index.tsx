import { AlignJustify, Calendar, Zap } from "react-feather";
import { NavLink } from "react-router-dom";
import { FarmingInfoLabel } from "../Header/styled";
import { useAppSelector } from "../../state/hooks";
import { InfinityIcon, MenuList, MenuListItem, MenuListItemIcon, MenuListItemTitle } from "./styled";
import { t } from "@lingui/macro";

const stakingMenuList = [
    {
        title: t`My Farms`,
        icon: <AlignJustify size={18} />,
        link: "farms",
    },
    {
        title: t`Infinite Farms`,
        icon: <InfinityIcon size={18} />,
        link: "infinite-farms",
    },
    {
        title: t`Limit Farms`,
        icon: <Zap size={18} />,
        link: "limit-farms",
    },
    {
        title: t`Farms History`,
        icon: <Calendar size={18} />,
        link: "farms-history",
    },
];

export function StakingMenu() {
    const { startTime, eternalFarmings } = useAppSelector((state) => state.farming);
    return (
        <MenuList>
            {stakingMenuList.map((el, i) => (
                <MenuListItem
                    as={NavLink}
                    to={`/farming/${el.link}`}
                    activeStyle={{
                        borderBottom: "3px solid #ffbf00",
                        color: "#ffd967",
                        fontWeight: 600,
                    }}
                    key={i}
                >
                    <MenuListItemIcon>{el.icon}</MenuListItemIcon>
                    <MenuListItemTitle>
                        <span>{el.title}</span>
                        {el.link === "limit-farms" && <FarmingInfoLabel isEvents={!!startTime} isHeader={false} />}
                        {el.link === "infinite-farms" && <FarmingInfoLabel isEvents={eternalFarmings} isHeader={false} />}
                    </MenuListItemTitle>
                </MenuListItem>
            ))}
        </MenuList>
    );
}
