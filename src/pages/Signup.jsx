import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'freelancer' // default
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role, // 👈 ይህ በጣም አስፈላጊ ነው!
        }
      }
    });

    if (error) {
      alert("ስህተት ተከስቷል፦ " + error.message);
    } else {
      alert("ምዝገባ ተሳክቷል! አሁን መግባት ይችላሉ።");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-gold-500/20 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gold-400 mb-2 font-serif italic">Elite Works</h2>
          <p className="text-slate-400">አዲስ አካውንት በመክፈት ቤተሰብ ይሁኑ</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Role Selection inside Form */}
          <div className="flex gap-4 mb-6">
            <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all text-center ${formData.role === 'client' ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-slate-700'}`}>
              <input type="radio" name="role" value="client" className="hidden" onChange={(e) => setFormData({...formData, role: e.target.value})} />
              <span className={`block font-bold ${formData.role === 'client' ? 'text-gold-400' : 'text-slate-500'}`}>ሥራ አሰሪ (Client)</span>
            </label>
            <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all text-center ${formData.role === 'freelancer' ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-slate-700'}`}>
              <input type="radio" name="role" value="freelancer" className="hidden" onChange={(e) => setFormData({...formData, role: e.target.value})} />
              <span className={`block font-bold ${formData.role === 'freelancer' ? 'text-gold-400' : 'text-slate-500'}`}>ፍሪላንሰር (Freelancer)</span>
            </label>
          </div>

          <div>
            <label className="block text-gold-200 mb-2 text-sm">ሙሉ ስም</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-all"
              placeholder="ስማችሁን እዚህ ይጻፉ"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-gold-200 mb-2 text-sm">ኢሜይል</label>
            <input 
              type="email" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-all"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-gold-200 mb-2 text-sm">የይለፍ ቃል</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-bold py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-gold-500/20 mt-4">
            ተመዝገቡ
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          አካውንት አለዎት? <Link to="/login" className="text-gold-500 hover:underline font-medium">ይግቡ</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;