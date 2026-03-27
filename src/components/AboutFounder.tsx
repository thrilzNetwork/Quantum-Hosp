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
    <section id="about" className="section-padding bg-black text-white border-b border-white/5 relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <span className="text-caps-s text-pink">The Founder</span>
              <h2 className="text-h2-caps">Built by <br /> <span className="text-pink">Operators</span></h2>
            </div>
            
            <div className="space-y-8 text-body-m opacity-70 leading-relaxed max-w-xl">
              {settings?.founderBio ? (
                <div className="space-y-6">
                  {settings.founderBio.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <p>I came to this country with a dream that didn't work out, a language I was still learning, and a job cleaning offices I thought were something else. What I found instead was an industry I fell in love with — and I spent the next fifteen years learning every corner of it from the inside out.</p>
                  <p>I started as a houseman. I became a night auditor, a front desk agent, a front office manager, an AGM, a GM. I opened hotels from scratch under pressure. I walked into broken properties and rebuilt them. I stayed through a hurricane on property. I survived COVID while running one of the best-performing hotels in the company.</p>
                  <p>What I never found — in any of those roles, at any of those properties — were tools built by someone who actually understood the job. The software was always designed by people who had studied hospitality, never by people who had lived it.</p>
                  <p>Quantum was not born in a boardroom. It was born from fifteen years of doing the work nobody sees — and finally having enough experience, enough clarity, and enough patience exhausted to build what this industry actually needs.</p>
                  <p className="text-white font-bold italic">I am not a tech founder who studied hotels. I am an operator who studied technology. That difference is everything.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 pt-8">
              <a 
                href={settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/alejandrosoriaquantum/"} 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-10 py-5"
              >
                <Linkedin size={18} className="mr-2" />
                LinkedIn
              </a>
              <a 
                href={`mailto:${settings?.contactEmail || "alejandro@quantumhospitality.com"}`} 
                className="btn btn-secondary px-10 py-5"
              >
                <Mail size={18} className="mr-2" />
                Contact
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000" 
                alt="Alejandro Soria"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -bottom-10 -left-10 p-10 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl space-y-2">
              <p className="text-h6 uppercase tracking-tight">{settings?.founderName || 'Alejandro Soria'}</p>
              <p className="text-caps-s text-pink">{settings?.founderRole || 'Founder & Hospitality Operator'}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
