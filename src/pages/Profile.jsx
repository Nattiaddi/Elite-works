import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] text-center">
            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-6 border-2 border-gold-500 flex items-center justify-center text-4xl font-black text-gold-500 italic uppercase">
              {user?.user_metadata?.full_name?.charAt(0) || 'E'}
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
              {user?.user_metadata?.full_name || 'Elite Member'}
            </h2>
            <p className="text-gold-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 italic">Verified Global Talent</p>
            
            <div className="flex justify-center gap-4 border-t border-slate-800 pt-6">
               <div className="text-center">
                 <p className="text-white font-black italic">0</p>
                 <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Jobs Done</p>
               </div>
               <div className="h-8 w-px bg-slate-800"></div>
               <div className="text-center">
                 <p className="text-white font-black italic">0</p>
                 <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Reviews</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem]">
            <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-6 italic">Core Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {['Digital Arts', 'Web Systems', 'Global Marketing'].map(skill => (
                <span key={skill} className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Portfolio Area */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">Featured <span className="text-gold-500">Portfolio</span></h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-gold-500 hover:text-white transition-all underline underline-offset-8">+ Upload Project</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video bg-slate-900/50 border border-dashed border-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-700 hover:border-gold-500 transition-all cursor-pointer">
                <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Add New Showcase</p>
              </div>
            </div>
          </div>

          {/* Work Experience Area */}
          <div className="bg-slate-900/20 border border-slate-800 p-10 rounded-[3rem]">
            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-8 italic leading-none">Global <span className="text-gold-500">Experience</span></h3>
            <div className="space-y-8">
               <div className="border-l-2 border-gold-500/20 pl-8 py-2">
                  <p className="text-white font-black italic uppercase tracking-wider mb-1">Elite Freelancer</p>
                  <p className="text-gold-500 text-[10px] font-black uppercase tracking-widest mb-4">Elite Works Platform • 2026 - Present</p>
                  <p className="text-slate-500 text-sm italic leading-relaxed">Providing high-end digital services to global clients with a focus on quality and efficiency.</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;