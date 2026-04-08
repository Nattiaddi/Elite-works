import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { categories } from '../constants/categories';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-gold-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500 italic">
              The Future of Global Freelancing
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-none uppercase">
            ELITE <span className="text-gold-500">WORKS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg font-medium mb-10 leading-relaxed italic">
            Connect with top-tier global talent and premium opportunities. 
            Experience a luxury freelance marketplace designed for the world's best.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {user ? (
              <Link to="/dashboard" className="bg-gold-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl shadow-gold-500/20 active:scale-95">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signup" className="bg-gold-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl shadow-gold-500/20 active:scale-95">
                Start Your Journey
              </Link>
            )}
            <Link to="/find-jobs" className="bg-slate-900 border border-slate-800 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-gold-500/50 transition-all active:scale-95">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20 border-t border-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">
              Browse by <span className="text-gold-500">Category</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">
              Find the right expertise for your elite projects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link 
                to={`/find-jobs?category=${cat.slug}`}
                key={cat.id} 
                className="p-8 rounded-[2rem] border border-slate-800 bg-slate-900/40 hover:border-gold-500/40 transition-all duration-500 group cursor-pointer flex flex-col items-center text-center backdrop-blur-sm"
              >
                <div className="mb-5 p-4 rounded-2xl bg-slate-800/50 group-hover:bg-gold-500/10 transition-all duration-500">
                  <cat.icon className="w-8 h-8 text-gold-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-slate-200 text-sm font-black uppercase tracking-wider group-hover:text-gold-500 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/50 mb-20">
        <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">
          Featured <span className="text-gold-500">Opportunities</span>
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic mb-12">
          Hand-picked premium listings for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="h-64 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 hover:border-gold-500/20 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gold-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 h-full border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-700 italic text-sm">Premium Slot</div>
           </div>
           <div className="h-64 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 hover:border-gold-500/20 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gold-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 h-full border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-700 italic text-sm">Premium Slot</div>
           </div>
           <div className="h-64 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 hover:border-gold-500/20 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gold-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 h-full border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-700 italic text-sm">Premium Slot</div>
           </div>
        </div>
      </section>
      
      {/* ማሳሰቢያ፡ Footer እዚህ አያስፈልግም፣ App.jsx ላይ ስላለ በራሱ ይመጣል */}
    </div>
  );
};

export default Home;