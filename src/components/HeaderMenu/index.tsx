import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "react-feather";
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

export default function HeaderMenu() {
    const [menuState, setMenuState] = useState(MenuState.PRIMARY);

    const headers = {
        [MenuState.PRIMARY]: "More",
        [MenuState.LANGUAGE]: "Language",
    };

    const historyStack: MenuState[] = [MenuState.PRIMARY];

    const selectedMenu = useMemo(() => {
        switch (menuState) {
            case MenuState.PRIMARY:
                return Items;
            case MenuState.LANGUAGE:
                return Languages;
        }
    }, [menuState]);

    const handleSelect = useCallback((item) => {
        historyStack.push(item);
        if (item in headers) {
            setMenuState(item);
        } else {
        }
    }, []);

    const handleBack = useCallback(() => {
        const lastItem = historyStack.pop();
        setMenuState(historyStack[historyStack.length - 1] || MenuState.PRIMARY);
    }, []);

    return (
        <div className="header-menu br-8">
            <div className="header-menu__title f f-ac ph-1 pv-05">
                {menuState !== MenuState.PRIMARY && (
                    <span className={"header-menu__title-back mr-05"} onClick={handleBack}>
                        <ArrowLeft size={"16px"} />
                    </span>
                )}
                <span>{headers[menuState]}</span>
            </div>
            <ul className="header-menu__list">
                {Object.values(selectedMenu).map((item, i) => (
                    <li className="header-menu__list-item f f-jb ph-1 pv-05" key={i} onClick={() => handleSelect(item)}>
                        <span className="header-menu__list-item__title">{item}</span>
                        <span className="header-menu__list-item__arrrow">→</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
