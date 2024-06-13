import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-react-native-language-detector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          /* English translations */
        },
      },
      zh: {
        translation: {
          /* Chinese translations */
        },
      },
      fr: {
        translation: {
          /* French translations */
        },
      },
      es: {
        translation: {
          /* Spanish translations */
        },
      },
      ar: {
        translation: {
          /* Arabic translations */
        },
      },
      ja: {
        translation: {
          /* Japanese translations */
        },
      },
      ru: {
        translation: {
          /* Russian translations */
        },
      },
      ko: {
        translation: {
          /* Korean translations */
        },
      },
      pt: {
        translation: {
          /* Portuguese translations */
        },
      },
      it: {
        translation: {
          /* Italian translations */
        },
      },
      de: {
        translation: {
          /* German translations */
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
