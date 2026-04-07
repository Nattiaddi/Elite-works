import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    skills: '',
    user_role: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        skills: profile.skills,
        updated_at: new Date()
      })
      .eq('id', user.id);

    if (error) setMessage("Error updating profile.");
    else setMessage("Profile updated successfully! ✨");
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-black italic text-white mb-2 uppercase tracking-tighter">
          My <span className="text-gold-500">Profile</span>
        </h2>
        <p className="text-slate-500 font-medium italic">Customize how the elite community sees you.</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl space-y-8">
        
        {/* Profile Identity */}
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-800/50">
          <div className="w-20 h-20 bg-gold-500 rounded-3xl flex items-center justify-center text-slate-950 text-3xl font-black italic">
            {profile.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-gold-500 font-black uppercase tracking-widest text-[10px] mb-1 italic">Role</p>
            <p className="text-white font-bold italic text-xl uppercase tracking-tighter">
              {profile.user_role || "User"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 italic">Full Name</label>
            <input 
              type="text" 
              value={profile.full_name || ''}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 italic">Skills (Comma separated)</label>
            <input 
              type="text" 
              value={profile.skills || ''}
              onChange={(e) => setProfile({...profile, skills: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic"
              placeholder="React, UI/UX, Node.js"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 italic">Bio / About Me</label>
          <textarea 
            rows="5"
            value={profile.bio || ''}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic"
            placeholder="Tell us about your elite expertise..."
          ></textarea>
        </div>

        <div className="flex items-center justify-between gap-6">
          <button 
            type="submit"
            className="flex-grow bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-xl shadow-gold-500/10"
          >
            Update Profile
          </button>
        </div>

        {message && (
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-gold-500 italic animate-bounce">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Profile;