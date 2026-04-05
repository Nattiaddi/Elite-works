import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-gold-500/20 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gold-400 mb-2">አዲስ አካውንት ይፍጠሩ</h2>
          <p className="text-slate-400">Elite Worksን ይቀላቀሉ</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gold-200 mb-2 text-sm">ሙሉ ስም</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500"
              placeholder="ጠንከር ያለ የይለፍ ቃል"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-gold-500/20">
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