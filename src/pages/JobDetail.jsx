import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Clock, DollarSign, Briefcase, MapPin, Send, ShieldCheck } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchJobAndUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('jobs')
        .select('*, profiles(full_name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) navigate('/find-jobs');
      else setJob(data);
      setLoading(false);
    };
    fetchJobAndUser();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 italic tracking-widest font-black uppercase text-xs">Loading Elite Opportunity...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 mb-8 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Briefcase className="w-40 h-40 text-gold-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-500 text-[10px] font-black uppercase tracking-widest italic">
                {job.category || 'Premium Listing'}
              </span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Budget</p>
                  <p className="text-lg font-black text-white italic">${job.budget}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Payment</p>
                  <p className="text-lg font-black text-white italic">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] p-10">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-gold-500 mb-6 underline underline-offset-8 decoration-gold-500/20">
                Job Description
              </h2>
              <p className="text-slate-400 leading-relaxed italic font-medium whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] p-10">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6">
                Required <span className="text-gold-500">Skills</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills?.split(',').map((skill, i) => (
                  <span key={i} className="px-5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-300 italic hover:border-gold-500/40 transition-all cursor-default">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-gold-500 p-8 rounded-[2.5rem] text-slate-950 shadow-2xl shadow-gold-500/20">
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4">Interested?</h3>
              <p className="text-xs font-bold mb-8 leading-relaxed opacity-80 uppercase tracking-tight">
                Submit your proposal to start working on this elite project.
              </p>
              <button className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-slate-950 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Send className="w-4 h-4" /> Send Proposal
              </button>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">About Client</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-gold-500 font-black italic">
                  {job.profiles?.full_name?.charAt(0) || 'E'}
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase italic">{job.profiles?.full_name || 'Elite Client'}</p>
                  <p className="text-[10px] text-slate-500 font-bold tracking-widest flex items-center gap-1 uppercase">
                    <MapPin className="w-3 h-3" /> Ethiopia
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/messages')}
                className="w-full border border-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:border-gold-500/50 transition-all italic"
              >
                Contact Client
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;