import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Globe, Star, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-40 pb-24 px-6">
        {/* Background Luxury Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/5 blur-[140px] rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Elite Badge */}
            <div className="inline-block px-6 py-2 mb-10 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500 italic flex items-center gap-3">
                <Star size={12} fill="currentColor" /> Ethiopia's Premier Talent Network
              </span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-[0.85]">
              Elite <span className="text-gold-500 drop-shadow-[0_0_40px_rgba(212,175,55,0.25)]">Works</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-slate-400 text-sm md:text-lg uppercase tracking-[0.4em] mb-14 italic max-w-3xl mx-auto leading-relaxed"
          >
            Connecting the most ambitious clients with the top 1% of digital craftsmen
          </motion.p>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link to="/signup" className="group bg-gold-500 text-slate-950 px-12 py-6 rounded-full font-black uppercase italic text-xs flex items-center gap-4 hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] active:scale-95">
              Get Started Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/find-jobs" className="px-12 py-6 rounded-full font-black uppercase italic text-xs text-white border border-white/10 hover:border-gold-500/50 hover:bg-white/5 transition-all active:scale-95 backdrop-blur-sm">
              Explore Masterpieces
            </Link>
          </motion.div>
        </div>

        {/* Moving Background Text (Marquee Effect) */}
        <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
          <motion.div 
            animate={{ x: [-2000, 0] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="text-[15vh] font-black uppercase italic whitespace-nowrap"
          >
            PREMIUM WORK • TOP TALENT • SECURE PAYMENTS • ELITE SELECTION • CURATED EXCELLENCE • 
          </motion.div>
        </div>
      </section>

      {/* 2. Trust / Social Proof Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale">
            <span className="font-black italic text-xl uppercase tracking-tighter">Vercel</span>
            <span className="font-black italic text-xl uppercase tracking-tighter">Supabase</span>
            <span className="font-black italic text-xl uppercase tracking-tighter">React.js</span>
            <span className="font-black italic text-xl uppercase tracking-tighter">Tailwind</span>
            <span className="font-black italic text-xl uppercase tracking-tighter">Lucide</span>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              icon: Zap, 
              title: "Ultra Fast", 
              desc: "From posting to hiring in minutes. Our AI matching system finds your perfect partner instantly.",
              color: "text-blue-400"
            },
            { 
              icon: ShieldCheck, 
              title: "Secure Escrow", 
              desc: "Funds are only released when you are 100% satisfied. Total protection for both sides.",
              color: "text-gold-500"
            },
            { 
              icon: Globe, 
              title: "Top 1% Only", 
              desc: "We manually vet every professional. Only the highest quality work makes it to Elite Works.",
              color: "text-emerald-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -15 }}
              className="p-12 bg-white/5 rounded-[4rem] border border-white/5 hover:border-gold-500/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-500/5 blur-2xl group-hover:bg-gold-500/10 transition-all"></div>
              <feature.icon className={`${feature.color} mb-8`} size={48} />
              <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed italic">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Call to Action (CTA) */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-tr from-gold-600 to-gold-400 rounded-[4rem] p-16 text-center text-slate-950 relative overflow-hidden shadow-[0_40px_100px_rgba(212,175,55,0.15)]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none italic font-black text-[10rem] uppercase -rotate-12 translate-y-10">ELITE</div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 relative z-10">
                Ready to build something <br />extraordinary?
            </h2>
            <Link to="/signup" className="inline-flex items-center gap-3 bg-slate-950 text-white px-12 py-6 rounded-full font-black uppercase italic text-xs hover:scale-105 transition-all relative z-10">
                Join the Circle <CheckCircle size={18} />
            </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;