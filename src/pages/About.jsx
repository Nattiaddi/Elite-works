import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black italic text-white mb-8 tracking-tighter uppercase">
            Redefining <span className="text-gold-500">Excellence</span>
          </h1>
          <p className="text-slate-400 text-xl italic leading-relaxed font-medium">
            Elite Works is more than just a marketplace. It’s a bridge between Ethiopia's most ambitious talents and the world’s most prestigious opportunities.
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] backdrop-blur-md">
          <h3 className="text-gold-500 font-black italic uppercase tracking-widest text-xs mb-6">Our Mission</h3>
          <p className="text-white text-2xl font-bold italic leading-tight mb-6">
            To empower Ethiopian professionals by providing a secure, high-end platform to showcase their elite skills.
          </p>
          <p className="text-slate-500 italic leading-relaxed">
            We believe that geography should not limit opportunity. Our platform ensures that quality work is recognized and rewarded, regardless of where it comes from.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] backdrop-blur-md">
          <h3 className="text-gold-500 font-black italic uppercase tracking-widest text-xs mb-6">Our Vision</h3>
          <p className="text-white text-2xl font-bold italic leading-tight mb-6">
            To become Africa's leading hub for premium digital talent and creative solutions.
          </p>
          <p className="text-slate-500 italic leading-relaxed">
            We are building an ecosystem where innovation meets efficiency, fostering a culture of professional growth and economic impact in the digital age.
          </p>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic text-white uppercase">Why <span className="text-gold-500">Elite Works?</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl">💎</div>
            <h4 className="text-white font-black italic uppercase text-sm">Quality First</h4>
            <p className="text-slate-500 text-sm italic leading-relaxed">We strictly curate our projects and talent to ensure only the highest standards are maintained.</p>
          </div>
          <div className="space-y-4">
            <div className="text-4xl">🛡️</div>
            <h4 className="text-white font-black italic uppercase text-sm">Secure Trust</h4>
            <p className="text-slate-500 text-sm italic leading-relaxed">Security is our priority. Our payment systems and data handling are built for elite protection.</p>
          </div>
          <div className="space-y-4">
            <div className="text-4xl">🚀</div>
            <h4 className="text-white font-black italic uppercase text-sm">Fast Growth</h4>
            <p className="text-slate-500 text-sm italic leading-relaxed">Accelerate your career or business with a workflow designed for efficiency and speed.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="bg-gold-500 p-16 rounded-[4rem] shadow-2xl shadow-gold-500/10">
          <h2 className="text-slate-950 text-4xl md:text-5xl font-black italic uppercase mb-8 leading-tight">
            Ready to start your <br/> Elite journey?
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/signup" className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all">
              Join Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;