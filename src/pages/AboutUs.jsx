import React from 'react';
import { Target, Users, Zap } from 'lucide-react';

const AboutUs = () => {
  const features = [
    { icon: <Target className="text-gold" size={32} />, title: "Our Mission", desc: "To connect top-tier African talent with global opportunities, fostering economic growth and digital excellence." },
    { icon: <Users className="text-gold" size={32} />, title: "Elite Community", desc: "We curate a network of pre-vetted, highly skilled professionals across diverse digital fields." },
    { icon: <Zap className="text-gold" size={32} />, title: "Seamless Collaboration", desc: "Providing tools for secure payments, real-time communication, and efficient project management." }
  ];

  return (
    <div className="bg-obsidian min-h-screen text-white pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tighter">
            About <span className="text-gold">Elite</span> Works
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We are more than a marketplace; we are a curated ecosystem designed for excellence, connecting exceptional talent with visionary clients.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="bg-obsidian-soft p-10 rounded-3xl border border-white/5 space-y-4 hover:border-gold/30 transition-all">
              {f.icon}
              <h3 className="text-2xl font-bold text-white pt-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center bg-obsidian-soft p-12 rounded-3xl border border-white/5">
          <div>
            <h2 className="text-3xl font-bold mb-4">The Elite Story</h2>
            <p className="text-gray-400 leading-relaxed mb-4">Founded with the belief that exceptional skill deserves exceptional opportunities, Elite Works emerged to bridge the gap between premium talent and global demand. We focus on quality over quantity, ensuring every connection made on our platform is built on trust and competence.</p>
          </div>
          <div className="h-64 bg-gold-gradient rounded-2xl flex items-center justify-center text-4xl font-black text-black">EW</div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;