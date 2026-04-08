import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Send, DollarSign, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const PostProposal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase.from('jobs').select('title, budget').eq('id', jobId).single();
      if (data) setJob(data);
    };
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // የደህንነት ጥበቃ (Regex for Links and Phones)
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9]+\.[a-z]{2,})/gi;
    const phonePattern = /(\+?[0-9]{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

    if (urlPattern.test(coverLetter) || phonePattern.test(coverLetter)) {
      setError("ለደህንነት ሲባል በፕሮፖዛልዎ ላይ ስልክ ቁጥር ወይም ሊንክ ማካተት የተከለከለ ነው።");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error: submitError } = await supabase.from('proposals').insert([
      {
        job_id: jobId,
        freelancer_id: user.id,
        bid_amount: parseFloat(bidAmount),
        delivery_days: parseInt(deliveryTime),
        cover_letter: coverLetter,
        status: 'pending'
      }
    ]);

    if (submitError) {
      setError("Submit ሲደረግ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።");
    } else {
      alert("Proposal Sent Successfully! 🚀");
      navigate('/my-proposals');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
            Submit <span className="text-gold-500">Proposal</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
            Applying for: <span className="text-white">{job?.title}</span> (Budget: ${job?.budget})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/30 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl">
          
          {/* Bid & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold-500 ml-2">Your Bid Amount ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="number" 
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="EX: 500"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-gold-500/50 transition-all italic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold-500 ml-2">Delivery Time (Days)</label>
              <div className="relative">
                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="number" 
                  required
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="EX: 7"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-gold-500/50 transition-all italic"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gold-500 ml-2">Why should we hire you?</label>
            <textarea 
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              placeholder="DESCRIBE YOUR APPROACH AND RELEVANT EXPERIENCE..."
              className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] px-8 py-6 text-sm font-medium leading-relaxed outline-none focus:border-gold-500/50 transition-all italic"
            ></textarea>
            <p className="text-[9px] text-slate-600 italic uppercase tracking-tighter">
              ⚠️ Pro Tip: Avoid sharing phone numbers or personal links to stay protected.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest italic">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all active:scale-95 shadow-xl shadow-gold-500/20 flex items-center justify-center gap-3"
          >
            {loading ? 'Processing...' : <><Send className="w-4 h-4" /> Submit Proposal</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProposal;