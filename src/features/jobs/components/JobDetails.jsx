import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import { Clock, DollarSign, Tag, Send } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*, profiles(full_name, avatar_url)')
        .eq('id', id)
        .single();
      setJob(data);
    };
    fetchJob();
  }, [id]);

  const submitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase.from('proposals').insert([
      {
        job_id: id,
        freelancer_id: user.id,
        bid_amount: parseInt(bidAmount),
        cover_letter: coverLetter
      }
    ]);

    setSubmitting(false);
    if (error) alert("ስህተት ተፈጥሯል: " + error.message);
    else alert("Elite Proposal በተሳካ ሁኔታ ተልኳል!");
  };

  if (!job) return <div className="text-white p-10 text-center">Loading Elite Opportunity...</div>;

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 p-6">
      
      {/* Left: Job Description */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-obsidian-soft p-8 rounded-3xl border border-white/5">
          <h1 className="text-4xl font-bold text-white mb-4">{job.title}</h1>
          <div className="flex gap-6 text-gray-400 text-sm mb-8">
            <span className="flex items-center gap-1"><Tag size={16} className="text-gold" /> {job.category}</span>
            <span className="flex items-center gap-1"><Clock size={16} className="text-gold" /> Posted 2 hours ago</span>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-bold text-white mb-4">Project Description</h3>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>
      </div>

      {/* Right: Proposal Action Card */}
      <div className="space-y-6">
        <div className="bg-obsidian-soft p-8 rounded-3xl border border-gold/20 shadow-lg shadow-gold/5 sticky top-24">
          <h3 className="text-xl font-bold text-white mb-6">Submit Proposal</h3>
          <form onSubmit={submitProposal} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Your Bid Amount ($)</label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type="number" 
                  className="w-full bg-obsidian border border-white/10 rounded-xl p-3 pl-10 text-white outline-none focus:border-gold"
                  placeholder="e.g. 500"
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Cover Letter</label>
              <textarea 
                rows="4"
                className="w-full mt-2 bg-obsidian border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold"
                placeholder="Why are you elite for this job?"
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-gold-gradient text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
            >
              {submitting ? 'SENDING...' : 'SEND PROPOSAL'}
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Client Info Card */}
        <div className="bg-obsidian-soft p-6 rounded-3xl border border-white/5">
          <p className="text-xs text-gray-500 uppercase font-bold mb-4">About the Client</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gold/20"></div>
            <div>
              <p className="text-white font-bold">{job.profiles?.full_name}</p>
              <p className="text-xs text-gray-500">Verified Client</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;