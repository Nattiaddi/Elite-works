import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, CreditCard, ShieldCheck } from 'lucide-react';

const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // የባላንስ መረጃ ማምጣት
      const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', user.id).single();
      if (wallet) setBalance(wallet.balance);

      // የትራንዛክሽን ታሪክ ማምጣት
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (txs) setTransactions(txs);
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Elite <span className="text-gold-500">Wallet</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Manage your funds and transactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Balance Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-gold-500 to-gold-700 rounded-[3rem] p-10 text-slate-950 shadow-2xl shadow-gold-500/20">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3 bg-slate-950/10 rounded-2xl backdrop-blur-md">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <ShieldCheck className="w-5 h-5 opacity-50" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total Available Balance</p>
                <h2 className="text-6xl font-black italic tracking-tighter mb-10">${balance.toLocaleString()}</h2>
                
                <div className="flex gap-4">
                  <button className="flex-1 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4 text-gold-500" /> Deposit
                  </button>
                  <button className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-slate-950 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/30 transition-all">
                    Withdraw
                  </button>
                </div>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Transaction History */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <History className="w-5 h-5 text-gold-500" />
                <h3 className="text-sm font-black uppercase italic tracking-widest">Recent Transactions</h3>
              </div>

              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center py-10 text-slate-600 text-[10px] font-bold uppercase italic tracking-widest">No transactions yet.</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800/50 rounded-2xl hover:border-gold-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase italic text-white">{tx.description || tx.type}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black italic ${tx.type === 'deposit' ? 'text-green-500' : 'text-white'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                        </p>
                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{tx.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem]">
              <CreditCard className="w-8 h-8 text-gold-500 mb-4" />
              <h4 className="text-xs font-black uppercase italic mb-2 text-white tracking-widest">Payment Methods</h4>
              <p className="text-[10px] text-slate-500 font-medium italic mb-6 leading-relaxed">
                Connect your bank account or card for instant deposits and secure payouts.
              </p>
              <button className="w-full border border-slate-800 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-gold-500/50 transition-all">
                Add Method
              </button>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gold-500/5 border border-gold-500/10">
              <h4 className="text-[10px] font-black uppercase italic text-gold-500 mb-4 tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Secure Escrow
              </h4>
              <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed">
                Elite Works uses an escrow system. Payments are held securely until the project is completed and approved.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;