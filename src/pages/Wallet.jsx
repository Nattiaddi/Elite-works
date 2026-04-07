import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Wallet = () => {
  const [balance, setBalance] = useState(0.00);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', user.id)
      .single();
    
    if (data) setBalance(data.balance);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-12">
        Elite <span className="text-gold-500">Wallet</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-gold-500/20 p-12 rounded-[3rem] relative overflow-hidden shadow-2xl shadow-gold-500/5">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl italic font-black text-gold-500">ELITE</div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Available Balance</p>
          <h3 className="text-7xl font-black text-white italic tracking-tighter">
            ${loading ? '...' : balance.toLocaleString()} <span className="text-gold-500 text-2xl not-italic">USD</span>
          </h3>
          
          <div className="flex gap-4 mt-12">
            <button className="bg-gold-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
              Deposit Funds
            </button>
            <button className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all italic">
              Withdraw
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem]">
          <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-6 italic">Recent Activity</h4>
          <div className="space-y-6">
             <p className="text-slate-500 text-[10px] italic uppercase tracking-widest text-center py-10">No recent transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;