import React, { useState } from 'react';
import AIVerificationUI from './AIVerificationUI';
import { User, ShieldCheck, CreditCard, Bell } from 'lucide-react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-black text-white mb-10 tracking-tighter">
        ACCOUNT <span className="text-gold">SETTINGS</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-12">
        {/* የጎን ሜኑ (Sidebar Tabs) */}
        <div className="w-full md:w-64 space-y-2">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
            icon={<User size={20} />} 
            label="General Profile" 
          />
          <TabButton 
            active={activeTab === 'verification'} 
            onClick={() => setActiveTab('verification')}
            icon={<ShieldCheck size={20} />} 
            label="AI Verification" 
          />
          <TabButton 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')}
            icon={<CreditCard size={20} />} 
            label="Payments & Payouts" 
          />
        </div>

        {/* ዋናው የይዘት ክፍል (Main Content) */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-obsidian-soft p-8 rounded-3xl border border-white/5 space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-white">Public Identity</h2>
              <div className="grid gap-6">
                <InputGroup label="Full Name" placeholder="Nattiaddi" />
                <InputGroup label="Professional Bio" placeholder="Expert Web Developer..." isTextArea />
                <button className="bg-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition-all">
                  UPDATE PROFILE
                </button>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <AIVerificationUI />
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-obsidian-soft p-12 text-center rounded-3xl border border-white/5 border-dashed">
              <p className="text-gray-500 italic">Payment settings are managed via Stripe Connect.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ንዑስ ኮምፖነንቶች (Sub-components)
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${
      active ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

const InputGroup = ({ label, placeholder, isTextArea }) => (
  <div className="space-y-2">
    <label className="text-xs uppercase tracking-widest text-gray-500 font-black">{label}</label>
    {isTextArea ? (
      <textarea className="w-full bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold h-32" placeholder={placeholder} />
    ) : (
      <input className="w-full bg-obsidian border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold" placeholder={placeholder} />
    )}
  </div>
);

export default ProfileSettings;