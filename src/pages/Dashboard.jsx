import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) navigate('/login');
      else setUser(authUser);
    };
    getUser();
  }, [navigate]);

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black tracking-widest uppercase italic">Loading Elite...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 selection:bg-gold-500/30">
      {/* Dashboard Nav */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black text-gold-500 italic tracking-tighter">Elite Dashboard</h1>
        <div className="flex items-center gap-6">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest hidden md:block">
            {user.user_metadata?.full_name || 'User'}
          </span>
          <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} 
            className="text-[10px] font-black border border-gold-600/30 text-gold-500 px-5 py-2 rounded-full hover:bg-gold-500 hover:text-slate-950 transition-all uppercase">
            {t('logout')}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Welcome & Stats */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
             <h2 className="text-4xl font-black mb-4"> {t('greeting')}, <span className="text-gold-500">{user.user_metadata?.full_name?.split(' ')[0]}</span>! ✨</h2>
             <p className="text-slate-400 font-medium leading-relaxed max-w-lg">{t('welcome_message')}</p>
             
             <div className="grid grid-cols-2 gap-6 mt-12">
               <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 group hover:border-gold-500/20 transition-all">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('balance')}</p>
                  <p className="text-3xl font-black text-gold-500 mt-2">0.00 <span className="text-xs font-normal opacity-50">ETB</span></p>
               </div>
               <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 group hover:border-gold-500/20 transition-all">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('completed_jobs')}</p>
                  <p className="text-3xl font-black text-white mt-2">0</p>
               </div>
             </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
            <h3 className="text-lg font-black text-gold-500 mb-8 uppercase tracking-widest border-b border-white/5 pb-4">{t('quick_actions')}</h3>
            <div className="space-y-4">
              <Link to="/find-jobs" className="w-full block text-center bg-gold-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10">
                 {t('find_job')}
              </Link>
              <Link to="/post-job" className="w-full block text-center border border-gold-600/30 text-gold-500 font-black py-4 rounded-2xl hover:bg-gold-500 hover:text-slate-950 transition-all">
                 {t('post_job')}
              </Link>
              <Link to="/profile" className="w-full block text-center bg-slate-950 text-slate-400 font-black py-4 rounded-2xl border border-white/5 hover:text-white transition-all">
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