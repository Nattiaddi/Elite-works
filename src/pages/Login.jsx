import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ፓስዎርድ እንዲታይ/እንዲደበቅ
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-slate-900/30 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Welcome <span className="text-gold-500">Back</span></h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 italic">Access your Elite dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="email" 
              required 
              placeholder="EMAIL ADDRESS" 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black tracking-widest outline-none focus:border-gold-500/50 text-white italic"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="PASSWORD" 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-14 py-4 text-[10px] font-black tracking-widest outline-none focus:border-gold-500/50 text-white italic"
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            {/* የአይን ምልክት Logic */}
            <button
              type="button"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gold-500" />
              ) : (
                <Eye className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" self className="text-[9px] text-slate-500 font-bold uppercase hover:text-gold-500 transition-colors italic">
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-[9px] font-black uppercase italic">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl shadow-gold-500/10 active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? 'Authenticating...' : <><LogIn className="w-4 h-4" /> Login to Elite</>}
          </button>
        </form>

        <p className="text-center mt-8 text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">
          Don't have an account? <Link to="/signup" className="text-white hover:text-gold-500 transition-colors ml-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;