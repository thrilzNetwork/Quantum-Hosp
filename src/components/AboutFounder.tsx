import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export default function AboutFounder() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsubSettings;
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-black text-white border-b border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-16 text-center"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest mb-4">
                The Visionary
              </div>
              <h2 className="text-[3rem] md:text-h2-caps font-black uppercase leading-[0.85] tracking-tighter mb-10">
                Built by Operators, <br /> <span className="text-pink">For Operators.</span>
              </h2>
              <div className="text-white/70 text-lg leading-relaxed font-medium text-left md:text-center">
                {settings?.founderBio ? (
                  <div className="prose prose-invert prose-lg mx-auto max-w-none">
                    {settings.founderBio.split('\n').map((para, i) => (
                      <p key={i} className="mb-6">{para}</p>
                    ))}
                  </div>
                ) : (
                  <div className="prose prose-invert prose-lg mx-auto max-w-none">
                    <p className="mb-6">I came to this country with a dream that didn't work out, a language I was still learning, and a job cleaning offices I thought were something else. What I found instead was an industry I fell in love with — and I spent the next fifteen years learning every corner of it from the inside out.</p>
                    <p className="mb-6">I started as a houseman. I became a night auditor, a front desk agent, a front office manager, an AGM, a GM. I opened hotels from scratch under pressure. I walked into broken properties and rebuilt them. I stayed through a hurricane on property. I survived COVID while running one of the best-performing hotels in the company. I sat across from ownership with numbers nobody wanted to see and delivered them anyway.</p>
                    <p className="mb-6">What I never found — in any of those roles, at any of those properties — were tools built by someone who actually understood the job. The software was always designed by people who had studied hospitality, never by people who had lived it. I watched teams work around systems that were supposed to help them. I watched operators accept manual processes because nothing better existed. I got tired of waiting for someone else to build it.</p>
                    <p className="mb-6">Quantum was not born in a boardroom. It was born from fifteen years of doing the work nobody sees — and finally having enough experience, enough clarity, and enough patience exhausted to build what this industry actually needs.</p>
                    <p className="mb-6">I am not a tech founder who studied hotels. I am an operator who studied technology. That difference is everything.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8 pt-8">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white/40">Connect with the Founder</h4>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <a 
                  href={settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/alejandrosoriaquantum/"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-5 bg-pink text-black rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-tighter hover:bg-white transition-all shadow-2xl shadow-pink/20"
                >
                  <Linkedin size={20} />
                  LinkedIn Profile
                </a>
                <a 
                  href={`mailto:${settings?.contactEmail || "alejandro@quantumhospitality.com"}`} 
                  className="w-full sm:w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex justify-center">
              <div className="flex items-center gap-6 text-left p-6 rounded-[2rem] bg-white/5 border border-white/5">
                <div className="w-16 h-16 bg-pink rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-lg">
                  {settings?.founderName ? settings.founderName.charAt(0) : 'A'}
                </div>
                <div>
                  <p className="font-black text-lg uppercase tracking-tight text-white">{settings?.founderName || 'Alejandro Soria'}</p>
                  <p className="text-pink text-xs font-black uppercase tracking-widest">{settings?.founderRole || 'Founder & Hospitality Operator'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
