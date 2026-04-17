import React, { useState, useEffect } from 'react';
import { Smartphone, CreditCard, ShieldCheck, Lock, Loader2, ChevronRight } from 'lucide-react';

const PaymentGateway = ({ amount, userProfile }) => {
  const [method, setMethod] = useState(null); // 'chapa' or 'paypal'
  const [loading, setLoading] = useState(false);

  // --- Chapa Logic ---
  const handleChapaPayment = () => {
    setLoading(true);
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://api.chapa.co/v1/transaction/initialize';

    const fields = {
      'public_key': 'CHAPAPUBK_TEST-0fH9OsaazSUFelVaUEKarX5yj7luxMS5', // የ Chapa Public Key እዚህ ይተኩ
      'amount': amount.toString(),
      'currency': 'ETB',
      'email': userProfile?.email || 'customer@gmail.com',
      'first_name': userProfile?.full_name?.split(' ')[0] || 'Elite',
      'last_name': userProfile?.full_name?.split(' ')[1] || 'User',
      'tx_ref': `tx-elite-${Date.now()}`,
      'return_url': window.location.origin + "/wallet",
      'customization[title]': 'Elite Works Payment',
    };

    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  // --- PayPal Script Loading ---
  useEffect(() => {
    if (method === 'paypal') {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID"; // የ PayPal Client ID እዚህ ይተኩ
      script.addEventListener("load", () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: amount.toString() } }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              alert("Transaction completed by " + details.payer.name.given_name);
            });
          }
        }).render("#paypal-button-container");
      });
      document.body.appendChild(script);
    }
  }, [method, amount]);

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[8px] font-black uppercase tracking-widest mb-4">
          <Lock size={10} /> Secure Checkout
        </div>
        <h2 className="text-2xl font-black italic uppercase text-white mb-1">Select Gateway</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Total: ${amount} / ETB {amount * 115 /* ግምት */}</p>
      </div>

      <div className="space-y-4">
        {/* CHAPA Option */}
        <button 
          onClick={() => setMethod('chapa')}
          className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${method === 'chapa' ? 'border-gold-500 bg-gold-500/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase italic text-white tracking-wider">Chapa (Ethiopia)</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight mt-1">Telebirr, CBE, Local Banks</p>
            </div>
          </div>
          <ChevronRight size={16} className={method === 'chapa' ? 'text-gold-500' : 'text-slate-700'} />
        </button>

        {/* PAYPAL Option */}
        <button 
          onClick={() => setMethod('paypal')}
          className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${method === 'paypal' ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase italic text-white tracking-wider">PayPal (Global)</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight mt-1">International Credit Cards</p>
            </div>
          </div>
          <ChevronRight size={16} className={method === 'paypal' ? 'text-blue-500' : 'text-slate-700'} />
        </button>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5">
        {method === 'chapa' && (
          <button 
            onClick={handleChapaPayment}
            disabled={loading}
            className="w-full bg-gold-500 text-slate-950 py-4 rounded-xl font-black uppercase italic text-[10px] tracking-[0.2em] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Confirm & Pay with Chapa'}
          </button>
        )}

        {method === 'paypal' && (
          <div id="paypal-button-container" className="min-h-[150px]"></div>
        )}

        {!method && (
          <p className="text-[8px] font-black uppercase italic text-slate-600 tracking-[0.2em] text-center flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Encrypted Secure Payment
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;