import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Connect = () => {
  return (
    <div className="bg-obsidian min-h-screen text-white pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 bg-obsidian-soft p-12 rounded-3xl border border-white/5">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">Connect with <span className="text-gold">Us</span></h1>
              <p className="text-gray-400 mt-2">Have questions or need support? Our team is here to help.</p>
            </div>
            
            <div className="space-y-6">
              <ContactMethod icon={<Mail />} label="Email Us" value="support@eliteworks.com" />
              <ContactMethod icon={<Phone />} label="Call Us" value="+251 911 000000" />
              <ContactMethod icon={<MapPin />} label="Visit Us" value="Addis Ababa, Ethiopia" />
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6 bg-obsidian p-8 rounded-2xl border border-white/10">
            <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold" />
            <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold" />
            <textarea placeholder="Your Message" rows="5" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"></textarea>
            <button className="w-full bg-gold text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all">
              SEND MESSAGE <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

const ContactMethod = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-white/5 rounded-xl text-gold">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase font-black">{label}</p>
      <p className="text-lg text-white font-medium">{value}</p>
    </div>
  </div>
);

export default Connect;