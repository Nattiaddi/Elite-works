import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import WithdrawalRequest from './WithdrawalRequest';
import { Wallet, History, Plus, ArrowUpRight } from 'lucide-react';

const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', user.id).single();
    if (wallet) setBalance(wallet.balance);
    setLoading(false);
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {showWithdrawForm ? (
          <WithdrawalRequest 
            balance={balance} 
            onBack={() => setShowWithdrawForm(false)} 
            fetchBalance={fetchWalletData}
          />
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Elite <span className="text-gold-500">Wallet</span></h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Balance Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gold-500 to-gold-700 rounded-[3rem] p-10 text-slate-950 shadow-2xl shadow-gold-500/20">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Total Balance</p>
                  <h2 className="text-6xl font-black italic tracking-tighter mb-10">${balance.toLocaleString()}</h2>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4 text-gold-500" /> Deposit
                    </button>
                    <button 
                      onClick={() => setShowWithdrawForm(true)} 
                      className="flex-1 bg-white/20 text-slate-950 py-4 rounded-2xl font-black uppercase text-[10px] border border-white/30 backdrop-blur-md"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Recent Transactions Placeholder */}
                <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <History className="w-5 h-5 text-gold-500" />
                    <h3 className="text-sm font-black uppercase italic tracking-widest text-white">Recent Transactions</h3>
                  </div>
                  <p className="text-center py-10 text-slate-600 text-[10px] font-bold uppercase italic tracking-widest">Your transactions will appear here.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;