import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Verification = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a document.");

    setLoading(true);
    setStatus('Uploading security documents...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `identities/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Update Profile Table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          id_url: filePath,
          kyc_status: 'under_review'
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setStatus('Success! Your identity is under review. 🛡️');
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4">
          Identity <span className="text-gold-500">Verification</span>
        </h2>
        <p className="text-slate-500 italic uppercase text-[10px] tracking-[0.3em]">Global Trust & Safety Standard</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] backdrop-blur-xl max-w-2xl mx-auto">
        <form onSubmit={handleUpload} className="space-y-8 text-center">
          <div className="border-2 border-dashed border-slate-800 rounded-[2rem] p-12 hover:border-gold-500/50 transition-all group relative">
            <input 
              type="file" 
              accept="image/*,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="space-y-4">
              <span className="text-4xl block">🆔</span>
              <p className="text-slate-400 font-bold italic uppercase text-xs">
                {file ? file.name : "Upload Passport or National ID"}
              </p>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Supports: JPG, PNG, PDF (Max 5MB)</p>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gold-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-gold-500/10 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit for Review'}
          </button>

          {status && (
            <p className="text-gold-500 text-[10px] font-black uppercase italic animate-pulse">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Verification;