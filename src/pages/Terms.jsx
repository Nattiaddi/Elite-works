import React from 'react';

const Terms = () => {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing Elite Works, you agree to be bound by these global service terms and all applicable international laws." },
    { title: "2. User Accounts", content: "Users must provide accurate information. You are responsible for maintaining the confidentiality of your elite account credentials globally." },
    { title: "3. Service Fees", content: "Elite Works may charge service fees for successful transactions. All fees are transparent and displayed before any commitment." },
    { title: "4. Intellectual Property", content: "Clients retain ownership of the works they pay for, while freelancers retain rights to their portfolio unless otherwise agreed in writing." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-4xl font-black italic text-white mb-4 uppercase tracking-tighter">
        Terms & <span className="text-gold-500">Conditions</span>
      </h1>
      <p className="text-slate-500 italic mb-12 uppercase text-[10px] tracking-[0.3em]">Last updated: April 2026 • Global Standard</p>

      <div className="space-y-10">
        {sections.map((sec, i) => (
          <div key={i} className="bg-slate-900/20 border border-slate-800 p-8 rounded-[2rem] hover:border-gold-500/30 transition-all">
            <h3 className="text-gold-500 font-black italic uppercase text-xs mb-4 tracking-widest">{sec.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed italic">{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;