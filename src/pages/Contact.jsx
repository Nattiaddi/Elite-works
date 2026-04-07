import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Transmitting to Elite Support...');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('Message delivered successfully! 🚀');
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Info Side */}
        <div className="space-y-10">
          <div>
            <h2 className="text-5xl font-black italic text-white mb-6 uppercase tracking-tighter leading-none">
              Get In <span className="text-gold-500">Touch</span>
            </h2>
            <p className="text-slate-400 text-lg italic leading-relaxed">
              Have a question or need elite support? Our global team is here to help you scale your digital presence.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-xl group-hover:border-gold-500 transition-all">🌍</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Availability</p>
                <p className="text-white font-bold italic uppercase">Global • 24/7 Support</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-xl group-hover:border-gold-500 transition-all">📧</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Email Support</p>
                <p className="text-white font-bold italic">support@elite-works.io</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic ml-2">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic ml-2">Global Email</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic ml-2">Inquiry</label>
              <textarea 
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic"
                placeholder="How can we assist your journey?"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all active:scale-95"
            >
              Send Message
            </button>
            
            {status && (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-gold-500 italic animate-pulse mt-4">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;