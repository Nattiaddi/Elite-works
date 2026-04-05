import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [jobData, setJobData] = useState({ title: '', description: '', budget: '', category: '' });
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('jobs').insert([
      { ...jobData, client_id: user.id }
    ]);

    if (error) alert(error.message);
    else {
      alert("ሥራው በትክክል ተለጥፏል!");
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-gold-500/20 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gold-500 mb-8">አዲስ ሥራ ይለጥፉ</h2>
        
        <form onSubmit={handlePost} className="space-y-6">
          <div>
            <label className="block text-gold-200 mb-2 font-medium">የሥራው ርዕስ (Job Title)</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 focus:border-gold-500 outline-none transition-all"
              placeholder="ለምሳሌ፦ የድርጅት ሎጎ ዲዛይን"
              onChange={(e) => setJobData({...jobData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-gold-200 mb-2 font-medium">ዝርዝር መግለጫ (Description)</label>
            <textarea 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 focus:border-gold-500 outline-none h-40"
              placeholder="ስለ ሥራው በዝርዝር ይግለጹ..."
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gold-200 mb-2 font-medium">ክፍያ (Budget)</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 focus:border-gold-500 outline-none"
                placeholder="ለምሳሌ፦ 2000 ETB"
                onChange={(e) => setJobData({...jobData, budget: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gold-200 mb-2 font-medium">ዘርፍ (Category)</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 focus:border-gold-500 outline-none"
                onChange={(e) => setJobData({...jobData, category: e.target.value})}
              >
                <option value="Graphics">ግራፊክስ ዲዛይን</option>
                <option value="Web">ዌብ ሳይት ልማት</option>
                <option value="Writing">ጽሁፍ እና ትርጉም</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-bold py-4 rounded-xl hover:scale-[1.01] transition-transform text-lg shadow-lg shadow-gold-600/10">
            ሥራውን አሁኑኑ ልጥፍ
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;