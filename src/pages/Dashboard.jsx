import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login'); // ካልገቡ ወደ login ይመልሳቸዋል
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return <div className="min-h-screen bg-slate-950 text-gold-500 flex items-center justify-center">በመጫን ላይ...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center mb-10 border-b border-gold-500/10 pb-4">
        <h1 className="text-2xl font-bold text-gold-500">Elite Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="text-sm border border-gold-600/50 text-gold-400 px-4 py-2 rounded-lg hover:bg-gold-600 hover:text-slate-950 transition-all"
        >
          ውጣ (Logout)
        </button>
      </nav>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="md:col-span-2 bg-slate-900 border border-gold-500/20 p-8 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-2">ሰላም፣ {user.user_metadata?.full_name || 'ተጠቃሚ'}! ✨</h2>
          <p className="text-slate-400">ወደ Elite Works ዳሽቦርድ እንኳን በደህና መጡ። ዛሬ ምን መስራት ይፈልጋሉ?</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-sm">ያለዎት ብር</p>
              <p className="text-2xl font-bold text-gold-500">0.00 ETB</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-sm">ያለቁ ስራዎች</p>
              <p className="text-2xl font-bold text-gold-400">0</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 text-gold-400">ፈጣን ምርጫዎች</h3>
          <div className="space-y-4">
            <button className="w-full bg-gold-600 text-slate-950 font-bold py-3 rounded-xl hover:bg-gold-400 transition-colors">
              አዲስ ስራ ፈልግ
            </button>
            <button className="w-full border border-gold-500/30 text-gold-200 py-3 rounded-xl hover:bg-gold-500/10 transition-colors">
              ፕሮፋይል አስተካክል
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;