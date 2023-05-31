import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  resources: {
    en: {
      translations: require("./locales/en/translations.json")
    },
    es: {
      translations: require("./locales/es/translations.json")
    },
    fr: {
      translations: require("./locales/fr/translations.json")
    },
    vi: {
      translations: require("./locales/vi/translations.json")
    },
    it: {
      translations: require("./locales/it/translations.json")
    }
  },
  ns: ["translations"],
  defaultNS: "translations"
});

i18n.languages = ["en", "es", "fr", "vi", "it"];

export default i18n;
export const languages = i18n.languages
