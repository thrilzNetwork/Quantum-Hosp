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
    <section className="py-20 md:py-32 bg-black text-white overflow-hidden relative">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-caps-s text-pink">{settings?.founderRole || 'Founder & Hospitality Operator'}</span>
              <h2 className="text-[2.5rem] md:text-h3 leading-tight">
                {settings?.founderName ? `Practical tools from ${settings.founderName}'s experience` : 'Practical tools from Alejandro Soria\'s experience'}
              </h2>
            </div>
            
            <div className="space-y-6 text-body-m opacity-80 mx-auto max-w-2xl">
              {settings?.founderBio ? (
                <div className="prose prose-invert prose-sm mx-auto">
                  {settings.founderBio.split('\n').map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>
              ) : (
                <div className="prose prose-invert prose-sm mx-auto">
                  <p className="mb-4">I came to this country with a dream that didn't work out, a language I was still learning, and a job cleaning offices I thought were something else. What I found instead was an industry I fell in love with — and I spent the next fifteen years learning every corner of it from the inside out.</p>
                  <p className="mb-4">I started as a houseman. I became a night auditor, a front desk agent, a front office manager, an AGM, a GM. I opened hotels from scratch under pressure. I walked into broken properties and rebuilt them. I stayed through a hurricane on property. I survived COVID while running one of the best-performing hotels in the company. I sat across from ownership with numbers nobody wanted to see and delivered them anyway.</p>
                  <p className="mb-4">What I never found — in any of those roles, at any of those properties — were tools built by someone who actually understood the job. The software was always designed by people who had studied hospitality, never by people who had lived it. I watched teams work around systems that were supposed to help them. I watched operators accept manual processes because nothing better existed. I got tired of waiting for someone else to build it.</p>
                  <p className="mb-4">Quantum was not born in a boardroom. It was born from fifteen years of doing the work nobody sees — and finally having enough experience, enough clarity, and enough patience exhausted to build what this industry actually needs.</p>
                  <p className="mb-4">I am not a tech founder who studied hotels. I am an operator who studied technology. That difference is everything.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-4">
              {['Practical', 'Simple', 'Deployable'].map((word) => (
                <div key={word} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink"></div>
                  <span className="text-caps-s font-bold">{word}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
