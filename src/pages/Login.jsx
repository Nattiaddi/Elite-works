import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-gold-500/30">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black text-gold-500 italic tracking-tighter">
            Elite Works
          </Link>
          <p className="text-slate-500 text-sm mt-3 font-medium tracking-wide">
            {t('login_subtitle') || 'ወደ አካውንትዎ ይግቡ'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@elite.com"
                className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-700"
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
              {loading ? t('loading') : (t('login') || 'ይግቡ')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {t('no_account') || 'አካውንት የለዎትም?'} {' '}
              <Link to="/signup" className="text-gold-500 font-bold hover:underline underline-offset-4">
                {t('signup') || 'ይመዝገቡ'}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-600 text-xs font-bold uppercase tracking-widest hover:text-gold-500 transition-colors">
            ← {t('back_to_home') || 'ወደ መነሻ ተመለስ'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;