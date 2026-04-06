import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("ምዝገባው ተሳክቷል! እባክዎ ኢሜይልዎን ያረጋግጡ።");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-gold-500/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-gold-500 italic tracking-tighter">
            Elite Works
          </Link>
          <p className="text-slate-500 text-sm mt-3 font-medium tracking-wide">
            {t('signup_subtitle') || 'አዲስ አካውንት ይፍጠሩ'}
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-800"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="example@elite.com"
                className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gold-500/10 disabled:opacity-50 mt-4"
            >
              {loading ? t('loading') : (t('signup') || 'ይመዝገቡ')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {t('already_have_account') || 'አካውንት አለዎት?'} {' '}
              <Link to="/login" className="text-gold-500 font-bold hover:underline underline-offset-4">
                {t('login') || 'ይግቡ'}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-600 text-xs font-bold uppercase tracking-widest hover:text-gold-500 transition-colors">
            ← {t('back_to_home') || 'ወደ መነሻ ተመለስ'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;