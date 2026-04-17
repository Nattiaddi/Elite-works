import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PaymentGateway from '../components/PaymentGateway'; // ኢምፖርት መደረጉን ያረጋግጡ
import { categories as categoryData } from '../constants/categories';
import { 
  PlusCircle, 
  Briefcase, 
  DollarSign, 
  LayoutList, 
  AlignLeft,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [postedJobAmount, setPostedJobAmount] = useState(0);

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    sub_category: 'All',
    budget: '',
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (profile?.user_role !== 'client') {
      alert("Only Client accounts can post jobs.");
      setLoading(false);
      return;
    }

    const budgetValue = parseFloat(jobData.budget);

    const { error } = await supabase.from('jobs').insert([
      {
        ...jobData,
        client_id: profile.id,
        budget: budgetValue,
        status: 'open'
      }
    ]);

    if (error) {
      alert("Error posting job: " + error.message);
      setLoading(false);
    } else {
      // ስራው በተሳካ ሁኔታ ሲለጠፍ የክፍያ ገጹን አሳይ
      setPostedJobAmount(budgetValue);
      setShowPayment(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        
        {/* --- የክፍያ ገጽ (ከስራ መለጠፍ በኋላ የሚመጣ) --- */}
        {showPayment ? (
          <div className="py-20 px-10 max-w-4xl mx-auto w-full">
             <header className="mb-12 text-center">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                  Fund Your <span className="text-gold-500">Project</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4">
                  Secure ${postedJobAmount} in escrow to activate your listing
                </p>
            </header>

            <PaymentGateway 
              amount={postedJobAmount} 
              userProfile={profile} 
            />

            <button 
              onClick={() => setShowPayment(false)}
              className="mt-12 mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-white transition-all"
            >
              <ChevronLeft size={14} /> Back to Dashboard
            </button>
          </div>
        ) : (
          /* --- ስራ መለጠፊያ ፎርም --- */
          <>
            <header className="pt-24 pb-12 px-10">
              <div className="max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                  Post a <span className="text-gold-500">Masterpiece</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4 flex items-center gap-3">
                  <span className="h-[1px] w-8 bg-gold-500/30"></span>
                  Create an opportunity for elite talent
                </p>
              </div>
            </header>

            <main className="px-10 max-w-4xl w-full">
              <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/5 p-10 rounded-[3.5rem] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] pointer-events-none"></div>

                {/* Job Title */}
                <div className="space-y-2 relative z-10">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Luxury Brand Identity Design"
                      value={jobData.title}
                      onChange={(e) => setJobData({...jobData, title: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white focus:border-gold-500 outline-none transition-all italic font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                    <div className="relative">
                      <LayoutList className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <select 
                        required
                        value={jobData.category}
                        onChange={(e) => setJobData({...jobData, category: e.target.value})}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white focus:border-gold-500 outline-none transition-all appearance-none italic font-medium"
                      >
                        <option value="">Select Category</option>
                        {categoryData.map(cat => (
                          <option key={cat.id} value={cat.name} className="bg-slate-950">{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Budget ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
                      <input 
                        type="number" 
                        required
                        placeholder="Enter budget"
                        value={jobData.budget}
                        onChange={(e) => setJobData({...jobData, budget: e.target.value})}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white focus:border-gold-500 outline-none transition-all italic font-black text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Description</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-5 top-6 text-slate-600" size={18} />
                    <textarea 
                      rows="6"
                      required
                      placeholder="Describe the project requirements..."
                      value={jobData.description}
                      onChange={(e) => setJobData({...jobData, description: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-[2rem] pl-14 pr-6 py-6 text-white focus:border-gold-500 outline-none transition-all italic leading-relaxed"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6">
                  {profile?.user_role === 'client' ? (
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gold-500 text-slate-950 font-black uppercase italic py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] disabled:opacity-50"
                    >
                      {loading ? 'Publishing...' : (
                        <>Publish & Fund Project <PlusCircle size={20} /></>
                      )}
                    </button>
                  ) : (
                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 italic font-bold text-sm">
                      <AlertTriangle size={24} />
                      Only Client accounts are authorized to post jobs.
                    </div>
                  )}
                </div>
              </form>
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default PostJob;