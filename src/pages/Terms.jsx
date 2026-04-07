import React from 'react';

const Terms = () => {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing Elite Works, you agree to be bound by these terms and all applicable laws in Ethiopia and internationally." },
    { title: "2. User Accounts", content: "Users must provide accurate information. You are responsible for maintaining the confidentiality of your elite account credentials." },
    { title: "3. Service Fees", content: "Elite Works may charge service fees for successful hires. All fees are transparent and displayed before transactions." },
    { title: "4. Intellectual Property", content: "Clients retain ownership of the works they pay for, while freelancers retain rights to their portfolio unless otherwise agreed." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black italic text-white mb-4 uppercase tracking-tighter">
        Terms & <span className="text-gold-500">Conditions</span>
      </h1>
      <p className="text-slate-500 italic mb-12">Last updated: April 2026</p>

      <div className="space-y-10">
        {sections.map((sec, i) => (
          <div key={i} className="bg-slate-900/20 border border-slate-800 p-8 rounded-[2rem]">
            <h3 className="text-gold-500 font-black italic uppercase text-xs mb-4 tracking-widest">{sec.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed italic">{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;