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
    <section id="about" className="py-16 md:py-24 bg-black text-white border-b border-white/10">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-center"
          >
            <div>
              <p className="text-[10px] font-bold text-supporting-grey uppercase tracking-widest mb-2">The Visionary</p>
              <h2 className="text-h2-caps mb-6">Built by Operators, <br /> For Operators.</h2>
              <div className="text-supporting-grey text-lg leading-relaxed">
                {settings?.founderBio ? (
                  <div className="prose prose-invert prose-sm mx-auto max-w-none">
                    {settings.founderBio.split('\n').map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))}
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm mx-auto max-w-none">
                    <p className="mb-4">I came to this country with a dream that didn't work out, a language I was still learning, and a job cleaning offices I thought were something else. What I found instead was an industry I fell in love with — and I spent the next fifteen years learning every corner of it from the inside out.</p>
                    <p className="mb-4">I started as a houseman. I became a night auditor, a front desk agent, a front office manager, an AGM, a GM. I opened hotels from scratch under pressure. I walked into broken properties and rebuilt them. I stayed through a hurricane on property. I survived COVID while running one of the best-performing hotels in the company. I sat across from ownership with numbers nobody wanted to see and delivered them anyway.</p>
                    <p className="mb-4">What I never found — in any of those roles, at any of those properties — were tools built by someone who actually understood the job. The software was always designed by people who had studied hospitality, never by people who had lived it. I watched teams work around systems that were supposed to help them. I watched operators accept manual processes because nothing better existed. I got tired of waiting for someone else to build it.</p>
                    <p className="mb-4">Quantum was not born in a boardroom. It was born from fifteen years of doing the work nobody sees — and finally having enough experience, enough clarity, and enough patience exhausted to build what this industry actually needs.</p>
                    <p className="mb-4">I am not a tech founder who studied hotels. I am an operator who studied technology. That difference is everything.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest">Connect with the Founder</h4>
              <div className="flex justify-center gap-4">
                <a href={settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/alejandrosoriaquantum/"} className="px-8 py-4 bg-pink text-black rounded-xl flex items-center gap-3 font-black uppercase tracking-widest hover:scale-105 transition-transform">
                  <Linkedin size={20} />
                  LinkedIn Profile
                </a>
                <a href={`mailto:${settings?.contactEmail || "alejandro@quantumhospitality.com"}`} className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center shadow-sm hover:bg-white/20 transition-all">
                  <Mail size={24} />
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-center">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-pink rounded-full flex items-center justify-center text-black font-black">
                  {settings?.founderName ? settings.founderName.charAt(0) : 'A'}
                </div>
                <div>
                  <p className="font-bold text-sm">{settings?.founderName || 'Alejandro Soria'}</p>
                  <p className="text-supporting-grey text-xs">{settings?.founderRole || 'Founder & Hospitality Operator'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
