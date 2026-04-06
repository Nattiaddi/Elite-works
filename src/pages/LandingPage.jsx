import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-gold-500/30">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-6 px-10 border-b border-gold-700/10 max-w-7xl mx-auto sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        {/* Logo - በግራ በኩል */}
        <div className="text-2xl font-black text-gold-500 italic tracking-tighter shrink-0">
          Elite Works
        </div>
        
        {/* የቀኝ በኩል ነገሮች በሙሉ */}
        <div className="flex items-center gap-8">
          
          {/* ማዕከላዊ ሊንኮች - ወደ ቀኝ ተጠግተዋል */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link to="/" className="text-slate-400 hover:text-gold-500 transition-all">{t('home')}</Link>
            <Link to="/about" className="text-slate-400 hover:text-gold-500 transition-all">{t('about_us')}</Link>
            <Link to="/contact" className="text-slate-400 hover:text-gold-500 transition-all">{t('contact_us')}</Link>
          </div>

          {/* የቋንቋ መቀየሪያ አይኮን */}
          <button 
            onClick={toggleLanguage}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-gold-500/50 transition-all group"
            title={i18n.language === 'en' ? 'ወደ አማርኛ ቀይር' : 'Switch to English'}
          >
            <span className="text-base group-hover:scale-110 block leading-none">🌐</span>
          </button>

          {/* Login & Signup */}
          <div className="flex items-center gap-6 border-l border-slate-800/50 pl-6">
            <Link to="/login" className="text-[11px] font-black text-slate-400 hover:text-gold-500 uppercase tracking-widest transition-colors">
              {t('login')}
            </Link>
            <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-full font-black text-[10px] uppercase hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20 active:scale-95">
              {t('signup')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-32 px-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-500/5 blur-[100px] rounded-full -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight italic">
          <span className="text-white">{t('welcome')} </span>
          <span className="bg-gradient-to-r from-gold-300 to-gold-700 bg-clip-text text-transparent">
             {t('welcome_suffix')}
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed">
          {t('hero_subtitle')}
        </p>
        <Link to="/signup" className="inline-block bg-gradient-to-b from-gold-400 to-gold-600 text-slate-950 px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-gold-500/20">
          {t('get_started')}
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <div className="group bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 hover:border-gold-500/30 transition-all">
          <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-6 text-gold-500 font-black">01</div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">
             {t('feature_1_title') || 'Quality'}
          </h3>
          <p className="text-slate-500 leading-relaxed">
             {t('feature_1_desc') || 'We always provide the best quality work for our clients.'}
          </p>
        </div>
        {/* እዚህ ጋር ሌሎች ፊቸሮችን መጨመር ትችላለህ */}
      </section>

      <footer className="py-12 text-center border-t border-slate-900 text-slate-600 font-bold text-[10px] uppercase tracking-[0.3em]">
        <p>© 2026 Elite Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;