import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddPortfolio = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. ምስሉን ወደ Storage መጫን
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. የምስሉን Public URL ማግኘት
      const { data: { publicUrl } } = supabase.storage
        .from('portfolios')
        .getPublicUrl(filePath);

      // 3. መረጃውን ወደ portfolios ቴብል ማስገባት
      const { error: dbError } = await supabase
        .from('portfolios')
        .insert([{ 
          freelancer_id: user.id, 
          title, 
          image_url: publicUrl,
          category: 'Elite Work' 
        }]);

      if (dbError) throw dbError;
      
      alert("Project added to your portfolio!");
      onComplete(); // ገጹን እንዲያድስ (Refresh)
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-gold-500/20 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md">
      <h3 className="text-gold-500 font-black italic uppercase text-xs tracking-widest mb-6">Add Elite Project</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="text" 
          placeholder="Project Title" 
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-gold-500"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input 
          type="file" 
          accept="image/*"
          className="w-full text-slate-500 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-gold-500 file:text-slate-950"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button 
          disabled={uploading}
          className="w-full bg-gold-500 text-slate-950 font-black py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Publish to Portfolio'}
        </button>
      </form>
    </div>
  );
};

export default AddPortfolio;