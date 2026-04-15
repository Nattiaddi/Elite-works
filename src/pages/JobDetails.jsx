import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  Zap, Bookmark, Send, ChevronLeft, 
  DollarSign, Clock, ShieldCheck, Briefcase 
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobAndInteraction = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Fetch Job Data
      const { data } = await supabase.from('jobs').select('*, profiles(full_name)').eq('id', id).single();
      setJob(data);

      if (user) {
        // 2. Check if Saved
        const { data: saved } = await supabase.from('job_interactions')
          .underline().eq('job_id', id).eq('user_id', user.id).eq('interaction_type', 'saved').single();
        if (saved) setIsSaved(true);

        // 3. Log as "Viewed" (Interaction)
        await supabase.from('job_interactions').upsert({
          user_id: user.id,
          job_id: id,
          interaction_type: 'viewed'
        }, { onConflict: 'user_id, job_id, interaction_type' });
      }
      setLoading(false);
    };
    fetchJobAndInteraction();
  }, [id]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login first");

    if (isSaved) {
      await supabase.from('job_interactions').delete().eq('job_id', id).eq('user_id', user.id).eq('interaction_type', 'saved');
      setIsSaved(false);
    } else {
      await supabase.from('job_interactions').insert({ job_id: id, user_id: user.id, interaction_type: 'saved' });
      setIsSaved(true);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('proposals').insert({
      job_id: id,
      freelancer_id: user.id,
      bid_amount: bidAmount,
      cover_letter: proposal,
      status: 'pending'
    });

    if (error) alert(error.message);
    else {
      alert("Proposal sent successfully!");
      navigate('/dashboard');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black italic animate-pulse">LOADING PROJECT...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 pt-32 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-gold-500 transition-colors text-[10px] font-black uppercase tracking-widest mb-10 italic">
          <ChevronLeft size={16} /> Back to Terminal
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-gold-500/10 text-gold-500 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border border-gold-500/20">{job.category}</span>
                <span className="text-slate-500 text-[9px] font-black uppercase italic tracking-widest">Posted by {job.profiles?.full_name}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{job.title}</h1>
            </div>

            <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-gold-500 text-[10px] font-black uppercase italic tracking-widest mb-4">Project Brief</h3>
              <p className="text-slate-400 leading-relaxed italic text-sm">{job.description}</p>
              
              <div className="mt-8 flex flex-wrap gap-2">
                {job.required_skills?.map(skill => (
                  <span key={skill} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic border border-white/5 tracking-widest text-slate-300">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl sticky top-32">
              <div className="mb-8">
                <p className="text-slate-500 text-[10px] font-black uppercase italic tracking-widest mb-1">Project Budget</p>
                <h2 className="text-4xl font-black italic text-gold-500 tracking-tighter">${job.budget}</h2>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2 italic italic">Your Bid ($)</label>
                  <input type="number" required value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="0.00" 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-black italic focus:border-gold-500/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Proposal Details</label>
                  <textarea required value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Why are you the best fit?" rows="4"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-medium italic focus:border-gold-500/50 transition-all outline-none resize-none" />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-gold-500 text-slate-950 p-5 rounded-2xl font-black uppercase italic text-[11px] tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2">
                  {submitting ? 'SENDING...' : <><Send size={16}/> Apply Now</>}
                </button>
              </form>

              <button onClick={handleSave} className={`w-full mt-4 flex items-center justify-center gap-2 p-5 rounded-2xl font-black uppercase italic text-[11px] tracking-widest border transition-all ${isSaved ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-500 hover:text-white'}`}>
                <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save for Later'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;