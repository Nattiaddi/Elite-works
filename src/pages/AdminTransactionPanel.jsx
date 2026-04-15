import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle, XCircle, Clock, Landmark, User, DollarSign, ExternalLink } from 'lucide-react';

const AdminTransactionPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles:user_id (full_name, email)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setTransactions(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus, userId, amount) => {
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus} this transaction?`);
    if (!confirmAction) return;

    // 1. የትራንዛክሽኑን ስታተስ ማዘመን
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', id);

    if (updateError) return alert("Update failed!");

    // 2. ጥያቄው ውድቅ (Rejected) ከሆነ ገንዘቡን ለተጠቃሚው መመለስ
    if (newStatus === 'failed') {
      const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', userId).single();
      await supabase.from('wallets').update({ balance: wallet.balance + amount }).eq('id', userId);
    }

    fetchPendingTransactions();
    alert(`Transaction ${newStatus} successfully!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Finance <span className="text-gold-500">Requests</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Manage user withdrawals and payments</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl">
             <span className="text-gold-500 font-black italic">{transactions.length}</span> <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Pending Requests</span>
          </div>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p className="text-center py-20 animate-pulse text-gold-500 font-black italic uppercase">Loading Transactions...</p>
          ) : transactions.length === 0 ? (
            <div className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-20 text-center">
              <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-black italic uppercase text-xs tracking-widest">No pending transactions found.</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 hover:border-gold-500/30 transition-all group">
                <div className="flex flex-wrap justify-between gap-6">
                  {/* User Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-gold-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black italic uppercase text-white">{tx.profiles?.full_name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold italic">{tx.profiles?.email}</p>
                    </div>
                  </div>

                  {/* Amount & Type */}
                  <div className="min-w-[150px]">
                    <div className="flex items-center gap-2 text-gold-500 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xl font-black italic">${tx.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">{tx.type}</p>
                  </div>

                  {/* Withdrawal Info */}
                  <div className="flex-1 min-w-[250px] bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Landmark className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase italic tracking-widest">Payout Destination:</span>
                    </div>
                    <p className="text-[10px] text-white font-medium italic leading-relaxed break-all">
                      {tx.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(tx.id, 'completed', tx.user_id, tx.amount)}
                      className="p-4 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all group-hover:scale-105"
                      title="Approve & Mark as Paid"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(tx.id, 'failed', tx.user_id, tx.amount)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all group-hover:scale-105"
                      title="Reject & Refund"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-600 italic">
                  <span>Transaction ID: {tx.id}</span>
                  <span>Requested on: {new Date(tx.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionPanel;