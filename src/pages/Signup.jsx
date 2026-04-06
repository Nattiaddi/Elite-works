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

    // ተጠቃሚውን መመዝገብ እና Metadata (ሙሉ ስም) መጨመር
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
      // ኢሜይል እንዲያረጋግጡ መልዕክት ማሳየት ወይም በቀጥታ ወደ ዳሽቦርድ መላክ ይቻላል
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
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-gold-500 italic tracking-tighter">
            Elite Works
          </Link>
          <p className="text-slate-500 text-sm mt-3 font-medium tracking-wide">
            {t('signup_subtitle') || 'አዲስ አካውንት ይፍጠሩ'}
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2 ml-1">
                Full Name
              </label>