import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-black text-gold-500 italic tracking-tighter mb-6 block">
            ELITE<span className="text-white ml-1 font-light not-italic text-sm tracking-widest uppercase">Works</span>
          </Link>
          <p className="text-slate-500 text-sm italic leading-relaxed">
            Connecting Ethiopia's top-tier talent with premium global opportunities. Quality, efficiency, and elite service.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 italic">Navigation</h4>
          <ul className="space-y-4 text-slate-500 text-xs font-bold uppercase tracking-widest italic">
            <li><Link to="/gigs" className="hover:text-gold-500 transition-colors">Find Services</Link></li>
            <li><Link to="/find-jobs" className="hover:text-gold-500 transition-colors">Find Jobs</Link></li>
            <li><Link to="/post-job" className="hover:text-gold-500 transition-colors">Post a Job</Link></li>
            <li><Link to="/about" className="hover:text-gold-500 transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 italic">Support</h4>
          <ul className="space-y-4 text-slate-500 text-xs font-bold uppercase tracking-widest italic">
            <li><Link to="/help" className="hover:text-gold-500 transition-colors">Help Center</Link></li>
            <li><Link to="/terms" className="hover:text-gold-500 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Stay Elite (Newsletter) */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 italic">Stay Elite</h4>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white focus:border-gold-500 outline-none w-full italic"
            />
            <button className="bg-gold-500 text-slate-950 px-4 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-white transition-all">Join</button>
          </div>
          <p className="text-[9px] text-slate-600 italic mt-4 font-bold uppercase tracking-wider">Get the latest elite opportunities.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] italic">
          © {new Date().getFullYear()} Elite Works. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-slate-600">
          <span className="text-[10px] font-black hover:text-gold-500 cursor-pointer transition-colors uppercase italic">Twitter</span>
          <span className="text-[10px] font-black hover:text-gold-500 cursor-pointer transition-colors uppercase italic">LinkedIn</span>
          <span className="text-[10px] font-black hover:text-gold-500 cursor-pointer transition-colors uppercase italic">Telegram</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;