import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("ስህተት: " + error.message);
    } else {
      alert("የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል! 🚀");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-2xl">
        <h2 className="text-3xl font-black italic text-gold-500 mb-8">New Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 ml-1">Set New Password</label>
            <input 
              type="password" 
              required 
              minLength="6"
              className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-gold-500/50 outline-none transition-all"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-gold-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-gold-400 transition-all uppercase tracking-widest text-xs">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;