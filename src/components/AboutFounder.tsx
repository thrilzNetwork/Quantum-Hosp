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
    <section id="about" className="py-24 bg-black text-white border-b border-white/10">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={settings?.founderImage || "https://picsum.photos/seed/founder/800/1000"} 
                alt={settings?.founderName || "The Founder"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-pink rounded-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <p className="text-[10px] font-bold text-supporting-grey uppercase tracking-widest mb-2">The Visionary</p>
              <h2 className="text-h2-caps mb-6">Built by Operators, <br /> For Operators.</h2>
              <div className="text-supporting-grey text-lg leading-relaxed">
                {settings?.founderBio ? (
                  <div className="prose prose-invert prose-sm">
                    {settings.founderBio.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p>
                    "I spent 15 years in the trenches of hospitality operations. I've seen the chaos, the manual spreadsheets, and the fragmented systems. Quantum was born from a simple realization: operators don't need more software; they need better tools that actually solve real-world problems."
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest">Connect with the Founder</h4>
              <div className="flex gap-4">
                <a href={settings?.socialLinks?.linkedin || "#"} className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-sm hover:bg-pink hover:text-black transition-all">
                  <Linkedin size={20} />
                </a>
                <a href={settings?.socialLinks?.twitter || "#"} className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-sm hover:bg-pink hover:text-black transition-all">
                  <Twitter size={20} />
                </a>
                <a href={`mailto:${settings?.contactEmail || ""}`} className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-sm hover:bg-pink hover:text-black transition-all">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink rounded-full flex items-center justify-center text-black font-black">
                  {settings?.founderName ? settings.founderName.charAt(0) : 'Q'}
                </div>
                <div>
                  <p className="font-bold text-sm">{settings?.founderName || 'Quantum Founder'}</p>
                  <p className="text-supporting-grey text-xs">{settings?.founderRole || 'Hospitality Operations Expert'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
