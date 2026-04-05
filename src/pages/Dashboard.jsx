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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate('/login');
      } else {
        setUser(authUser);
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

  const currentLanguage = i18n.language?.split('-')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 selection:bg-gold-500/30">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center mb-10 border-b border-gold-500/10 pb-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gold-500 underline decoration-gold-500/30 underline-offset-8 italic">
          Elite Dashboard
        </h1>
        
        <button 
          onClick={handleLogout} 
          className="text-sm border border-gold-600/50 text-gold-400 px-4 py-2 rounded-lg hover:bg-gold-600 hover:text-slate-950 transition-all font-semibold active:scale-95"
        >
          {t('logout')}
        </button>
      </nav>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {t('greeting')}, <span className="text-gold-400">{user.user_metadata?.full_name || 'ተጠቃሚ'}</span>! ✨
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">{t('welcome_message')}</p>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('balance')}</p>
                <p className="text-3xl font-extrabold text-gold-500 mt-2">0.00 ETB</p>
              </div>
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('completed_jobs')}</p>
                <p className="text-3xl font-extrabold text-gold-400 mt-2">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gold-400 border-b border-gold-500/10 pb-4">{t('quick_actions')}</h3>
            
            {/* Language Switcher - እዚህ ጋር በሥርዓት ተቀምጧል */}
            <div className="mb-8">
              <p className="text-slate-500 text-[10px] font-bold mb-3 uppercase tracking-[0.2em]">Select Language / ቋንቋ ይምረጡ</p>
              <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currentLanguage === 'en' ? 'bg-gold-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-gold-200'}`}
                >
                  ENGLISH
                </button>
                <button 
                  onClick={() => changeLanguage('am')} 
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currentLanguage === 'am' ? 'bg-gold-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-gold-200'}`}
                >
                  አማርኛ
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Link to="/find-jobs" className="w-full block text-center bg-gold-600 text-slate-950 font-bold py-4 rounded-xl hover:bg-gold-400 transition-all shadow-lg">
                {t('find_job')}
              </Link>
              <Link to="/post-job" className="w-full block text-center border-2 border-gold-600 text-gold-500 font-bold py-4 rounded-xl hover:bg-gold-600 hover:text-slate-950 transition-all">
                {t('post_job')}
              </Link>
              <Link to="/profile" className="w-full block text-center border border-slate-700 text-slate-300 py-4 rounded-xl hover:text-gold-200 transition-all">
                {t('edit_profile')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;