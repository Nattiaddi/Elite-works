import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select(`*, profiles(full_name)`)
        .order('created_at', { ascending: false });
      
      if (!error) setGigs(data);
      setLoading(false);
    };
    fetchGigs();
  }, []);

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse text-center">Exploring Gigs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4">
          Elite <span className="text-gold-500">Services</span>
        </h2>
        <p className="text-slate-500 italic">Pre-packaged expertise ready for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {gigs.map((gig) => (
          <div key={gig.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-gold-500/50 transition-all">
            <div className="h-48 bg-slate-800 relative flex items-center justify-center text-slate-700 font-black text-4xl italic overflow-hidden">
               {gig.category}
               <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gold-500 rounded-lg"></div>
                <p className="text-[10px] text-slate-400 font-black uppercase italic">{gig.profiles?.full_name}</p>
              </div>
              <h3 className="text-white font-bold italic text-lg mb-4 line-clamp-2">{gig.title}</h3>
              <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <p className="text-gold-500 font-black text-xl italic">${gig.price}</p>
                <Link to={`/gig/${gig.id}`} className="text-[10px] font-black uppercase text-white bg-slate-800 px-6 py-2 rounded-xl hover:bg-gold-500 hover:text-slate-950 transition-all">
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gigs;