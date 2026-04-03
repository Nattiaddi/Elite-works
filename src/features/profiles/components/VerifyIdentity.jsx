import React, { useState } from 'react';
import { uploadVerificationID } from '../../../services/profileService';

const VerifyIdentity = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("እባክህ መታወቂያ ምረጥ!");
    
    setLoading(true);
    const result = await uploadVerificationID(file);
    setLoading(false);

    if (result.success) {
      alert("መታወቂያህ ለElite Review ተልኳል!");
    } else {
      alert("ስህተት ተከስቷል፣ እባክህ ደግመህ ሞክር።");
    }
  };

  return (
    <div className="bg-obsidian-soft p-8 rounded-3xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Verify Your Identity</h3>
      <input 
        type="file" 
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-dark"
      />
      <button 
        onClick={handleUpload}
        disabled={loading}
        className="mt-6 w-full bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-gold hover:text-black transition-all font-bold"
      >
        {loading ? "UPLOADING..." : "SUBMIT FOR REVIEW"}
      </button>
    </div>
  );
};

export default VerifyIdentity;