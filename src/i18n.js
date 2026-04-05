import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to Elite Works",
          "find_job": "Find Jobs",
          "post_job": "Post a Job",
          "profile": "Edit Profile",
          "logout": "Logout"
        }
      },
      am: {
        translation: {
          "welcome": "ወደ ኢሊት ወርክስ እንኳን በደህና መጡ",
          "find_job": "ሥራ ፈልግ",
          "post_job": "ሥራ ልጠፍ",
          "profile": "ፕሮፋይል አስተካክል",
          "logout": "ውጣ"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;