import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const PostProposal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. የስራውን መረጃ ማምጣት
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      setJob(jobData);

      // 2. የተጠቃሚውን የሳንቲም መጠን ማምጣት
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);
      
      setLoading(false);
    };
    fetchData();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile.santim < 2) {
      alert("በቂ የElite SANTIM የለዎትም! እባክዎ ሳንቲም ይግዙ።");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. ፕሮፖዛሉን መመዝገብ
      const { error: proposalError } = await supabase
        .from('proposals')
        .insert([{ 
          job_id: jobId, 
          freelancer_id: user.id, 
          cover_letter: coverLetter, 
          bid_amount: parseFloat(bidAmount),
          santim_used: 2
        }]);

      if (proposalError) throw proposalError;

      // 2. ከፍሪላንሰሩ ላይ 2 ሳንቲም መቀነስ
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ santim: profile.santim - 2 })
        .eq('id', user.id);

      if (updateError) throw updateError;

      alert("ማመልከቻው በ 2 SANTIM ተልኳል!");
      navigate('/dashboard');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gold-500 text-center py-20 italic font-black uppercase tracking-widest">Accessing Secure Job Terminal...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Job Summary Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 mb-8 backdrop-blur-xl">
        <p className="text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic text-center">Applying For</p>
        <h1 className="text-3xl font-black text-white italic text-center uppercase tracking-tighter">{job?.title}</h1>
        <div className="mt-6 flex justify-center gap-10 border-t border-slate-800 pt-6">
          <div className="text-center">
            <p className="text-slate-500 text-[9px] uppercase font-bold">Client Budget</p>
            <p className="text-white font-black italic">${job?.budget}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-[9px] uppercase font-bold">Application Fee</p>
            <p className="text-gold-500 font-black italic">2 SANTIM</p>
          </div>
        </div>
      </div>

      {/* Proposal Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/20 border border-slate-800/50 rounded-[3rem] p-10 space-y-8">
        <div>
          <label className="block text-white font-black italic uppercase text-xs tracking-widest mb-4">Your Professional Bid ($)</label>
          <input 
            type="number" 
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:border-gold-500"
            placeholder="Enter your amount..."
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-white font-black italic uppercase text-xs tracking-widest mb-4">Cover Letter (Elite Pitch)</label>
          <textarea 
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-300 text-sm italic h-64 outline-none focus:border-gold-500 leading-relaxed"
            placeholder="Explain why you are the best fit for this Elite project..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 text-[9px] italic uppercase tracking-widest font-bold">
            Current Balance: <span className="text-gold-500">{profile?.santim} SANTIM</span>
          </p>
          <button 
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto bg-gold-500 text-slate-950 px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-2xl shadow-gold-500/20 disabled:opacity-50"
          >
            {submitting ? 'Transmitting...' : 'Submit Proposal (2 SANTIM)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostProposal;