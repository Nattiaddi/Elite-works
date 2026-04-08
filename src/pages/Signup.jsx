import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // የይለፍ ቃል ጥንካሬን ቼክ ማድረጊያ (Regex)
  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePassword(formData.password)) {
      setError("Password must be 8+ chars with Uppercase, Lowercase, Number & Special character.");
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (signupError) {
      setError(signupError.message);
    } else {
      setSuccess(true);
      // ፕሮፋይል ቴብል ላይ ዳታውን መመዝገብ
      if (data.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, full_name: formData.fullName, email: formData.email }
        ]);
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] text-center backdrop-blur-xl">
          <div className="w-20 h-20 bg-gold-500/20 border border-gold-500/50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-gold-500" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">Check Your Email</h2>
          <p className="text-slate-400 text-xs font-medium leading-relaxed italic mb-8">
            We've sent a verification link to <span className="text-white">{formData.email}</span>. 
            Please verify to activate your Elite account.
          </p>
          <Link to="/login" className="text-gold-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-slate-900/30 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Join <span className="text-gold-500">Elite</span></h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 italic">Luxury Freelance Marketplace</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                required
                placeholder="FULL NAME"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black tracking-widest outline-none focus:border-gold-500/50 text-white italic"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                required
                placeholder="EMAIL ADDRESS"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black tracking-widest outline-none focus:border-gold-500/50 text-white italic"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                required
                placeholder="STRONG PASSWORD"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black tracking-widest outline-none focus:border-gold-500/50 text-white italic"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2 px-2 text-[8px] text-slate-500 font-bold uppercase tracking-tighter italic">
              <ShieldCheck className="w-3 h-3 text-gold-500" /> Use A-z, 0-9 & @$!%*
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-[9px] font-black uppercase italic">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl shadow-gold-500/10"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">
          Already a member? <Link to="/login" className="text-white hover:text-gold-500 transition-colors ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;