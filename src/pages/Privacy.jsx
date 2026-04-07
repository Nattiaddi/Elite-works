import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black italic text-white mb-4 uppercase tracking-tighter">
        Privacy <span className="text-gold-500">Policy</span>
      </h1>
      <p className="text-slate-500 italic mb-12">Your data security is our elite priority.</p>

      <div className="prose prose-invert max-w-none space-y-8 italic text-slate-400 text-sm">
        <p>At Elite Works, we value your privacy. This policy explains how we collect and protect your information.</p>
        
        <div className="p-8 bg-slate-900/40 border-l-4 border-gold-500 rounded-r-[2rem]">
          <h4 className="text-white font-black uppercase text-xs mb-2">Data Collection</h4>
          <p>We collect only the necessary data to provide our services, such as your profile info, project details, and contact information.</p>
        </div>

        <div className="p-8 bg-slate-900/40 border-l-4 border-gold-500 rounded-r-[2rem]">
          <h4 className="text-white font-black uppercase text-xs mb-2">Data Protection</h4>
          <p>We use industry-standard encryption to protect your account and data from unauthorized access.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;