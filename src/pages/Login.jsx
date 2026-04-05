import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("መግባት አልተቻለም፦ " + error.message);
    } else {
      alert("እንኳን ደህና መጡ!");
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-gold-500/20 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gold-400 mb-2">እንኳን ደህና መጡ</h2>
          <p className="text-slate-400">ወደ አካውንትዎ ይግቡ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gold-200 mb-2 text-sm">ኢሜይል</label>
            <input 
              type="email" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gold-200 mb-2 text-sm">የይለፍ ቃል</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-gold-500/20">
            ይግቡ
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          አካውንት የለዎትም? <Link to="/signup" className="text-gold-500 hover:underline font-medium">ተመዝገቡ</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;