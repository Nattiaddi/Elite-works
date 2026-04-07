import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch KYC Requests
      const { data: kyc } = await supabase.from('profiles').select('*').eq('kyc_status', 'under_review');
      
      // 2. Fetch Pending Deposits
      const { data: tx } = await supabase.from('transactions')
        .select('*, profiles(full_name)')
        .eq('status', 'pending')
        .eq('type', 'deposit');
      
      // 3. Fetch Pending Withdrawals
      const { data: wd } = await supabase.from('transactions')
        .select('*, profiles(full_name)')
        .eq('status', 'pending')
        .eq('type', 'withdrawal');

      setKycRequests(kyc || []);
      setDeposits(tx || []);
      setWithdraws(wd || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveKYC = async (userId) => {
    await supabase.from('profiles').update({ kyc_status: 'verified' }).eq('id', userId);
    fetchAdminData();
  };

  const approveDeposit = async (txId, userId, amount) => {
    // 1. Update Transaction status
    await supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
    // 2. Update User Wallet Balance
    const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', userId).single();
    await supabase.from('wallets').update({ balance: (wallet?.balance || 0) + amount }).eq('id', userId);
    fetchAdminData();
  };

  const processWithdraw = async (txId) => {
    // ማሳሰቢያ፡ ባላንሱ አስቀድሞ በ Withdraw.jsx ተቀንሷል፣ እዚህ Status ብቻ እንቀይራለን
    await supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
    fetchAdminData();
    alert("Withdrawal marked as completed!");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-gold-500 font-black tracking-[0.5em] animate-pulse">ACCESSING SECURE SERVER...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">
          Elite <span className="text-gold-500">Command Center</span>
        </h2>
        <button onClick={fetchAdminData} className="text-[10px] font-black text-gold-500 uppercase border border-gold-500/20 px-4 py-2 rounded-lg hover:bg-gold-500/10 transition-all">Refresh Data</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 1. KYC Approvals */}
        <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem]">
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
            Pending Verifications ({kycRequests.length})
          </h3>
          <div className="space-y-4">
            {kycRequests.length === 0 && <p className="text-slate-600 italic text-xs uppercase font-bold text-center py-10">No pending KYC</p>}
            {kycRequests.map(user => (
              <div key={user.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-white font-bold italic text-sm">{user.full_name}</p>
                  <a href={`${supabase.storage.from('kyc-documents').getPublicUrl(user.id_url).data.publicUrl}`} target="_blank" rel="noreferrer" className="text-gold-500 text-[9px] uppercase font-black hover:underline">View Document</a>
                </div>
                <button onClick={() => approveKYC(user.id)} className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">Verify User</button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Deposit Approvals */}
        <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem]">
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-gold-500 rounded-full animate-ping"></span>
            Pending Deposits ({deposits.length})
          </h3>
          <div className="space-y-4">
            {deposits.length === 0 && <p className="text-slate-600 italic text-xs uppercase font-bold text-center py-10">No pending deposits</p>}
            {deposits.map(tx => (
              <div key={tx.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-bold italic text-sm">{tx.profiles?.full_name}</p>
                    <p className="text-gold-500 font-black text-xl">${tx.amount}</p>
                  </div>
                  <button onClick={() => approveDeposit(tx.id, tx.user_id, tx.amount)} className="bg-gold-500 text-slate-950 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-white transition-all">Approve Fund</button>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <p className="text-[8px] text-slate-500 uppercase mb-1 font-black">Transaction Metadata:</p>
                  <p className="text-[10px] text-slate-400 break-all font-mono">{tx.metadata?.hash || 'Manual/Stripe'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Withdrawal Requests (ሙሉው ስፋት እንዲይዝ ታች ተቀምጧል) */}
        <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] lg:col-span-2">
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Withdrawal Requests ({withdraws.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {withdraws.length === 0 && <p className="text-slate-600 italic text-xs uppercase font-bold text-center py-10 md:col-span-2">No pending withdrawals</p>}
            {withdraws.map(req => (
              <div key={req.id} className="bg-slate-950 p-6 rounded-2xl border border-red-500/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-bold italic text-sm">{req.profiles?.full_name}</p>
                    <p className="text-red-500 font-black text-xl">-${req.amount}</p>
                  </div>
                  <button onClick={() => processWithdraw(req.id)} className="bg-white text-slate-950 px-5 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-gold-500 transition-all">Mark as Paid</button>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-[8px] text-slate-500 uppercase mb-1 font-black italic">Payment Destination:</p>
                  <p className="text-[10px] text-slate-300 break-all italic">{req.metadata?.withdrawal_address}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;