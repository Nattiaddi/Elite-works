import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-gold-500/30">
      
      {/* 1. TOP BANNER (Elite Works Hero) */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500 italic">
              The Future of Freelancing in Ethiopia
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-none">
            ELITE <span className="text-gold-500 text-outline">WORKS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg font-medium mb-10 leading-relaxed">
            Connect with top-tier Ethiopian talent and premium global opportunities. 
            Experience a luxury freelance marketplace designed for the best.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/signup" className="bg-gold-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl shadow-gold-500/20 active:scale-95">
              Start Your Journey
            </Link>
            <Link to="/find-jobs" className="bg-slate-900 border border-slate-800 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-gold-500/50 transition-all active:scale-95">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH ADS */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-4 gap-10">
        
        {/* Left & Middle: Content Area */}
        <div className="lg:col-span-3 space-y-12">
          <div className="border-l-4 border-gold-500 pl-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Featured <span className="text-gold-500">Opportunities</span></h2>
            <p className="text-slate-500 text-sm font-medium italic mt-1">Hand-picked premium listings for you.</p>
          </div>

          {/* Sample Job Card (Just for UI look) */}
          <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-[2.5rem] opacity-60">
             <div className="flex justify-between items-start">
                <div>
                  <div className="w-20 h-2 bg-slate-800 rounded-full mb-4"></div>
                  <div className="w-48 h-6 bg-slate-800 rounded-md mb-2"></div>
                  <div className="w-full h-4 bg-slate-800 rounded-md max-w-sm"></div>
                </div>
                <div className="w-16 h-8 bg-slate-800 rounded-lg"></div>
             </div>
             <p className="mt-8 text-[10px] font-black text-slate-700 tracking-widest uppercase">Sign in to view full details</p>
          </div>
        </div>

        {/* RIGHT SIDE: GOOGLE AD PLACEHOLDER */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 bg-slate-900/40 border border-dashed border-slate-800 h-[600px] rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center group">
             <div className="w-12 h-12 border-2 border-slate-800 rounded-full mb-4 flex items-center justify-center text-slate-800 group-hover:border-gold-500/50 transition-colors font-black">$</div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 group-hover:text-gold-500/50 transition-colors">
               Google Ad Space <br/> (Sidebar)
             </p>
          </div>
        </aside>
      </section>

      {/* 3. BOTTOM AD BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
         <div className="w-full bg-slate-900/40 border border-dashed border-slate-800 h-32 rounded-[2rem] flex items-center justify-center text-center group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 group-hover:text-gold-500/50 transition-colors">
               Horizontal Google Ad Banner (728x90)
            </p>
         </div>
      </section>

    </div>
  );
};

export default Home;