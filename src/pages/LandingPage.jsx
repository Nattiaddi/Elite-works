import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Hero Section */}
      <header className="relative py-24 px-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-gold-700/30">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
          እንኳን ወደ Elite Works በሰላም መጡ
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          ለእርስዎ ጥራት ያላቸውን ስራዎች በጥንቃቄ እና በቅልጥፍና እናቀርባለን።
        </p>
        <button className="bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-gold-500/20">
          ስራዎቻችንን ይመልከቱ
        </button>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-gold-500/50 transition-colors group">
            <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500/20">
              <span className="text-gold-500 text-2xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gold-400">ጥራት</h3>
            <p className="text-slate-400 leading-relaxed">
              ሁልጊዜም ለደንበኞቻችን ምርጥ ጥራት ያለው ስራ እናቀርባለን።
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-gold-500/50 transition-colors group">
            <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500/20">
              <span className="text-gold-500 text-2xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gold-400">ፍጥነት</h3>
            <p className="text-slate-400 leading-relaxed">
              ስራዎን በተባለው ጊዜ እና ሰዓት አጠናቀን እናስረክባለን።
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-gold-500/50 transition-colors group">
            <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500/20">
              <span className="text-gold-500 text-2xl">🤝</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gold-400">ታማኝነት</h3>
            <p className="text-slate-400 leading-relaxed">
              በስራችን ታማኝ እና ግልጽነት ያለን ድርጅት ነን።
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-slate-900 text-slate-500">
        <p>© 2026 Elite Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;