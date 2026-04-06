import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [experience, setExperience] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to post a job");
      navigate('/login');
      return;
    }

    const { error } = await supabase.from('jobs').insert([
      {
        title,
        description,
        budget: parseInt(budget),
        category,
        experience_level: experience,
        client_id: user.id,
        client_name: user.user_metadata?.full_name || 'Elite Client'
      }
    ]);

    if (error) {
      alert("ስህተት ተፈጥሯል: " + error.message);
    } else {
      alert("ሥራው በሥርዓት ተለጥፏል! 🚀");
      navigate('/find-jobs');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter text-white">
            Post an <span className="text-gold-500">Elite Opportunity</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Find the best talent for your prestigious projects.</p>
        </div>

        <form onSubmit={handlePostJob} className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-2xl space-y-8">
          
          {/* Job Title */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3 ml-1">Job Title</label>
            <input 
              type="text" 
              placeholder="e.g. Senior React Developer for Luxury Branding Site"
              className="w-full bg-slate-950 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3 ml-1">Job Description</label>
            <textarea 
              rows="5"
              placeholder="Describe the project requirements and expectations..."
              className="w-full bg-slate-950 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all font-medium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Category */}
            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3 ml-1">Category</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all font-bold appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Web Development</option>
                <option>Graphic Design</option>
                <option>Digital Marketing</option>
                <option>Video Editing</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3 ml-1">Budget (ETB)</label>
              <input 
                type="number" 
                placeholder="e.g. 10000"
                className="w-full bg-slate-950 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-gold-500/50 transition-all font-bold"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3 ml-1">Experience Level Required</label>
            <div className="flex gap-4">
              {['Entry', 'Intermediate', 'Expert'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperience(lvl)}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${experience === lvl ? 'bg-gold-500 border-gold-500 text-slate-950 shadow-lg shadow-gold-500/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-gold-500/30'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-gold-500/20 disabled:opacity-50 mt-4 uppercase tracking-[0.2em]"
          >
            {loading ? 'Posting...' : 'Launch Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;