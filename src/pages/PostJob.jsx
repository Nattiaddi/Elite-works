import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('jobs').insert([
      { 
        title, 
        description, 
        budget: parseInt(budget), 
        category, 
        client_id: user.id 
      },
    ]);

    if (error) {
      alert("Error posting job: " + error.message);
    } else {
      alert("Job posted successfully! 🚀");
      navigate('/find-jobs');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
        <h2 className="text-3xl font-black italic text-white mb-8">
          Post a <span className="text-gold-500">New Job</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Job Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Luxury Real Estate Website"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all italic"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Budget ($)</label>
              <input 
                required
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="500"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all italic"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all italic appearance-none"
              >
                <option>Web Development</option>
                <option>UI/UX Design</option>
                <option>Logo Design</option>
                <option>Content Writing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Description</label>
            <textarea 
              required
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all italic"
            ></textarea>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-gold-500 text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg shadow-gold-500/10"
          >
            {loading ? 'Posting...' : 'Post Job Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;