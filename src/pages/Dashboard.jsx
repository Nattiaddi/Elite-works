import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 👈 አዲስ ተጨምሯል

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // 👈 ትርጉሙን ለመጠቀም

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login'); 
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate]);

  // ቋንቋ ለመቀየር የሚያገለግል ፋንክሽን
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-950 text-gold-500 flex items-center justify-center font-bold">
      {t('loading')}...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center mb-10 border-b border-gold-500/10 pb-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gold-500 underline decoration-gold-500/30 underline-offset-8">
          Elite Dashboard
        </h1>
        
        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-lg">
            <button 
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'en' ? 'bg-gold-500 text-slate-950' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('am')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'am' ? 'bg-gold-500 text-slate-950' : 'text-slate-400'}`}
            >
              አማ
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="text-sm border border-gold-600/50 text-gold-400 px-4 py-2 rounded-lg hover:bg-gold-600 hover:text-slate-950 transition-all font-semibold"
          >
            {t('logout')}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="md:col-span-2 bg-slate-900 border border-gold-500/20 p-8 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-2 text-white">
            {t('greeting')}, <span className="text-gold-400">{user.user_metadata?.full_name || 'ተጠቃሚ'}</span>! ✨
          </h2>
          <p className="text-slate-400">{t('welcome_message')}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <p className="text-slate-500 text-sm font-medium">{t('balance')}</p>
              <p className="text-2xl font-bold text-gold-500 mt-1">0.00 ETB</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <p className="text-slate-500 text-sm font-medium">{t('completed_jobs')}</p>
              <p className="text-2xl font-bold text-gold-400 mt-1">0</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-3xl h-fit">
          <h3 className="text-xl font-bold mb-6 text-gold-400