import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import { 
  DollarSign, Clock, Tag, Send, 
  ChevronLeft, ShieldCheck, AlertCircle, Bookmark,
  MessageSquare // <--- ይቺን ጨምር
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobAndUser = async () => {
      // 1. Fetch Job Details
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*, profiles(full_name)')
        .eq('id', id)
        .single();
      
      setJob(jobData);

      // 2. Fetch User Profile and Interaction
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(userData);

        // Check if job is saved
        const { data: saved } = await supabase
          .from('job_interactions')
          .select('*')
          .eq('job_id', id)
          .eq('user_id', user.id)
          .eq('interaction_type', 'saved')
          .single();
        if (saved) setIsSaved(true);
      }
      setLoading(false);
    };
    fetchJobAndUser();
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

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!profile || profile.user_role !== 'freelancer') {
      alert("Proposals can only be sent by freelancers.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('proposals').insert([
      {
        job_id: id,
        freelancer_id: profile.id,
        bid_amount: parseFloat(bidAmount),
        cover_letter: coverLetter,
        status: 'pending'
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Proposal Sent Successfully!");
      navigate('/dashboard');
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black italic text-gold-500 animate-pulse tracking-widest uppercase text-xs">
      Decrypting Project Data...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        <header className="pt-24 pb-12 px-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-gold-500 transition-colors font-black uppercase italic text-[10px] tracking-widest mb-8"
          >
            <ChevronLeft size={14} /> Back to Market
          </button>
          
          <div className="max-w-5xl">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight text-white">
              {job?.title}
            </h1>
            <div className="flex flex-wrap gap-6 mt-6 items-center">
              <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full">
                <DollarSign size={16} className="text-gold-500" />
                <span className="text-gold-500 font-black italic tracking-tighter text-xl">${job?.budget}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase italic tracking-widest">
                <Tag size={14} /> {job?.category}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase italic tracking-widest">
                <Clock size={14} /> {new Date(job?.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>

        <main className="px-10 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl"></div>
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gold-500 italic mb-6 text-left">Project Brief</h3>
               <p className="text-slate-300 text-lg leading-relaxed italic font-medium whitespace-pre-wrap text-left">
                 {job?.description}
               </p>
            </div>

            <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black italic text-gold-500">
                  {job?.profiles?.full_name?.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none">Posted By</p>
                  <h4 className="text-white font-black italic uppercase mt-1">{job?.profiles?.full_name}</h4>
                </div>
              </div>
              <div className="text-right">
                <ShieldCheck className="text-gold-500 ml-auto" size={20} />
                <p className="text-[8px] font-black uppercase text-gold-500 tracking-widest mt-1 italic">Verified Client</p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] sticky top-32 backdrop-blur-xl border-t-gold-500/20 shadow-2xl">
              <h3 className="text-xl font-black italic uppercase tracking-tight mb-8 text-left text-white">Send Proposal</h3>
              
              <form onSubmit={handleSubmitProposal} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Your Bid ($)</label>
                  <input 
                    type="number" required placeholder="Enter amount" value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all font-black italic"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Cover Letter</label>
                  <textarea 
                    rows="5" required placeholder="Why are you the best fit?" value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-3xl px-6 py-4 text-sm text-slate-300 focus:border-gold-500 outline-none transition-all italic leading-relaxed"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting || profile?.user_role !== 'freelancer'}
                  className="w-full bg-gold-500 text-slate-950 font-black uppercase italic py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : <><Send size={18} /> Submit Proposal</>}
                </button>

                <button 
                  type="button" onClick={handleSave}
                  className={`w-full flex items-center justify-center gap-2 p-5 rounded-2xl font-black uppercase italic text-[11px] tracking-widest border transition-all ${isSaved ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-500 hover:text-white'}`}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save for Later'}
                </button>

                {profile?.user_role !== 'freelancer' && (
                  <p className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-tighter italic mt-4 text-center">
                    <AlertCircle size={14} /> Only Freelancer accounts can apply.
                  </p>
                )}
              </form>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default JobDetails;