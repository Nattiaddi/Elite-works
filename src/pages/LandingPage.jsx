import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 overflow-hidden bg-slate-950">
      
      {/* Background Luxury Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center">
        {/* Elite Badge */}
        <div className="inline-block px-4 py-1.5 mb-8 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500 italic">
            Elite Freelance Marketplace
          </span>
        </div>

        {/* Hero Title - Matching your screenshot */}
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none text-white">
          Welcome to <span className="text-gold-500 drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">Elite Works</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 leading-relaxed max-w-2xl mx-auto italic">
          We provide quality work with care and efficiency just for you. Connect with the best Ethiopian talent and global opportunities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            to="/signup" 
            className="group relative bg-gold-500 text-slate-950 px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl shadow-gold-500/20 active:scale-95"
          >
            Get Started Now
          </Link>
          
          <Link 
            to="/about" 
            className="px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs text-white border border-slate-800 hover:border-gold-500/50 transition-all active:scale-95 bg-slate-900/50 backdrop-blur-sm"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;