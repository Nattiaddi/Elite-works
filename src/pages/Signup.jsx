import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Strict Validation
    const nameRegex = /^[a-zA-Z ]{5,50}$/; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!nameRegex.test(form.fullName)) {
      setLoading(false);
      return setError("FULL NAME MUST BE IN ENGLISH (INCLUDE LAST NAME).");
    }
    if (!passwordRegex.test(form.password)) {
      setLoading(false);
      return setError("PASSWORD MUST HAVE: UPPERCASE, LOWERCASE, NUMBER & SPECIAL CHAR.");
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          username: form.username.toLowerCase(),
          kyc_status: 'pending'
        }
      }
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      alert("Registration successful! Please check your email for confirmation.");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-20">
      <form onSubmit={handleSignup} className="max-w-md w-full bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] space-y-6 backdrop-blur-xl">
        <h2 className="text-3xl font-black italic text-white text-center uppercase tracking-tighter">Create <span className="text-gold-500">Elite Account</span></h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">{error}</div>}

        <div className="space-y-4">
          <input type="text" placeholder="FULL NAME (ENGLISH ONLY)" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white italic outline-none focus:border-gold-500 transition-all" required onChange={e => setForm({...form, fullName: e.target.value})} />
          <input type="text" placeholder="USERNAME" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white italic outline-none focus:border-gold-500 transition-all" required onChange={e => setForm({...form, username: e.target.value})} />
          <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white italic outline-none focus:border-gold-500 transition-all" required onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="STRONG PASSWORD" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white italic outline-none focus:border-gold-500 transition-all" required onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        
        <button disabled={loading} className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-gold-500/10 active:scale-95 disabled:opacity-50">
          {loading ? "Registering..." : "Join Elite Works"}
        </button>

        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
          Already have an account? <Link to="/login" className="text-gold-500 hover:text-white transition-colors">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;