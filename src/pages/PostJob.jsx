import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { categories } from '../constants/categories'; // ካታጎሪዎችን ከዚህ እናመጣለን

const PostJob = () => {
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // ዋናው ዘርፍ ሲቀየር ንዑስ ዘርፉን Reset ለማድረግ
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory(""); 
  };

  // የተመረጠው ዘርፍ ንዑስ ዘርፎችን ለማግኘት
  const subCats = categories.find(c => c.name === selectedCategory)?.subCategories || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubCategory) {
      alert("Please select both category and sub-category");
      return;
    }
    
    setLoading(true);

    // ተጠቃሚውን ማረጋገጥ
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to post a job");
      setLoading(false);
      return;
    }

    // ዳታውን ወደ Supabase መላክ
    const { error } = await supabase.from('jobs').insert([
      { 
        title, 
        description, 
        budget: parseInt(budget), 
        category: selectedCategory, 
        sub_category: selectedSubCategory, // አዲሱ ኮለም
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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-black italic text-white mb-8 uppercase tracking-tighter">
          Post a <span className="text-gold-500">New Job</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/70 mb-3 italic">Job Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Luxury Real Estate Web Development"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic placeholder:text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/70 mb-3 italic">Main Category</label>
              <select 
                required
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sub-Category Selection */}
            <div className={!selectedCategory ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity"}>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/70 mb-3 italic">Specialization</label>
              <select 
                required
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic appearance-none cursor-pointer"
              >
                <option value="">Select Sub-Category</option>
                {subCats.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/70 mb-3 italic">Budget ($)</label>
              <input 
                required
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic placeholder:text-slate-700"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/70 mb-3 italic">Project Description</label>
            <textarea 
              required
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the requirements and expectations in detail..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic placeholder:text-slate-700"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-2xl shadow-gold-500/20 active:scale-[0.98]"
          >
            {loading ? 'Processing...' : 'Deploy Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;