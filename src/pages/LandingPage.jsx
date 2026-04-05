import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 👈 ይህንን ጨምሬያለሁ

const LandingPage = () => {
  const { t, i18n } = useTranslation(); // 👈 ትርጉሙን ለመጠቀም

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-gold-500/30">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-6 px-10 border-b border-gold-700/10 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-gold-500 tracking-tighter">
          Elite Works
        </div>
        
        <div className="flex items-center gap-8">
          {/* ቋንቋ መቀየሪያ - ከ "ይግቡ" በፊት በሥርዓት ተቀምጧል */}
          <div className="flex items-center gap-3 border-r border-slate-800 pr-6">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`text-[11px] font-black transition-colors ${i18n.language?.startsWith('en') ? 'text-gold-500' : 'text-slate-500 hover:text-gold-200'}`}
            >
              EN
            </button>
            <span className="text-slate-800 text-xs">|</span>
            <button 
              onClick={() => changeLanguage('am')} 
              className={`text-[11px] font-black transition-colors ${i18n.language?.startsWith('am') ? 'text-gold-500' : 'text-slate-500 hover:text-gold-200'}`}
            >
              አማ
            </button>
          </div>

          <div className="space-x-8 flex items-center">
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-gold-500 transition-colors">
              {t('login') || 'ይግቡ'}
            </Link>
            <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-full font-black text-sm hover:bg-gold-400 hover:scale-105 transition-all shadow-lg shadow-gold-500/10">
              {t('signup') || 'ይመዝገቡ'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-32 px-6 text-center overflow-hidden">
        {/* የጀርባ ብርሃን (Glow effect) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full"></div>

        <h1 className="relative text-5xl md:text-7xl font-black mb-8 leading-tight italic">
          <span className="block text-white">{t('welcome') || 'እንኳን ወደ'}</span>
          <span className="bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent italic">
            Elite Works
          </span>
          <span className="text-white block not-italic mt-2">{t('welcome_suffix') || 'በሰላም መጡ'}</span>
        </h1>
        
        <p className="relative text-slate-400 max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed">
          {t('hero_subtitle') || 'ለእርስዎ ጥራት ያላቸውን ስራዎች በጥንቃቄ እና በቅልጥፍና እናቀርባለን።'}
        </p>
        
        <Link to="/signup" className="relative inline-block bg-gradient-to-b from-gold-400 to-gold-600 text-slate-950 px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-gold-500/20 active:scale-95">
          {t('get_started') || 'አሁኑኑ ይጀምሩ'}
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="group bg-slate-900/50 p-10 rounded-[2rem] border border-slate-800 hover:border-gold-500/30 transition-all duration-500">
            <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
               <span className="text-gold-500 font-bold">01</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">
               {t('feature_1_title') || 'ጥራት'}
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
               {t('feature_1_desc') || 'ሁልጊዜም ለደንበኞቻችን ምርጥ ጥራት ያለው ስራ እናቀርባለን።'}
            </p>
          </div>
      </section>

      <footer className="py-12 text-center border-t border-slate-900 text-slate-600 font-medium text-sm">
        <p>© 2026 Elite Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;