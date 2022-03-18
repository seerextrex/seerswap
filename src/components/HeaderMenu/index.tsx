import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeft, ExternalLink } from "react-feather";
import "./index.scss";

enum MenuState {
    PRIMARY = "More",
    LANGUAGE = "Language",
}

enum Languages {
    RUSSIAN = "🇷🇺⠀ Russian",
    ENGLISH = "🇬🇧⠀ English",
    SPANISH = "🇪🇸⠀ Spanish",
}

enum Items {
    LANGUAGE = "Language",
    ABOUT = "About Us",
    HELP_CENTER = "Help Center",
}

enum ItemType {
    LINK,
    SUB_MENU,
    ACTION,
}

export default function HeaderMenu() {
    const [menuState, setMenuState] = useState(MenuState.PRIMARY);

    const headers = {
        [MenuState.PRIMARY]: "More",
        [MenuState.LANGUAGE]: "Language",
    };

    const items = {
        [MenuState.PRIMARY]: [
            { title: "Language", type: ItemType.SUB_MENU },
            { title: "About us", type: ItemType.LINK, link: "https://algebra.finance" },
            { title: "Help center", type: ItemType.LINK, link: "https://help.algebra.finance" },
        ],
        [MenuState.LANGUAGE]: [
            { title: Languages.RUSSIAN, type: ItemType.ACTION },
            { title: Languages.ENGLISH, type: ItemType.ACTION },
            { title: Languages.SPANISH, type: ItemType.ACTION },
        ],
    };

    const historyStack: MenuState[] = [MenuState.PRIMARY];

    const handleSelect = useCallback((item) => {
        if (item in headers) {
            historyStack.push(item);
            setMenuState(item);
        } else {
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
                    <li className="header-menu__list-item" key={i} onClick={() => handleSelect(item.title)}>
                        <a href={item.link || null} rel={"noreferrer noopener"} target={"_blank"} className="ph-1 pv-1 mxs_pv-1 ms_pv-1 w-100 f f-jb">
                            <span className="header-menu__list-item__title f">
                                <span>{item.title}</span>
                                {/* {item.type === ItemType.LINK && <span className="ml-05">{<ExternalLink size={"18px"} />}</span>} */}
                            </span>
                            {item.type === ItemType.SUB_MENU && <span className="header-menu__list-item__arrrow">→</span>}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
