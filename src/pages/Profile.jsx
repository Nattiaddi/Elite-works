import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AddPortfolio from '../components/AddPortfolio'; // ይህ ኮምፖነንት እንዳለህ እርግጠኛ ሁን

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // እዚህ ጋር መሆን አለበት
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    title: '',
    skills: [],
    avatar_url: ''
  });
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      let { data: portfolioData } = await supabase
        .from('portfolios')
        .select('*')
        .eq('freelancer_id', user.id);

      if (portfolioData) setPortfolios(portfolioData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        title: profile.title,
        avatar_url: profile.avatar_url
      })
      .eq('id', user.id);

    if (!error) {
      setIsEditing(false);
      alert("Profile Updated!");
    } else {
      alert("Error updating profile");
    }
  };

  if (loading) return <div className="text-gold-500 text-center py-20 italic font-black uppercase tracking-widest">Loading Elite Profile...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="relative bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl mb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-[80px] rounded-full"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-gold-500 p-1">
              <img 
                src={profile.avatar_url || 'https://via.placeholder.com/150'} 
                className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all shadow-2xl shadow-gold-500/20"
                alt="Profile"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  className="bg-slate-950 border border-gold-500/30 text-white text-2xl font-black italic rounded-lg px-2 w-full outline-none"
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  placeholder="Full Name"
                />
                <input 
                  className="bg-slate-950 border border-slate-800 text-gold-500 text-sm italic rounded-lg px-2 w-full outline-none"
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  placeholder="Professional Title"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                  {profile.full_name || 'Elite Member'} 
                  <span className="ml-3 text-[10px] bg-gold-500 text-slate-950 px-3 py-1 rounded-full not-italic tracking-widest align-middle">PRO</span>
                </h1>
                <p className="text-gold-500 font-medium italic mt-2">{profile.title || 'Professional Freelancer'}</p>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="border border-gold-500/50 text-gold-500 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gold-500 hover:text-slate-950 transition-all"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-10">
          <section className="bg-slate-900/20 border border-slate-800/50 rounded-[2rem] p-8">
            <h3 className="text-white font-black italic uppercase text-xs tracking-widest mb-4">Biography</h3>
            {isEditing ? (
              <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-400 text-sm italic h-32 outline-none focus:border-gold-500/50"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            ) : (
              <p className="text-slate-400 text-sm leading-relaxed italic">
                {profile.bio || 'No biography added yet.'}
              </p>
            )}
          </section>

          <section className="bg-slate-900/20 border border-slate-800/50 rounded-[2rem] p-8">
            <h3 className="text-white font-black italic uppercase text-xs tracking-widest mb-4">Elite Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <span key={index} className="bg-slate-800 text-gold-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-black italic uppercase text-sm tracking-[0.3em]">Project Portfolio</h3>
            <button 
              onClick={() => setShowAddModal(true)}
              className="text-gold-500 font-black text-[10px] uppercase tracking-widest border border-gold-500/20 px-4 py-2 rounded-xl hover:bg-gold-500 hover:text-slate-950 transition-all"
            >
              + Add Work
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-2 transition-all hover:border-gold-500/50">
                <div className="h-48 w-full rounded-[1.5rem] overflow-hidden bg-slate-950">
                  <img src={item.image_url || 'https://via.placeholder.com/400x300'} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-5">
                  <h4 className="text-white font-black italic uppercase text-sm">{item.title}</h4>
                  <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="max-w-md w-full relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">✕</button>
            <AddPortfolio onComplete={() => { setShowAddModal(false); fetchProfileData(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;