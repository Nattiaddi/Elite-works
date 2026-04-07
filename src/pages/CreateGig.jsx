import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const CreateGig = () => {
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: 'Web Dev', delivery_days: 3 });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('gigs').insert([{
      ...formData,
      freelancer_id: user.id
    }]);

    if (!error) navigate('/gigs');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-black italic text-white mb-8 uppercase">Create <span className="text-gold-500">Service</span></h2>
      <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] space-y-6">
        <input 
          placeholder="I will..." 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white italic outline-none focus:border-gold-500"
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <textarea 
          placeholder="Service details..." 
          rows="5"
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white italic outline-none focus:border-gold-500"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        ></textarea>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" placeholder="Price ($)" 
            className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white italic outline-none focus:border-gold-500"
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
          <input 
            type="number" placeholder="Delivery (Days)" 
            className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white italic outline-none focus:border-gold-500"
            onChange={(e) => setFormData({...formData, delivery_days: e.target.value})}
          />
        </div>
        <button className="w-full bg-gold-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">Publish Service</button>
      </form>
    </div>
  );
};

export default CreateGig;