import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert("ስህተት: " + error.message);
    } else {
      setMessage("የይለፍ ቃል መቀየሪያ ሊንክ ወደ ኢሜይልዎ ተልኳል! 📧");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-2xl relative z-10">
        <h2 className="text-3xl font-black italic text-gold-500 mb-2">Reset Password</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium italic">ኢሜይልዎን ያስገቡ፣ የለውጥ ሊንክ እንልክልዎታለን።</p>

        {message ? (
          <div className="bg-gold-500/10 border border-gold-500/20 text-gold-500 p-4 rounded-2xl text-center font-bold italic">
            {message}
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-gold-500/50 outline-none transition-all"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-gold-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-gold-400 transition-all uppercase tracking-widest text-xs"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <div className="mt-8 text-center">
          <Link to="/login" className="text-slate-500 text-xs font-bold hover:text-gold-500 uppercase tracking-widest italic">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;