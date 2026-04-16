import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Headset, HelpCircle, ShieldCheck, Zap, Globe, 
  Twitter, Linkedin, Send 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/5 bg-slate-950 relative overflow-hidden">
      
      {/* PRE-FOOTER: BRAND PROMISE */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative border-b border-white/5">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-white">
            How EliteWorks Is <span className="text-gold-500">Different</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <Zap className="text-gold-500 mx-auto mb-4" />
              <h4 className="text-[10px] font-black uppercase italic text-white mb-2">Ultra Fast</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold italic">Instant Match & Fast Payouts.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <ShieldCheck className="text-gold-500 mx-auto mb-4" />
              <h4 className="text-[10px] font-black uppercase italic text-white mb-2">Secure Escrow</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold italic">Protected Payments for every milestone.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <Globe className="text-gold-500 mx-auto mb-4" />
              <h4 className="text-[10px] font-black uppercase italic text-white mb-2">Top 1% Talent</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold italic">Only Vetted Professionals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Socials */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-black text-gold-500 italic tracking-tighter block uppercase">
            ELITE<span className="text-white ml-1 font-light not-italic text-sm tracking-widest">Works</span>
          </Link>
          <p className="text-slate-500 text-[10px] font-bold uppercase italic leading-relaxed tracking-wider">
            Curating excellence for Ethiopia's most ambitious projects.
          </p>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Send].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-gold-500 border border-white/5 hover:border-gold-500/40 transition-all">
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Governance - ጠፍቶ የነበረው */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold-500">
            <ShieldCheck size={16} />
            <h4 className="font-black italic uppercase tracking-widest text-[10px]">Governance</h4>
          </div>
          <ul className="space-y-3 text-[10px] font-black uppercase italic text-slate-500 tracking-widest">
            <li className="hover:text-white transition-colors cursor-pointer">About EliteWorks</li>
            <li className="hover:text-white transition-colors cursor-pointer">Verification Process</li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold-500">
            <Headset size={16} />
            <h4 className="font-black italic uppercase tracking-widest text-[10px]">Support</h4>
          </div>
          <ul className="space-y-3 text-[10px] font-black uppercase italic text-slate-500 tracking-widest">
            <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link to="/support" className="hover:text-white transition-colors">Open Ticket</Link></li>
            <li className="hover:text-white transition-colors cursor-pointer">Live Chat</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="text-white font-black italic uppercase tracking-widest text-[10px]">Stay Elite</h4>
          <div className="relative">
            <input type="email" placeholder="ENTER EMAIL" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[9px] font-black italic text-white focus:border-gold-500 outline-none uppercase tracking-widest"/>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold-500 text-slate-950 px-3 py-1 rounded-lg font-black text-[9px] uppercase italic">Join</button>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] italic">
          © 2026 ELITE WORKS CORP. BY KEDAMAWI
        </p>
        <div className="flex gap-8 text-slate-700 text-[8px] font-black uppercase tracking-[0.2em] italic">
          <Link to="/privacy" className="hover:text-gold-500 transition-all">Privacy</Link>
          <Link to="/cookies" className="hover:text-gold-500 transition-all">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;