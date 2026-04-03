import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';
import { ImagePlus, Link as LinkIcon, Plus } from 'lucide-react';

const AddPortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', link: '' });
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      let publicUrl = '';

      // 1. ምስሉን መጫን
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // የሕዝብ ሊንኩን (Public URL) ማግኘት
        const { data: urlData } = supabase.storage.from('portfolios').getPublicUrl(fileName);
        publicUrl = urlData.publicUrl;
      }

      // 2. ዳታቤዝ ላይ መረጃውን መመዝገብ
      const { error } = await supabase.from('portfolio_items').insert([
        {
          freelancer_id: user.id,
          title: formData.title,
          description: formData.description,
          project_link: formData.link,
          image_url: publicUrl
        }
      ]);

      if (error) throw error;
      alert("Elite Project Added to Portfolio!");
      
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-obsidian-soft p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Plus className="text-gold" /> Add New Project
      </h3>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="text" 
          placeholder="Project Title (e.g. E-commerce App)"
          className="w-full bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />

        <textarea 
          placeholder="Short description of your role..."
          className="w-full bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold h-32"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <div className="relative">
          <LinkIcon className="absolute left-4 top-4 text-gray-500" size={18} />
          <input 
            type="url" 
            placeholder="Live Project Link (Optional)"
            className="w-full bg-obsidian border border-white/10 p-4 pl-12 rounded-xl text-white outline-none focus:border-gold"
            onChange={(e) => setFormData({...formData, link: e.target.value})}
          />
        </div>

        <div className="border-2 border-dashed border-white/10 p-8 rounded-2xl text-center hover:border-gold/50 transition-all cursor-pointer">
          <input 
            type="file" 
            id="portfolio-image" 
            className="hidden" 
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="portfolio-image" className="cursor-pointer">
            <ImagePlus className="mx-auto text-gray-500 mb-2" size={32} />
            <p className="text-gray-400 text-sm">
              {image ? image.name : "Upload Project Screenshot (PNG, JPG)"}
            </p>
          </label>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gold-gradient text-black font-black py-4 rounded-xl hover:opacity-90 transition-all"
        >
          {loading ? "ADDING PROJECT..." : "PUBLISH TO PORTFOLIO"}
        </button>
      </form>
    </div>
  );
};

export default AddPortfolio;