import React from 'react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

const LocaleProvider = ({ children }) => {
    return (
        <I18nProvider i18n={i18n}>
            {children}
        </I18nProvider>
    );
};

export default LocaleProvider;
