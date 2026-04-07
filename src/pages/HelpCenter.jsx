import React, { useState } from 'react';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "For Freelancers",
      questions: [
        { q: "How do I apply for a job?", a: "Browse the 'Find Jobs' page, click on a job that interests you, and submit your proposal with a professional cover letter." },
        { q: "How do I get paid?", a: "Payments are handled directly between you and the client. We recommend setting clear milestones before starting work." }
      ]
    },
    {
      category: "For Clients",
      questions: [
        { q: "How do I post a job?", a: "Go to the 'Post Job' page, fill in the project details, budget, and category, and your job will be live instantly." },
        { q: "How do I hire someone?", a: "Review the proposals on your 'Manage Jobs' page. Once you find a match, click the 'Hire' button to notify them." }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black italic text-white mb-6 uppercase tracking-tighter">
          Help <span className="text-gold-500">Center</span>
        </h2>
        <p className="text-slate-400 italic text-lg max-w-2xl mx-auto">
          Everything you need to know about navigating the Elite Works ecosystem.
        </p>
      </div>

      {/* Search Support */}
      <div className="relative max-w-xl mx-auto mb-20">
        <input 
          type="text" 
          placeholder="Search for help..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-8 py-5 text-white focus:border-gold-500 outline-none transition-all italic"
        />
      </div>

      {/* FAQ Sections */}
      <div className="space-y-16">
        {faqs.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-gold-500 font-black italic uppercase tracking-[0.3em] text-xs mb-8 border-l-2 border-gold-500 pl-4">
              {section.category}
            </h3>
            <div className="grid gap-6">
              {section.questions.map((faq, i) => (
                <div key={i} className="bg-slate-900/30 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-all">
                  <h4 className="text-white font-bold italic text-lg mb-3">Q: {faq.q}</h4>
                  <p className="text-slate-500 italic leading-relaxed text-sm">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help? */}
      <div className="mt-24 bg-gold-500 p-12 rounded-[3rem] text-center">
        <h3 className="text-slate-950 text-2xl font-black italic uppercase mb-4">Still need assistance?</h3>
        <p className="text-slate-900 font-medium italic mb-8">Our elite support team is ready to help you 24/7.</p>
        <a href="/contact" className="inline-block bg-slate-950 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default HelpCenter;