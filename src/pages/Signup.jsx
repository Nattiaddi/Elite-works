import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('freelancer'); // Default role
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Supabase Auth ምዝገባ
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // 2. በ Profiles ቴብል ላይ ሮልን መመዝገብ
      const user = data.user;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: role }) // ሮሉን እዚህ ጋር እናስቀምጣለን
        .eq('id', user.id);

      if (!profileError) {
        alert("Check your email for confirmation!");
        navigate('/login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl">
        <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter text-center">
          Join <span className="text-gold-500">Elite</span>
        </h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-10 italic">
          Select your path in the elite marketplace
        </p>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Role Selection Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${
                role === 'freelancer' 
                ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-lg shadow-gold-500/20' 
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-gold-500/30'
              }`}
            >
              Freelancer
            </button>
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${
                role === 'client' 
                ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-lg shadow-gold-500/20' 
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-gold-500/30'
              }`}
            >
              Client
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-gold-500/50 italic"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-gold-500/50 italic"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-all active:scale-95 shadow-xl"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;