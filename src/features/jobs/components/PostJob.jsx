import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    budget_min: '',
    budget_max: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase.from('jobs').insert([
      {
        ...formData,
        client_id: user.id,
        budget_min: parseInt(formData.budget_min),
        budget_max: parseInt(formData.budget_max),
      }
    ]);

    setLoading(false);
    if (error) alert(error.message);
    else alert("Elite Job Posted Successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-obsidian-soft p-8 rounded-3xl border border-white/10">
      <h2 className="text-3xl font-display font-bold text-white mb-8">Post an Elite Requirement</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Job Title</label>
          <input 
            type="text" 
            className="w-full bg-obsidian border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
            placeholder="e.g. Senior React Developer for Fintech App"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2">Description</label>
          <textarea 
            rows="5"
            className="w-full bg-obsidian border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
            placeholder="Describe the elite skills required..."
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" 
            placeholder="Min Budget ($)"
            className="bg-obsidian border border-white/10 rounded-xl p-4 text-white outline-none"
            onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Max Budget ($)"
            className="bg-obsidian border border-white/10 rounded-xl p-4 text-white outline-none"
            onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gold-gradient text-black font-black py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          {loading ? 'POSTING...' : 'PUBLISH JOB'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;