import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Code, FileText, Save, CheckCircle2, ArrowLeft } from 'lucide-react';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    skills: [],
    user_role: ''
  });
  
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        bio: data.bio || '',
        skills: data.skills || [],
        user_role: data.user_role || ''
      });
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
        updated_at: new Date()
      })
      .eq('id', user.id);

    if (error) alert(error.message);
    else {
      alert("Profile updated successfully! Elite Terminal Synced.");
      navigate('/dashboard');
    }
    setUpdating(false);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput && !profile.skills.includes(skillInput)) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black italic text-gold-500 animate-pulse tracking-widest uppercase text-xs">
      Loading Profile Data...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 pt-32 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-gold-500 transition-colors text-[10px] font-black uppercase tracking-widest mb-10 italic">
          <ArrowLeft size={16} /> Return to Suite
        </button>

        <div className="relative mb-12">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter relative z-10">
            Edit <span className="text-gold-500 font-black">Identity</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic mt-2">Personal & Professional Synchronization</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          
          {/* Full Name */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold-500 italic">
              <User size={14} /> Full Name
            </label>
            <input 
              type="text" 
              value={profile.full_name}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-black italic focus:border-gold-500/50 transition-all outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Bio */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold-500 italic">
              <FileText size={14} /> Professional Bio
            </label>
            <textarea 
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows="4"
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-medium italic focus:border-gold-500/50 transition-all outline-none resize-none leading-relaxed"
              placeholder="Tell us about your professional journey..."
            />
          </div>

          {/* Skills Management */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl space-y-6">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold-500 italic">
              <Code size={14} /> Skill Arsenal
            </label>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                className="flex-1 bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-black italic focus:border-gold-500/50 transition-all outline-none"
                placeholder="e.g. React, UI/UX, Node.js"
              />
              <button 
                onClick={addSkill}
                className="bg-white/5 hover:bg-gold-500 hover:text-slate-950 px-6 rounded-2xl transition-all font-black uppercase italic text-[10px] border border-white/5"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="bg-gold-500/10 border border-gold-500/20 text-gold-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2 group hover:border-red-500/50 hover:text-red-500 transition-all cursor-pointer"
                  onClick={() => removeSkill(skill)}
                >
                  {skill} <span className="opacity-0 group-hover:opacity-100">×</span>
                </span>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            disabled={updating}
            className="w-full bg-gold-500 text-slate-950 p-6 rounded-[2rem] font-black uppercase italic text-[12px] tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gold-500/20 flex items-center justify-center gap-3"
          >
            {updating ? 'Synchronizing...' : <><Save size={18} /> Update Professional Profile</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;