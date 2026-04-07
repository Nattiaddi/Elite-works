import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProposals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // የገባው ተጠቃሚ የላካቸውን ፕሮፖዛሎች ከስራው ርዕስ ጋር አብሮ ያመጣል
        const { data, error } = await supabase
          .from('proposals')
          .select(`
            id,
            created_at,
            status,
            cover_letter,
            jobs (
              id,
              title,
              budget,
              category
            )
          `)
          .eq('freelancer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) console.error('Error fetching proposals:', error);
        else setProposals(data);
      }
      setLoading(false);
    };

    fetchMyProposals();
  }, []);

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse text-center">Loading Your Bids...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h2 className="text-4xl font-black italic text-white mb-2 uppercase tracking-tighter">
          My <span className="text-gold-500">Bids & Applications</span>
        </h2>
        <p className="text-slate-500 font-medium italic">Track the status of your premium proposals.</p>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-slate-900 rounded-[3rem]">
          <p className="text-slate-600 italic font-bold tracking-widest uppercase text-xs mb-6">
            You haven't applied to any jobs yet.
          </p>
          <Link to="/find-jobs" className="bg-gold-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {proposals.map((app) => (
            <div key={app.id} className="bg-slate-900/30 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold-500/30 transition-all">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gold-500 bg-gold-500/5 px-3 py-1 rounded-md border border-gold-500/10">
                    {app.jobs?.category}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                    app.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {app.status || 'Pending'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 italic">{app.jobs?.title}</h3>
                <p className="text-slate-400 text-sm italic line-clamp-1 mb-4">{app.cover_letter}</p>
                <p className="text-[10px] text-slate-600 font-bold uppercase italic">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-black text-white italic">${app.jobs?.budget}</p>
                <Link 
                  to={`/job/${app.jobs?.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-gold-500 border border-gold-500/20 px-6 py-2 rounded-xl hover:bg-gold-500 hover:text-slate-950 transition-all"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;