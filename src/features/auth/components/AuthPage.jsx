import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';
import { signUpElite } from '../services/authService';
import { Mail, Lock, User, Briefcase, ChevronRight } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'freelancer'
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      } else {
        await signUpElite(formData.email, formData.password, formData.fullName, formData.role);
        alert("Verification email sent! Check your inbox.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter">
            <span className="text-gold">ELITE</span> WORKS
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Welcome back to the inner circle.' : 'Join the world’s top 1%.'}
          </p>
        </div>

        <div className="bg-obsidian-soft border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-obsidian border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-gold outline-none transition-all"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                
                {/* Role Selector */}
                <div className="flex gap-4 p-1 bg-obsidian border border-white/10 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'freelancer'})}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.role === 'freelancer' ? 'bg-gold text-black' : 'text-gray-500'}`}
                  >
                    FREELANCER
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'client'})}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.role === 'client' ? 'bg-gold text-black' : 'text-gray-500'}`}
                  >
                    CLIENT
                  </button>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-500" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-obsidian border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-gold outline-none transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-obsidian border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-gold outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold-gradient text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-500 hover:text-gold transition-colors"
            >
              {isLogin ? "Don't have an account? Join Elite" : "Already a member? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;