import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeft, ExternalLink } from "react-feather";
import { useUserLocaleManager } from "../../state/user/hooks";
import "./index.scss";

import { t } from "@lingui/macro";

const MenuState = {
    PRIMARY: t`More`,
    LANGUAGE: t`Language`,
};

const Languages = {
    RUSSIAN: t`🇷🇺  Русский`,
    ENGLISH: t`🇬🇧  English`,
    SPANISH: t`🇪🇸  Español`,
};

const Items = {
    LANGUAGE: t`Language`,
    ABOUT: t`About Us`,
    HELP_CENTER: t`Help Center`,
};

enum ItemType {
    LINK,
    SUB_MENU,
    ACTION,
}

export default function HeaderMenu() {
    const [menuState, setMenuState] = useState(MenuState.PRIMARY);
    const [userLocale, setUserLocale] = useUserLocaleManager();

    const headers = {
        [MenuState.PRIMARY]: t`More`,
        [MenuState.LANGUAGE]: t`Language`,
    };

    const items = {
        [MenuState.PRIMARY]: [
            { id: "Language", title: t`Language`, type: ItemType.SUB_MENU },
            { id: "About us", title: t`About us`, type: ItemType.LINK, link: "https://algebra.finance" },
            { id: "Help center", title: t`Help center`, type: ItemType.LINK, link: "https://help.algebra.finance" },
        ],
        [MenuState.LANGUAGE]: [
            { title: Languages.RUSSIAN, type: ItemType.ACTION, locale: "ru-RU" },
            { title: Languages.ENGLISH, type: ItemType.ACTION, locale: "en-US" },
            { title: Languages.SPANISH, type: ItemType.ACTION, locale: "es-ES" },
        ],
    };

    const historyStack: any = [MenuState.PRIMARY];

    const handleSelect = useCallback((item) => {
        if (item.id in headers) {
            historyStack.push(item.title);
            setMenuState(item.id);
        } else if (item.locale) {
            setUserLocale(item.locale);
        } else if (item.link) {
            window.location.href = item.link;
        }
    }, []);

    const handleBack = useCallback(() => {
        historyStack.pop();
        setMenuState(historyStack[historyStack.length - 1] || MenuState.PRIMARY);
    }, []);

    return (
        <div className="header-menu br-8">
            <div className="header-menu__title f f-ac ph-1 pv-1 mxs_pv-1 ms_pv-1">
                {menuState !== MenuState.PRIMARY && (
                    <span className={"header-menu__title-back mr-05"} onClick={handleBack}>
                        <ArrowLeft size={"15px"} />
                    </span>
                )}
                <span>{headers[menuState]}</span>
            </div>
            <ul className="header-menu__list">
                {items[menuState].map((item: any, i) => (
                    <li className="header-menu__list-item" key={i} onClick={() => handleSelect(item)}>
                        <a href={item.link || null} rel={"noreferrer noopener"} target={"_blank"} className="ph-1 pv-1 mxs_pv-1 ms_pv-1 w-100 f f-jb">
                            <span className="header-menu__list-item__title f">
                                <span>{item.title}</span>
                                {item.type === ItemType.LINK && <span className="ml-05">{<ExternalLink size={"18px"} />}</span>}
                            </span>
                            {item.type === ItemType.SUB_MENU && <span className="header-menu__list-item__arrrow">→</span>}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
