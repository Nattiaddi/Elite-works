import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  User, Mail, Briefcase, Award, Save, 
  Camera, ShieldCheck, Banknote, CheckCircle 
} from 'lucide-react';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    skills: [],
    user_role: '',
    bank_details: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) {
      alert("ስህተት ተፈጥሯል፦ " + error.message);
    } else {
      alert("ፕሮፋይልህ በትክክል ተስተካክሏል!");
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black italic text-gold-500 animate-pulse tracking-widest uppercase text-xs">
      Loading Secure Profile...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        <header className="pt-24 pb-12 px-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              Account <span className="text-gold-500">Settings</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4">
              Manage your elite identity and preferences
            </p>
          </div>
        </header>

        <main className="px-10 max-w-5xl w-full">
          <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left: Avatar & Role */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] text-center relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gold-500 rounded-3xl mx-auto flex items-center justify-center text-slate-950 text-4xl font-black mb-4 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                    {profile.full_name?.charAt(0) || 'U'}
                  </div>
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-gold-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                    <Camera size={12} /> Change Photo
                  </button>
                  <h3 className="mt-6 text-xl font-black italic uppercase">{profile.full_name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{profile.user_role}</p>
                </div>
              </div>

              <div className="bg-gold-500/5 border border-gold-500/10 p-6 rounded-[2.5rem]">
                 <h4 className="text-[10px] font-black uppercase text-gold-500 mb-2 flex items-center gap-2">
                    <ShieldCheck size={14} /> Verification Status
                 </h4>
                 <p className="text-white font-bold italic text-sm">Verified Elite Member</p>
              </div>
            </div>

            {/* Right: Forms */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* General Info */}
              <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem] space-y-6 backdrop-blur-md">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic mb-4">General Information</h3>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text" 
                      value={profile.full_name}
                      onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Professional Bio</label>
                  <textarea 
                    rows="4"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell the world about your expertise..."
                    className="w-full bg-slate-950/50 border border-white/5 rounded-3xl px-6 py-4 text-sm font-medium focus:border-gold-500 outline-none transition-all italic"
                  />
                </div>
              </div>

              {/* Financial & Professional */}
              <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem] space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic mb-4">Financial & Professional</h3>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Bank Account Details (CBE/Telebirr)</label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text" 
                      placeholder="Account Number or Wallet Phone"
                      value={profile.bank_details}
                      onChange={(e) => setProfile({...profile, bank_details: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={updating}
                    className="w-full bg-gold-500 text-slate-950 font-black uppercase italic py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(212,175,55,0.1)] disabled:opacity-50"
                  >
                    {updating ? 'Processing...' : (
                      <>Save Changes <CheckCircle size={18} /></>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ProfileUpdate;