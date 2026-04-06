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
          "edit_profile": "Edit Profile",
          "home": "Home",
          "about_us": "About Us",
          "contact_us": "Contact Us",
          "balance": "Balance",
          "completed_jobs": "Completed Jobs",
          "login_subtitle": "Login to your account",
          "signup_subtitle": "Create your new account",
          "no_account": "Don't have an account?",
          "already_have_account": "Already have an account?",
          "back_to_home": "Back to Home",
          "send_message": "Send Message"
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
          "post_job": "ስራ ልጠፍ",
          "edit_profile": "ፕሮፋይል አስተካክል",
          "home": "መነሻ",
          "about_us": "ስለ እኛ",
          "contact_us": "ያግኙን",
          "balance": "ሒሳብ",
          "completed_jobs": "የተጠናቀቁ ስራዎች",
          "login_subtitle": "ወደ አካውንትዎ ይግቡ",
          "signup_subtitle": "አዲስ አካውንት ይፍጠሩ",
          "no_account": "አካውንት የለዎትም?",
          "already_have_account": "አካውንት አለዎት?",
          "back_to_home": "ወደ መነሻ ተመለስ",
          "send_message": "መልዕክት ላክ"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;