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
          "welcome": "Welcome to",
          "welcome_suffix": "Elite Works",
          "hero_subtitle": "We provide quality work with care and efficiency just for you.",
          "get_started": "Get Started Now",
          "login": "Login",
          "signup": "Sign Up",
          "logout": "Logout",
          "greeting": "Hello",
          "welcome_message": "Welcome to your elite dashboard.",
          "quick_actions": "Quick Actions",
          "find_job": "Find Jobs",
          "post_job": "Post a Job",
          "edit_profile": "Edit Profile"
        }
      },
      am: {
        translation: {
          "welcome": "እንኳን ወደ",
          "welcome_suffix": "ኢሊት ወርክስ በሰላም መጡ",
          "hero_subtitle": "ለእርስዎ ጥራት ያላቸውን ስራዎች በጥንቃቄ እና በቅልጥፍና እናቀርባለን።",
          "get_started": "አሁኑኑ ይጀምሩ",
          "login": "ይግቡ",
          "signup": "ይመዝገቡ",
          "logout": "ውጣ",
          "greeting": "ሰላም",
          "welcome_message": "ወደ የእርስዎ ኢሊት ዳሽቦርድ እንኳን መጡ።",
          "quick_actions": "ፈጣን ተግባራት",
          "find_job": "ስራ ፈልግ",
          "post_job": "ስራ ለጠፍ",
          "edit_profile": "ፕሮፋይል አስተካክል"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;