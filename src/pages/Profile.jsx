import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    portfolio_url: '',
    skills: ''
  });

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
    }
    setLoading(false);
  }

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const updates = {
      id: user.id,
      ...profile,
      updated_at: new Date(),
    };

    let { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else alert('ፕሮፋይልዎ በትክክል ተስተካክሏል!');
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-gold-500/20 p-8 rounded-3xl">
        <h2 className="text-3xl font-bold text-gold-500 mb-6">የእኔ ፕሮፋይል እና ፖርትፎሊዮ</h2>
        
        <form onSubmit={updateProfile} className="space-y-6">
          <div>
            <label className="block text-gold-200 mb-2">ሙሉ ስም</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:border-gold-500 outline-none"
              value={profile.full_name}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gold-200 mb-2">ስለ እኔ (Bio)</label>
            <textarea 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:border-gold-500 outline-none h-32"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              placeholder="ስለ ሙያዎ እና ልምድዎ አጭር መግለጫ ይጻፉ..."
            />
          </div>

          <div>
            <label className="block text-gold-200 mb-2">የፖርትፎሊዮ ሊንክ (GitHub/Website)</label>
            <input 
              type="url" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:border-gold-500 outline-none"
              value={profile.portfolio_url}
              onChange={(e) => setProfile({...profile, portfolio_url: e.target.value})}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-gold-500/20"
          >
            {loading ? 'በመጫን ላይ...' : 'መረጃውን አስቀምጥ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;