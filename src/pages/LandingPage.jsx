import React from 'react';
import { Link } from 'react-router-dom'; // ይህንን Import መጨመር እንዳትረሳ

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-6 px-10 border-b border-gold-700/10">
        <div className="text-2xl font-bold text-gold-500">Elite Works</div>
        <div className="space-x-6 flex items-center">
          <Link to="/login" className="text-gold-200 hover:text-gold-500 transition-colors">ይግቡ</Link>
          <Link to="/signup" className="bg-gold-600 text-slate-950 px-5 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors">
            ይመዝገቡ
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
          እንኳን ወደ Elite Works በሰላም መጡ
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          ለእርስዎ ጥራት ያላቸውን ስራዎች በጥንቃቄ እና በቅልጥፍና እናቀርባለን።
        </p>
        
        {/* ወደ ስራዎች ከመሄድ ይልቅ መጀመሪያ እንዲመዘገቡ እናድርግ */}
        <Link to="/signup" className="inline-block bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-gold-500/20">
          አሁኑኑ ይጀምሩ
        </Link>
      </header>

      {/* Features Section (እንዳለ ይቀጥላል...) */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h3 className="text-2xl font-bold mb-4 text-gold-400">ጥራት</h3>
            <p className="text-slate-400 leading-relaxed">ሁልጊዜም ለደንበኞቻችን ምርጥ ጥራት ያለው ስራ እናቀርባለን።</p>
          </div>
          {/* ሌሎቹ ካርዶች እዚህ ይቀጥላሉ... */}
      </section>

      <footer className="py-10 text-center border-t border-slate-900 text-slate-500">
        <p>© 2026 Elite Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;