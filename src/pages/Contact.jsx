import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-6">
      <div className="max-w-lg mx-auto bg-slate-900/40 p-10 rounded-[3rem] border border-white/5">
        <h2 className="text-3xl font-black text-gold-500 mb-8 italic">{t('contact_us')}</h2>
        <form className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Message / መልዕክት</label>
            <textarea rows="4" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 focus:border-gold-500/50 outline-none text-slate-300"></textarea>
          </div>
          <button className="w-full bg-gold-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-gold-400 shadow-xl shadow-gold-500/10 transition-all uppercase tracking-widest text-xs">
            {t('send_message') || 'መልዕክት ላክ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;