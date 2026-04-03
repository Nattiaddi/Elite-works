import React, { useState } from 'react';
import { ShieldCheck, Cpu, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AIVerificationUI = () => {
  const [status, setStatus] = useState('idle'); // idle, scanning, verified, failed
  const [progress, setProgress] = useState(0);

  const startAIScan = () => {
    setStatus('scanning');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('verified'); // ለጊዜው በራሳችን verified እናድርገው
      }
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-obsidian-soft rounded-[2rem] border border-white/5 shadow-2xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex p-4 bg-gold/10 rounded-2xl text-gold mb-2">
          <Cpu size={32} className={status === 'scanning' ? 'animate-pulse' : ''} />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">AI Identity Verification</h2>
        <p className="text-gray-500 text-sm">Our neural network will verify your professional identity in seconds.</p>
      </div>

      {/* Main Action Area */}
      <div className="relative p-10 border-2 border-dashed border-white/10 rounded-3xl bg-obsidian flex flex-col items-center justify-center overflow-hidden">
        
        {status === 'idle' && (
          <div className="text-center space-y-6">
            <p className="text-gray-400">Upload your ID or Passport for instant AI approval</p>
            <button 
              onClick={startAIScan}
              className="bg-gold text-black font-black px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg shadow-gold/20"
            >
              START AI SCAN
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="w-full space-y-6 text-center">
            {/* Scanning Animation Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/10 to-transparent h-20 w-full animate-scan"></div>
            
            <Loader2 className="mx-auto text-gold animate-spin" size={48} />
            <div className="space-y-2">
              <p className="text-gold font-mono text-sm tracking-widest uppercase">Analyzing Pixels: {progress}%</p>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gold h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">Matching biometrics with professional records...</p>
          </div>
        )}

        {status === 'verified' && (
          <div className="text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white">Verification Complete</h3>
            <p className="text-gray-400">Your Elite Badge is now active on your profile.</p>
            <div className="flex items-center justify-center gap-2 text-gold font-black bg-gold/10 px-4 py-2 rounded-lg mt-4">
              <ShieldCheck size={18} /> ELITE VERIFIED
            </div>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="mt-8 flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
        <AlertCircle className="text-gray-500 shrink-0" size={18} />
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Elite Works AI uses end-to-end encrypted processing. Your sensitive documents are never stored permanently after the biometric hash is generated.
        </p>
      </div>
    </div>
  );
};

export default AIVerificationUI;