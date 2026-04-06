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
  <div className="text-2xl font-bold text-gold-500 tracking-tighter">Elite Works</div>
  
  {/* ማዕከላዊ ሊንኮች (Links) */}
  <div className="hidden md:flex items-center gap-8 text-sm font-medium">
    <Link to="/" className="text-slate-300 hover:text-gold-500 transition-colors">{t('home')}</Link>
    <Link to="/about" className="text-slate-300 hover:text-gold-500 transition-colors">{t('about_us')}</Link>
    <Link to="/contact" className="text-slate-300 hover:text-gold-500 transition-colors">{t('contact_us')}</Link>
  </div>
  
  <div className="flex items-center gap-6">
    {/* ቋንቋ መቀየሪያ */}
    <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
      <button onClick={() => changeLanguage('en')} className={`text-[10px] font-bold ${i18n.language.startsWith('en') ? 'text-gold-500' : 'text-slate-500'}`}>EN</button>
      <span className="text-slate-800 text-[10px]">|</span>
      <button onClick={() => changeLanguage('am')} className={`text-[10px] font-bold ${i18n.language.startsWith('am') ? 'text-gold-500' : 'text-slate-500'}`}>አማ</button>
    </div>
    <Link to="/login" className="text-sm font-bold text-slate-300">{t('login')}</Link>
    <Link to="/signup" className="bg-gold-500 text-slate-950 px-5 py-2 rounded-full font-bold text-xs">{t('signup')}</Link>
  </div>
</nav>
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