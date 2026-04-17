import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import PaymentGateway from '../components/PaymentGateway'; // ኢምፖርት መደረጉን ያረጋግጡ
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Plus,
  ShieldCheck,
  X // መዝጊያ አይኮን
} from 'lucide-react';

const Wallet = () => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(100); // Default amount

  useEffect(() => {
    const fetchWalletData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(userData);

      const { data: transData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setTransactions(transData || []);
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        <header className="pt-24 pb-12 px-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Elite <span className="text-gold-500">Wallet</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4">
            Secure your assets and manage transactions
          </p>
        </header>

        <main className="px-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Dashboard Left: Balance & Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-gold-500 to-gold-700 rounded-[3rem] p-10 text-slate-950 shadow-2xl shadow-gold-500/20 group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3 bg-slate-950/10 rounded-2xl backdrop-blur-md">
                    <WalletIcon className="w-6 h-6" />
                  </div>
                  <ShieldCheck className="w-5 h-5 opacity-50" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Available Balance</p>
                <h2 className="text-5xl font-black italic tracking-tighter mb-10">
                  ${profile?.balance?.toLocaleString() || "0.00"}
                </h2>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsDepositModalOpen(true)}
                    className="flex-1 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-gold-500" /> Deposit
                  </button>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            </div>

            <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm">
              <div className="flex items-center gap-4 text-gold-500 mb-4">
                <ShieldCheck size={24} />
                <h4 className="font-black italic uppercase tracking-tight">Escrow Security</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase italic tracking-wider">
                Payments are held in a secure escrow system until the project milestones are approved.
              </p>
            </div>
          </div>

          {/* Dashboard Right: History */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <History size={20} className="text-gold-500" /> Recent History
                </h3>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-center py-10 text-gold-500 animate-pulse font-black uppercase italic text-[10px]">Syncing transactions...</p>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-6 bg-slate-950/50 border border-white/5 rounded-2xl hover:border-gold-500/20 transition-all">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gold-500/10 text-gold-500'
                        }`}>
                          {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className="font-black italic uppercase text-xs">{tx.description || tx.type}</p>
                          <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest mt-1">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black italic ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-white'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                        </p>
                        <p className="text-[7px] font-black uppercase text-slate-700 tracking-[0.2em]">{tx.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-20">
                    <CreditCard size={48} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Transactions Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- አዲሱ እና የተስተካከለው Payment Modal --- */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="relative w-full max-w-xl my-auto py-10">
            {/* መዝጊያ ቁልፍ */}
            <button 
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-0 right-0 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors"
            >
              Close <X size={18} />
            </button>

            {/* የጌትዌይ መጥሪያ */}
            <PaymentGateway 
              amount={depositAmount} 
              userProfile={profile} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;