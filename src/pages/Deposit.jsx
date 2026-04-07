import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    if (method === 'stripe') {
      // ለ Stripe ገና Backend ስላልሰራን ለጊዜው እንዲህ እናቆየው
      alert("Stripe Checkout coming soon! Use Crypto for now.");
      return;
    }

    if (method === 'crypto') {
      if (!txHash) return alert("Please enter the Transaction Hash/ID");
      
      setLoading(true);
      setStatus('Submitting for manual verification...');

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Transaction ታሪክ ውስጥ መመዝገብ
        const { error } = await supabase
          .from('transactions')
          .insert([
            { 
              user_id: user.id, 
              amount: parseFloat(amount), 
              type: 'deposit', 
              status: 'pending',
              metadata: { method: 'crypto', hash: txHash }
            }
          ]);

        if (error) throw error;
        setStatus('Deposit submitted! We will verify and update your balance. 🚀');
        setTxHash('');
        setAmount('');
      } catch (err) {
        setStatus('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen text-center">
      <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-4">
        Add <span className="text-gold-500">Funds</span>
      </h2>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12">Select your elite payment method</p>

      <div className="max-w-md mx-auto space-y-8">
        {/* Amount Input */}
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-500 font-black">$</span>
          <input 
            type="number" 
            placeholder="0.00" 
            className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 pl-12 text-2xl font-black text-white outline-none focus:border-gold-500 transition-all italic"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setMethod('stripe'); setStatus(''); }}
            className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${method === 'stripe' ? 'border-gold-500 bg-gold-500/5' : 'border-slate-800 bg-slate-900/40'}`}
          >
            <span className="text-3xl">💳</span>
            <span className="text-[10px] font-black uppercase text-white tracking-widest">Card / Stripe</span>
          </button>

          <button 
            onClick={() => { setMethod('crypto'); setStatus(''); }}
            className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${method === 'crypto' ? 'border-gold-500 bg-gold-500/5' : 'border-slate-800 bg-slate-900/40'}`}
          >
            <span className="text-3xl">₿</span>
            <span className="text-[10px] font-black uppercase text-white tracking-widest">Crypto (USDT)</span>
          </button>
        </div>

        {/* Crypto Details Area */}
        {method === 'crypto' && (
          <div className="mt-8 p-8 bg-slate-900 border border-gold-500/20 rounded-[2rem] text-left space-y-4 animate-in fade-in slide-in-from-bottom-4 transition-all">
            <h4 className="text-gold-500 font-black uppercase text-[10px] tracking-widest">USDT (TRC20) Address</h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 break-all select-all">
              <code className="text-[10px] text-slate-300">TYourActualCryptoWalletAddressHere123456</code>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase italic">Transaction Hash / ID</label>
              <input 
                type="text" 
                placeholder="Paste Hash here"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-gold-500"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
            </div>
          </div>
        )}

        <button 
          onClick={handlePayment}
          disabled={!amount || !method || (method === 'crypto' && !txHash) || loading}
          className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-gold-500/10 hover:bg-white transition-all disabled:opacity-30 active:scale-95"
        >
          {loading ? 'Processing...' : 'Complete Deposit'}
        </button>

        {status && (
          <p className="text-[10px] font-black uppercase italic text-gold-500 animate-pulse">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Deposit;