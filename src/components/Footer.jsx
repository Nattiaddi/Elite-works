import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Headset, HelpCircle, ShieldCheck, Zap, Globe, 
  Twitter, Linkedin, Send 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/5 bg-slate-950 relative overflow-hidden">
      
      {/* 1. PREMIUM BANNER: Why EliteWorks is Different */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative">
        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 text-white">
            How EliteWorks <span className="text-gold-500">Different</span>
          </h2>
          
          {/* THE CUSTOM UNDERLINE SHAPE */}
          <div className="relative flex justify-center mt-4">
            <div className="h-1.5 w-48 bg-gold-500 rounded-full relative">
              <div className="absolute -left-1 -top-1 w-3 h-3 bg-gold-500 rounded-full blur-[4px] animate-pulse"></div>
              <div className="absolute -right-1 -top-1 w-3 h-3 bg-gold-500 rounded-full blur-[4px] animate-pulse"></div>
            </div>
            <svg className="absolute top-3 w-80 h-10 opacity-40" viewBox="0 0 256 32">
              <path 
                d="M0 10C64 10 64 25 128 25C192 25 192 10 256 10" 
                stroke="#EAB308" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-gold-500/20 transition-all group">
              <Zap className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h4 className="text-[11px] font-black uppercase italic tracking-widest text-white mb-2">Ultra Fast</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Swift hiring & secure instant payments.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-gold-500/20 transition-all group">
              <ShieldCheck className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h4 className="text-[11px] font-black uppercase italic tracking-widest text-white mb-2">Secure Escrow</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Your funds are protected until delivery.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-gold-500/20 transition-all group">
              <Globe className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h4 className="text-[11px] font-black uppercase italic tracking-widest text-white mb-2">Top 1% Talent</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Strict vetting for professional results.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION & LINKS SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/5">
        
        {/* Brand & Socials */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-black text-gold-500 italic tracking-tighter block group">
            ELITE<span className="text-white ml-1 font-light not-italic text-sm tracking-widest uppercase group-hover:text-gold-500 transition-colors">Works</span>
          </Link>
          <p className="text-slate-500 text-[11px] font-bold uppercase italic leading-relaxed tracking-wider">
            Curating excellence for Ethiopia's most ambitious projects.
          </p>
          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-gold-500 transition-all border border-white/5 hover:border-gold-500/40">
              <Twitter size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-gold-500 transition-all border border-white/5 hover:border-gold-500/40">
              <Linkedin size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-gold-500 transition-all border border-white/5 hover:border-gold-500/40">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold-500">
            <HelpCircle size={16} />
            <h4 className="font-black italic uppercase tracking-[0.2em] text-[10px]">How it works</h4>
          </div>
          <ul className="space-y-3 text-[10px] font-black uppercase italic text-slate-500 tracking-widest">
            <li className="hover:text-gold-500 cursor-pointer transition-colors">Post a Brief</li>
            <li className="hover:text-gold-500 cursor-pointer transition-colors">Vetting Process</li>
            <li className="hover:text-gold-500 cursor-pointer transition-colors">Milestone Release</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold-500">
            <Headset size={16} />
            <h4 className="font-black italic uppercase tracking-[0.2em] text-[10px]">Support</h4>
          </div>
          <ul className="space-y-3 text-[10px] font-black uppercase italic text-slate-500 tracking-widest">
            <li><Link to="/help" className="hover:text-gold-500 transition-colors">Help Center</Link></li>
            <li><Link to="/support" className="hover:text-gold-500 transition-colors">Open Ticket</Link></li>
            <li><Link to="/terms" className="hover:text-gold-500 transition-colors">Terms & Rules</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="text-white font-black italic uppercase tracking-[0.2em] text-[10px]">Stay Elite</h4>
          <div className="relative">
            <input 
              type="email" 
              placeholder="ENTER EMAIL" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black italic text-white focus:border-gold-500 outline-none transition-all uppercase tracking-widest"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold-500 text-slate-950 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase italic hover:bg-white transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] italic">
          © 2026 ELITE WORKS CORP. BY KEDAMAWI
        </p>
        <div className="flex gap-8 text-slate-700 text-[8px] font-black uppercase tracking-[0.2em] italic">
          <span className="hover:text-gold-500 cursor-pointer transition-all">Privacy Policy</span>
          <span className="hover:text-gold-500 cursor-pointer transition-all">Cookie Settings</span>
        </div>
      </div>

      {/* Animated Bottom Line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent w-full"></div>
    </footer>
  );
};

export default Footer;