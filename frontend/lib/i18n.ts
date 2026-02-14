"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "../locales/en/common.json";
import commonIt from "../locales/it/common.json";

// Initialize i18next instance
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: commonEn.common }, // accessing the nested 'common' key
      it: { common: commonIt.common },
    },
    lng: "en", // default language
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // avoid suspense for now specific to simple client loading
    }
  });

export default i18n;
