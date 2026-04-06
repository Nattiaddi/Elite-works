import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-6 selection:bg-gold-500/30">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-black mb-10 italic">
          <span className="text-white">{t('about')} </span>
          <span className="text-gold-500">Elite Works</span>
        </h1>
        <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 leading-relaxed text-slate-400 text-lg space-y-6 italic">
          <p>{t('about_text_1') || "Elite Works ኢትዮጵያ ውስጥ ያሉ ባለሙያዎችን ከዓለም አቀፍ ስራዎች ጋር የሚያገናኝ ድልድይ ነው።"}</p>
          <p>{t('about_text_2') || "ጥራትን፣ ታማኝነትን እና ቅልጥፍናን መመሪያችን በማድረግ ለደንበኞቻችን ምርጥ አገልግሎት እንሰጣለን።"}</p>
        </div>
      </div>
    </div>
  );
};

export default About;