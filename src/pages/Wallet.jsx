import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// 1. Deposit Modal Component
const DepositModal = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/80">
      <div className="bg-slate-900 border border-gold-500/30 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors text-xl font-bold">×</button>
        <h3 className="text-2xl font-black italic text-white mb-2 uppercase tracking-tighter">
          Deposit <span className="text-gold-500">Assets</span>
        </h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 italic">Secure Treasury Funding</p>
        <div className="space-y-6">
          <div>
            <label className="block text-gold-500/70 text-[10px] font-black uppercase tracking-[0.2em] mb-3 italic">Amount to Deposit (USD)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 font-black italic">$</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-5 py-4 text-white text-xl font-black focus:border-gold-500 outline-none transition-all italic placeholder:text-slate-800"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[100, 500, 1000].map((val) => (
              <button key={val} onClick={() => setAmount(val)} className="bg-slate-800/50 border border-slate-700 text-slate-300 py-2 rounded-xl text-[10px] font-black hover:border-gold-500 transition-all italic">+${val}</button>
            ))}
          </div>
          <button onClick={() => onConfirm(amount)} className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl shadow-gold-500/20 active:scale-95">
            Proceed to Secure Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Main Wallet Component
const Wallet = () => {
  const [balance, setBalance] = useState(0.00);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (data) setBalance(data.balance);
    } catch (err) {
      console.error('Wallet fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositConfirm = (amount) => {
    console.log("Starting Stripe payment for:", amount);
    // Stripe logic እዚህ ጋር ይገባል
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen bg-slate-950 text-white">
      <div className="mb-12">
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">
          Elite <span className="text-gold-500">Wallet</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-gold-500/20 p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-gold-500/5">
          <div className="relative z-10">
            <p className="text-gold-500/70 text-[10px] font-black uppercase tracking-[0.4em] mb-6 italic">Current Assets</p>
            <h3 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter flex items-baseline gap-4">
              ${loading ? '...' : balance.toLocaleString()}
              <span className="text-gold-500 text-2xl not-italic font-bold tracking-widest uppercase">USD</span>
            </h3>
            <div className="flex flex-wrap gap-5 mt-14">
              <button onClick={() => setIsModalOpen(true)} className="bg-gold-500 text-slate-950 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl shadow-gold-500/20 active:scale-95">
                Deposit Funds
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3.5rem] backdrop-blur-sm">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8 italic border-b border-slate-800 pb-4">Recent Activity</h4>
          <p className="text-slate-500 text-[10px] italic uppercase tracking-widest text-center py-20">No history yet</p>
        </div>
      </div>

      <DepositModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDepositConfirm} />
    </div>
  );
};

export default Wallet;