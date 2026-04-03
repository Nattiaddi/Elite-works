import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';

const BuildProfile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    hourly_rate: '',
    skills: '' // በኮማ የተለዩ ክህሎቶች
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      bio: profile.bio,
      hourly_rate: parseInt(profile.hourly_rate),
      skills: profile.skills.split(',').map(s => s.trim())
    }).eq('id', user.id);

    if (!error) alert("Elite Profile Updated!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-obsidian-soft p-10 rounded-3xl border border-white/5">
      <h2 className="text-3xl font-bold text-white mb-8">Build Your Elite Identity</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="text-gray-500 text-sm">Professional Title & Bio</label>
          <textarea 
            className="w-full mt-2 bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
            placeholder="Ex: Senior Full Stack Developer with 5 years experience..."
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <input 
            type="number" 
            placeholder="Hourly Rate ($)"
            className="bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
            onChange={(e) => setProfile({...profile, hourly_rate: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Skills (React, Node, Figma)"
            className="bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
            onChange={(e) => setProfile({...profile, skills: e.target.value})}
          />
        </div>
        <button className="w-full bg-gold text-black font-black py-4 rounded-xl">SAVE PROFILE</button>
      </form>
    </div>
  );
};