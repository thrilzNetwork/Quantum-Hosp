import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export default function FounderSection() {
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
    <section className="section-padding bg-black text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-pink/20 text-pink"
              >
                <div className="w-2 h-2 rounded-full bg-pink animate-pulse" />
                <span className="text-caps-s font-black">{settings?.founderRole || 'Founder & Hospitality Operator'}</span>
              </motion.div>
              <h2 className="text-h2-caps">
                {settings?.founderName ? `Practical tools from ${settings.founderName}'s experience` : 'Practical tools from Alejandro Soria\'s experience'}
              </h2>
            </div>
            
            <div className="space-y-8 text-body-l opacity-100 text-white/70 mx-auto max-w-3xl font-medium leading-tight">
              {settings?.founderBio ? (
                <div className="prose prose-invert prose-lg mx-auto">
                  {settings.founderBio.split('\n').map((para, i) => (
                    <p key={i} className="mb-6">{para}</p>
                  ))}
                </div>
              ) : (
                <div className="prose prose-invert prose-lg mx-auto text-left md:text-center">
                  <p className="mb-8">I came to this country with a dream that didn't work out, a language I was still learning, and a job cleaning offices I thought were something else. What I found instead was an industry I fell in love with — and I spent the next fifteen years learning every corner of it from the inside out.</p>
                  <p className="mb-8">I started as a houseman. I became a night auditor, a front desk agent, a front office manager, an AGM, a GM. I opened hotels from scratch under pressure. I walked into broken properties and rebuilt them. I stayed through a hurricane on property. I survived COVID while running one of the best-performing hotels in the company. I sat across from ownership with numbers nobody wanted to see and delivered them anyway.</p>
                  <p className="mb-8">What I never found — in any of those roles, at any of those properties — were tools built by someone who actually understood the job. The software was always designed by people who had studied hospitality, never by people who had lived it. I watched teams work around systems that were supposed to help them. I watched operators accept manual processes because nothing better existed. I got tired of waiting for someone else to build it.</p>
                  <p className="mb-8">Quantum was not born in a boardroom. It was born from fifteen years of doing the work nobody sees — and finally having enough experience, enough clarity, and enough patience exhausted to build what this industry actually needs.</p>
                  <p className="mb-8">I am not a tech founder who studied hotels. I am an operator who studied technology. That difference is everything.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-10 border-t border-white/5">
              {['Practical', 'Simple', 'Deployable'].map((word, i) => (
                <motion.div 
                  key={word}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-pink shadow-[0_0_10px_rgba(255,105,180,0.5)]" />
                  <span className="text-caps-s font-black tracking-[0.2em]">{word}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
