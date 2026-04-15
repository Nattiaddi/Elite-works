import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Landmark, DollarSign, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const WithdrawalRequest = ({ balance, onBack, fetchBalance }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) > balance) return alert("Insufficient balance!");
    if (parseFloat(amount) < 10) return alert("Minimum withdrawal is $10");

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('transactions').insert([{
        user_id: user.id,
        amount: parseFloat(amount),
        type: 'withdrawal',
        status: 'pending',
        description: `Withdrawal request to: ${address}`,
        metadata: { withdrawal_address: address }
      }]);

      if (error) throw error;

      // ባላንስን መቀነስ
      await supabase.from('wallets').update({ balance: balance - parseFloat(amount) }).eq('id', user.id);

      setStatus('success');
      fetchBalance(); // ዋናው ገጽ ላይ ባላንሱን እንዲያድስ
      setTimeout(() => onBack(), 3000); // ከ3 ሰከንድ በኋላ ወደ ኋላ ይመልሰዋል
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-12 text-center">
        <div className="w-20 h-20 bg-green-500/20 border border-green-500/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-black italic uppercase text-white mb-2">Request Sent!</h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Our team will process it within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-10 backdrop-blur-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-gold-500 transition-colors text-[9px] font-black uppercase mb-8">
        <ArrowLeft className="w-3 h-3" /> Back to Wallet
      </button>

      <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2">Withdraw <span className="text-gold-500">Earnings</span></h2>
      <p className="text-gold-500/60 text-[10px] font-black uppercase mb-10 italic">Available Balance: ${balance.toLocaleString()}</p>

      <form onSubmit={handleWithdraw} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase italic ml-2">Amount to Withdraw (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
            <input type="number" required placeholder="Min $10" className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 p-5 text-white outline-none focus:border-gold-500 font-black italic" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase italic ml-2">USDT Address / Bank Info</label>
          <textarea required placeholder="Enter Wallet Address or Bank Details" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-gold-500 text-xs italic" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <button disabled={loading} className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl shadow-gold-500/10">
          {loading ? 'Processing...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalRequest;