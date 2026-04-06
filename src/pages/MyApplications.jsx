import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // ፕሮፖዛሎችን ከነ ስራው ዝርዝር (Job details) ጋር ማምጣት
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          jobs (
            title,
            client_id,
            budget,
            category
          )
        `)
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setApplications(data);
      }
      setLoading(false);
    };

    fetchMyApplications();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black italic animate-pulse">TRACKING YOUR APPLICATIONS...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter">My <span className="text-gold-500">Applications</span></h1>
          <p className="text-slate-500 text-sm font-medium italic mt-2">Track the status of your submitted proposals and bids.</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
            <p className="text-slate-500 font-bold italic mb-6">You haven't applied to any jobs yet.</p>
            <Link to="/find-jobs" className="bg-gold-500 text-slate-950 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px]">
              Find Jobs Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-gold-500/30 transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gold-500/60 bg-gold-500/5 px-3 py-1 rounded-full border border-gold-500/10">
                        {app.jobs?.category || 'General'}
                      </span>
                      <span className="text-slate-600 text-[10px] font-bold italic">
                        Applied on {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tight text-white group-hover:text-gold-500 transition-colors mb-3">
                      {app.jobs?.title}
                    </h2>
                    <p className="text-slate-400 text-sm italic line-clamp-2 mb-4">
                      "{app.cover_letter}"
                    </p>
                  </div>

                  <div className="md:text-right flex flex-col justify-between items-end">
                    <div className="bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 w-full md:w-auto">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Your Bid</p>
                      <p className="text-xl font-black text-gold-500">{app.bid_amount} <span className="text-xs">ETB</span></p>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${app.status === 'accepted' ? 'bg-green-500' : app.status === 'declined' ? 'bg-red-500' : 'bg-gold-500'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Status: <span className={app.status === 'accepted' ? 'text-green-500' : app.status === 'declined' ? 'text-red-500' : 'text-gold-500'}>
                          {app.status || 'Pending'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;