import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FindJobs = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  // ለጊዜው በDummy Data እንሞክረው (በኋላ ከ Supabase እናመጣዋለን)
  const jobs = [
    { id: 1, title: "React Developer", client: "Nattiaddi Tech", price: "5,000 ETB", level: "Expert", type: "Fixed Price", tags: ["React", "Tailwind"] },
    { id: 2, title: "Logo Designer", client: "Elite Branding", price: "2,500 ETB", level: "Intermediate", type: "Fixed Price", tags: ["Illustrator", "Logo"] },
    { id: 3, title: "UI/UX Designer", client: "Addis Broker", price: "450 ETB/hr", level: "Expert", type: "Hourly", tags: ["Figma", "UI Design"] },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 selection:bg-gold-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white">
              Find <span className="text-gold-500 text-gradient">Elite Work</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Explore the best opportunities in the market.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Search for jobs..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          
          {/* Left Sidebar: Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gold-500 mb-6 italic">Categories</h3>
              <div className="space-y-4 text-sm font-bold text-slate-400">
                <p className="hover:text-white cursor-pointer transition-colors">Web Development</p>
                <p className="hover:text-white cursor-pointer transition-colors">Graphic Design</p>
                <p className="hover:text-white cursor-pointer transition-colors">Digital Marketing</p>
                <p className="hover:text-white cursor-pointer transition-colors">Writing & Translation</p>
              </div>
              
              <div className="mt-10 pt-10 border-t border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gold-500 mb-6 italic">Experience Level</h3>
                <div className="space-y-3">
                  {['Entry', 'Intermediate', 'Expert'].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-3 text-sm text-slate-400 font-bold cursor-pointer hover:text-white">
                      <input type="checkbox" className="accent-gold-500 w-4 h-4" /> {lvl}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content: Job List */}
          <main className="lg:col-span-3 space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] hover:border-gold-500/20 transition-all group relative overflow-hidden">
                {/* Background Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-[50px] rounded-full group-hover:bg-gold-500/10 transition-all"></div>

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-2xl font-black text-white group-hover:text-gold-400 transition-colors mb-2 italic">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
                      <span className="flex items-center gap-1 text-gold-500/80">★ {job.client}</span>
                      <span>•</span>
                      <span>{job.level}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white">{job.price}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 italic">Est. Budget</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                  {job.tags.map(tag => (
                    <span key={tag} className="bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest group-hover:border-gold-500/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 relative z-10">
                   <p className="text-xs text-slate-500 font-medium">Proposals: <span className="text-white font-bold">5 to 10</span></p>
                   <button className="bg-white text-slate-950 px-8 py-3 rounded-full font-black text-[10px] uppercase hover:bg-gold-500 transition-all shadow-lg active:scale-95 tracking-widest">
                     Apply Now
                   </button>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;