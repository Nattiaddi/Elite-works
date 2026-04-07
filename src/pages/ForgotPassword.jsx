import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("A password reset link has been sent to your email. Check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[3rem] text-center backdrop-blur-xl">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Recover <span className="text-gold-500">Account</span></h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic mb-8">Enter your email to receive a secure link.</p>
        
        <form onSubmit={handleReset} className="space-y-6">
          <input 
            type="email" 
            placeholder="REGISTERED EMAIL ADDRESS" 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-white outline-none focus:border-gold-500 italic transition-all" 
            required 
            onChange={e => setEmail(e.target.value)} 
          />
          <button 
            disabled={loading}
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-gold-500/10 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? "Transmitting..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="mt-8 text-[10px] text-gold-500 font-black uppercase tracking-widest italic bg-gold-500/5 p-4 rounded-xl border border-gold-500/20 animate-pulse">
            {message}
          </p>
        )}

        <div className="mt-8">
           <Link to="/login" className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic hover:text-white transition-colors">
              ← Return to Login
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;