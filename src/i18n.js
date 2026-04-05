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
          "loading": "Loading",
          "greeting": "Hello",
          "welcome_message": "Welcome to Elite Works dashboard. What would you like to do today?",
          "balance": "Your Balance",
          "completed_jobs": "Completed Jobs",
          "quick_actions": "Quick Actions",
          "find_job": "Find Jobs",
          "post_job": "Post a Job",
          "edit_profile": "Edit Profile",
          "logout": "Logout"
        }
      },
      am: {
        translation: {
          "loading": "በመጫን ላይ",
          "greeting": "ሰላም",
          "welcome_message": "ወደ Elite Works ዳሽቦርድ እንኳን በደህና መጡ። ዛሬ ምን መስራት ይፈልጋሉ?",
          "balance": "ያለዎት ብር",
          "completed_jobs": "ያለቁ ስራዎች",
          "quick_actions": "ፈጣን ምርጫዎች",
          "find_job": "ሥራ ፈልግ",
          "post_job": "ሥራ ልጠፍ",
          "edit_profile": "ፕሮፋይል አስተካክል",
          "logout": "ውጣ"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;