import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import { appStore } from "~stores/appStore";

const translationVersion = process.env.REACT_APP_TRANSLATIONS_VERSION;

const getLoadPath = () => {
  // todo: find a way to automatically generate a unique hash on each deployment
  const prefix = translationVersion ? `?version=${translationVersion}` : "";
  return `/locales/{{lng}}/{{ns}}.json${prefix}`;
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(HttpBackend)
  .init({
    lng: "uk",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: process.env.NODE_ENV === "development",
    backend: {
      loadPath: getLoadPath(),
    } as HttpBackendOptions,
  });

i18n.on("languageChanged", (lng) => {
  appStore.setLng(lng);
});
export default i18n;
