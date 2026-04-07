import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    phone: '',
    user_role: 'freelancer'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
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
    getProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) alert("Error updating profile: " + error.message);
    else alert("Profile updated successfully! ✨");
    setUpdating(false);
  };

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl">
        <h2 className="text-3xl font-black italic text-white mb-8 uppercase tracking-tighter">
          Edit <span className="text-gold-500">Profile</span>
        </h2>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Name & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">Full Name</label>
              <input 
                type="text" 
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic font-medium"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">Your Role</label>
              <select 
                disabled
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-500 outline-none italic font-medium cursor-not-allowed"
                value={profile.user_role}
              >
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">Bio / About You</label>
            <textarea 
              rows="4"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic font-medium"
              placeholder="Tell us about your elite skills..."
            ></textarea>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">Phone Number</label>
            <input 
              type="text" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-gold-500 outline-none transition-all italic font-medium"
              placeholder="+251 9..."
            />
          </div>

          {/* Submit Button */}
          <button 
            disabled={updating}
            type="submit"
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-2xl shadow-gold-500/10 active:scale-95"
          >
            {updating ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;