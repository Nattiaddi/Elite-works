import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-950 text-gold-500 flex items-center justify-center font-bold italic text-xl">
      {t('loading')}...
    </div>
  );

  // የአሁኑን ቋንቋ ለማወቅ (en-US ከሆነ 'en' ብቻ እንዲወስድ)
  const currentLanguage = i18n.language?.split('-')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 selection:bg-gold-500/30">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center mb-10 border-b border-gold-500/10 pb-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gold-500 underline decoration-gold-500/30 underline-offset-8 italic">
          Elite Dashboard
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Language Switcher - እዚህ ጋር መሆኑ ይበቃል */}
          <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-xl shadow-inner">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${currentLanguage === 'en' ? 'bg-gold-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-gold-200'}`}
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('am')} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${currentLanguage === 'am' ? 'bg-gold-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-gold-200'}`}
            >
              አማ
            </button>
          </div>

          <button 
            onClick={handleLogout} 
            className="text-sm border border-gold-600/50 text-gold-400 px-4 py-2 rounded-lg hover:bg-gold-600 hover:text-slate-950 transition-all font-semibold active:scale-95"
          >
            {t('logout')}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Welcome Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold-500/10 transition-all"></div>
            
            <h2 className="text-3xl font-bold mb-2 text-white">
              {t('greeting')}, <span className="text-gold-400">{user.user_metadata?.full_name || 'ተጠቃሚ'}</span>! ✨
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">{t('welcome_message')}</p>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:border-gold-500/30 transition-colors">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('balance')}</p>
                <p className="text-3xl font-extrabold text-gold-500 mt-2">0.00 <span className="text-sm font-normal">ETB</span></p>
              </div>
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:border-gold-500/30 transition-colors">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('completed_jobs')}</p>
                <p className="text-3xl font-extrabold text-gold-400 mt-2">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-3xl h-fit shadow-2xl">
          <h3 className="text-xl font-bold mb-8 text-gold-400 border-b border-gold-500/10 pb-4">{t('quick_actions')}</h3>
          <div className="space-y-4">
            <Link 
              to="/find-jobs" 
              className="w-full block text-center bg-gold-600 text-slate-950 font-bold py-4 rounded-xl hover:bg-gold-400 hover:-translate-y-1 transition-all shadow-lg shadow-gold-600/10"
            >
              {t('find_job')}
            </Link>
            
            <Link 
              to="/post-job" 
              className="w-full block text-center border-2 border-gold-600 text-gold-500 font-bold py-4 rounded-xl hover:bg-gold-600 hover:text-slate-950 hover:-translate-y-1 transition-all"
            >
              {t('post_job')}
            </Link>
            
            <div className="py-4 flex items-center">
              <div className="flex-1 border-t border-slate-800"></div>
              <span className="px-3 text-slate-600 text-xs uppercase tracking-widest font-bold">Settings</span>
              <div className="flex-1 border-t border-slate-800"></div>
            </div>

            <Link 
              to="/profile" 
              className="w-full block text-center border border-slate-700 text-slate-300 py-4 rounded-xl hover:border-gold-500/50 hover:text-gold-200 transition-all font-medium"
            >
              {t('edit_profile')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;