import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    user_role: '',
    bio: '',
    skills: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
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
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        skills: profile.skills,
        phone: profile.phone
      })
      .eq('id', user.id);

    if (error) alert(error.message);
    else {
      alert("Profile updated successfully! ✨");
      setIsEditing(false);
    }
    setUpdating(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black animate-pulse italic">LOADING ELITE IDENTITY...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 blur-[100px] rounded-full -mr-48 -mt-48"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">My <span className="text-gold-500">Profile</span></h1>
            <p className="text-slate-500 text-sm font-medium italic mt-2">Manage your professional presence on Elite Works.</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-gold-500/50 transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Full Name</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-gold-500/50 outline-none transition-all"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Phone Number</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-gold-500/50 outline-none transition-all"
                    placeholder="+251..."
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Professional Bio</label>
                <textarea 
                  rows="4"
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-gold-500/50 outline-none transition-all"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Skills (Comma separated)</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-gold-500/50 outline-none transition-all"
                  placeholder="React, UI Design, Python..."
                  value={profile.skills}
                  onChange={(e) => setProfile({...profile, skills: e.target.value})}
                />
              </div>
              <button 
                disabled={updating}
                className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl shadow-gold-500/10"
              >
                {updating ? 'Updating...' : 'Save Elite Profile'}
              </button>
            </form>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gold-600 to-gold-400 rounded-[2rem] flex items-center justify-center text-3xl font-black text-slate-950 italic">
                  {profile.full_name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black italic">{profile.full_name}</h2>
                  <p className="text-gold-500 font-black uppercase tracking-[0.2em] text-[10px] italic">{profile.user_role} Member</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 pt-10 border-t border-slate-800/50">
                <div className="md:col-span-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 italic">About Me</h3>
                  <p className="text-slate-300 leading-relaxed italic">{profile.bio || "No bio added yet. Tell the world who you are!"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 italic">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills ? profile.skills.split(',').map((skill, index) => (
                      <span key={index} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-700">
                        {skill.trim()}
                      </span>
                    )) : <p className="text-slate-600 text-[10px] italic">No skills listed.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;