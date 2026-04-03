import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import { BadgeCheck, DollarSign, Globe, MessageSquare, Briefcase } from 'lucide-react';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      // 1. የፕሮፋይል መረጃ ማምጣት
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      // 2. የፖርትፎሊዮ ስራዎችን ማምጣት
      const { data: portfolioData } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('freelancer_id', id);

      setProfile(profileData);
      setPortfolio(portfolioData || []);
      setLoading(false);
    };

    fetchFullProfile();
  }, [id]);

  if (loading) return <div className="text-gold p-20 text-center animate-pulse">Loading Elite Talent...</div>;
  if (!profile) return <div className="text-white p-20 text-center">Profile not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      
      {/* Header Section: Profile & Verification */}
      <div className="bg-obsidian-soft rounded-3xl p-10 border border-white/5 flex flex-col md:flex-row gap-8 items-center shadow-2xl">
        <div className="w-32 h-32 bg-gold-gradient rounded-full border-4 border-obsidian shadow-xl flex-shrink-0 flex items-center justify-center text-4xl font-black">
          {profile.full_name?.charAt(0)}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">{profile.full_name}</h1>
            {profile.verification_status === 'verified' && (
              <BadgeCheck className="text-gold" size={28} />
            )}
          </div>
          <p className="text-gray-400 max-w-2xl leading-relaxed">{profile.bio}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
            <div className="flex items-center gap-2 text-gold font-bold bg-gold/10 px-4 py-2 rounded-full">
              <DollarSign size={18} /> <span>${profile.hourly_rate}/hr</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Briefcase size={18} /> <span>Elite Developer</span>
            </div>
          </div>
        </div>

        <button className="bg-gold text-black font-black px-10 py-4 rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
          <MessageSquare size={20} /> HIRE NOW
        </button>
      </div>

      {/* Portfolio Gallery */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-gold"></span> Portfolio Highlights
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((item) => (
            <div key={item.id} className="group bg-obsidian-soft rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all">
              <div className="h-56 bg-obsidian overflow-hidden relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 italic text-sm">No Preview Available</div>
                )}
                {item.project_link && (
                  <a href={item.project_link} target="_blank" rel="noreferrer" className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    <Globe size={20} />
                  </a>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {portfolio.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-gray-500 italic">
            This professional hasn't uploaded any portfolio pieces yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicProfile;