import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SANTIMShop = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const packages = [
    { id: 'starter', name: 'Elite Starter', amount: 10, price: 100, color: 'border-slate-800' },
    { id: 'pro', name: 'Elite Pro', amount: 50, price: 400, color: 'border-gold-500', popular: true },
    { id: 'executive', name: 'Executive', amount: 150, price: 1000, color: 'border-slate-800' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(data);
  };

  const handlePurchase = async (pkg) => {
    setLoading(true);
    try {
      // ለጊዜው በStripe ፈንታ በቀጥታ ባላንስ እንዲጨምር እናድርገው (Testing)
      // ክፍያው ሲጠናቀቅ ይህ ሎጂክ ሰርቨር ላይ ነው የሚሰራው
      const { data: { user } } = await supabase.auth.getUser();
      const newBalance = (profile.santim || 0) + pkg.amount;

      const { error } = await supabase
        .from('profiles')
        .update({ santim: newBalance })
        .eq('id', user.id);

      if (!error) {
        alert(`Success! ${pkg.amount} SANTIM added to your vault.`);
        setProfile({ ...profile, santim: newBalance });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">SANTIM <span className="text-gold-500">Shop</span></h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic">Fuel your elite career. Acquire bidding power.</p>
        
        <div className="mt-8 inline-flex items-center gap-4 bg-slate-900/50 border border-slate-800 px-8 py-3 rounded-full backdrop-blur-xl">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Current Balance:</span>
          <span className="text-gold-500 font-black italic">{profile?.santim || 0} SANTIM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`relative bg-slate-900/40 border-2 ${pkg.color} rounded-[3rem] p-10 backdrop-blur-md transition-all hover:scale-105 group overflow-hidden`}
          >
            {pkg.popular && (
              <div className="absolute top-8 -right-12 bg-gold-500 text-slate-950 font-black text-[8px] uppercase tracking-widest py-1 px-12 rotate-45 shadow-2xl">
                Best Value
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-white font-black italic uppercase text-sm tracking-widest mb-1">{pkg.name}</h3>
              <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest italic">Bidding Package</p>
            </div>

            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-6xl font-black text-white italic">{pkg.amount}</span>
              <span className="text-gold-500 font-black italic text-xs uppercase">Santim</span>
            </div>

            <div className="space-y-4 mb-10 text-[10px] text-slate-400 font-bold uppercase italic tracking-widest">
              <p className="flex items-center gap-2"><span className="text-gold-500">✓</span> Priority Bidding</p>
              <p className="flex items-center gap-2"><span className="text-gold-500">✓</span> Elite Badge Status</p>
              <p className="flex items-center gap-2"><span className="text-gold-500">✓</span> Lifetime Expiry</p>
            </div>

            <button 
              onClick={() => handlePurchase(pkg)}
              disabled={loading}
              className="w-full bg-transparent border border-gold-500/50 text-gold-500 font-black py-5 rounded-2xl uppercase text-[10px] tracking-[0.3em] hover:bg-gold-500 hover:text-slate-950 transition-all shadow-lg group-hover:shadow-gold-500/10"
            >
              Acquire for ETB {pkg.price}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-20 text-center text-slate-700 font-black italic uppercase text-[9px] tracking-[0.5em]">Secure Elite Encrypted Transaction System</p>
    </div>
  );
};

export default SANTIMShop;