import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error:', error);
        navigate('/find-jobs');
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("ማመልከት ከመቻልህ በፊት Login ማድረግ አለብህ!");
      return;
    }

    const { error } = await supabase.from('proposals').insert([
      { job_id: id, freelancer_id: user.id, cover_letter: proposal }
    ]);

    if (error) alert("ስህተት ተፈጥሯል: " + error.message);
    else {
      alert("ማመልከቻህ በስኬት ተልኳል! 🚀");
      setProposal('');
    }
  };

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse">Loading Project...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Job Content */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-gold-500/10 text-gold-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic">
              {job.category}
            </span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
              Posted: {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black italic text-white mb-6 leading-tight">
            {job.title}
          </h1>

          <div className="prose prose-invert max-w-none text-slate-300 italic leading-relaxed text-lg mb-8">
            {job.description}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Project Budget</p>
              <p className="text-2xl font-black text-gold-500 italic">${job.budget}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Job Type</p>
              <p className="text-xl font-black text-white italic">Fixed Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Application Sidebar */}
      <div className="space-y-6">
        <div className="bg-gold-500 p-8 rounded-3xl shadow-2xl shadow-gold-500/10">
          <h3 className="text-slate-950 font-black text-xl italic mb-4 uppercase tracking-tighter">Submit a Proposal</h3>
          <form onSubmit={handleApply} className="space-y-4">
            <textarea 
              required
              rows="6"
              className="w-full bg-slate-950/20 border border-slate-950/20 rounded-2xl p-4 text-slate-950 placeholder-slate-800 focus:outline-none italic font-medium"
              placeholder="ለምን ይህ ስራ ላንተ እንደሚገባ ግለጽ..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            ></textarea>
            <button className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-950 transition-all">
              Apply Now
            </button>
          </form>
        </div>

        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">About the Client</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
            <div>
              <p className="text-white font-black italic text-sm tracking-tight italic">Verified Client</p>
              <p className="text-[9px] text-gold-500 uppercase font-black">⭐⭐⭐⭐⭐ 5.0 Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;