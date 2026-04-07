import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Withdraw = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('wallets').select('balance').eq('id', user.id).single();
    if (data) setBalance(data.balance);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) > balance) return alert("Insufficient balance!");
    if (parseFloat(amount) < 10) return alert("Minimum withdrawal is $10");

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. ትራንዛክሽኑን መመዝገብ
      const { error } = await supabase.from('transactions').insert([{
        user_id: user.id,
        amount: parseFloat(amount),
        type: 'withdrawal',
        status: 'pending',
        metadata: { withdrawal_address: address }
      }]);

      if (error) throw error;

      // 2. ከባላንሱ ላይ ለጊዜው መቀነስ (Pending deduction)
      await supabase.from('wallets').update({ balance: balance - parseFloat(amount) }).eq('id', user.id);

      setStatus('Withdrawal request sent! Our team will process it within 24 hours.');
      setAmount('');
      setAddress('');
      fetchBalance();
    } catch (err) {
      setStatus('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] backdrop-blur-xl">
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2">Withdraw <span className="text-gold-500">Earnings</span></h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 italic text-gold-500/60">Available Balance: ${balance.toLocaleString()}</p>

        <form onSubmit={handleWithdraw} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase italic">Amount to Withdraw (USD)</label>
            <input type="number" placeholder="Min $10" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-gold-500 font-black italic" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase italic">Your USDT (TRC20) / Bank Details</label>
            <textarea placeholder="Enter your Wallet Address or International Bank Info" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-gold-500 text-xs italic" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <button disabled={loading} className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl shadow-gold-500/10 disabled:opacity-50">
            {loading ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
        {status && <p className="mt-6 text-[10px] text-gold-500 font-black uppercase text-center italic animate-pulse">{status}</p>}
      </div>
    </div>
  );
};

export default Withdraw;