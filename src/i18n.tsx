import { ReactNode, useEffect, useState } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useActiveLocale, useSetLocaleFromUrl } from "hooks/useActiveLocale";
import { SupportedLocale } from "constants/locales";
import { en, PluralCategory } from "make-plural/plurals";
import { messages as enMessages } from "locales/en-US.js";

type LocalePlural = {
    [key in SupportedLocale]: (n: number | string, ord?: boolean) => PluralCategory;
};

const plurals: LocalePlural = {
    "en-US": en,
};

const localesMessages: any = {
    "en-US": enMessages,
};

async function dynamicActivate(locale: SupportedLocale) {
    i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });
    i18n.load(locale, localesMessages[locale]);
    i18n.activate(locale);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    useSetLocaleFromUrl();
    const locale = useActiveLocale();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        dynamicActivate(locale)
            .then(() => {
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Failed to activate locale", locale, error);
            });
    }, [locale]);

    // prevent the app from rendering with placeholder text before the locale is loaded
    if (!loaded) return null;

    return (
        <I18nProvider forceRenderOnLocaleChange={false} i18n={i18n}>
            {children}
        </I18nProvider>
    );
}
