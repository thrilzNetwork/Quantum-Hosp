import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export default function FreeResource() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsub;
  }, []);

  const bookUrl = settings?.bookUrl || 'https://somehowimanaged.netlify.app/';

  return (
    <section id="resources" className="py-24 md:py-32 bg-black border-y border-white/5">
      <div className="container">
        <div className="bg-white/5 border border-white/5 rounded-[3rem] p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row gap-12 md:gap-20 items-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-pink/20 transition-colors duration-700"></div>
          
          <div className="flex-1 space-y-10 text-center lg:text-left relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest">
                Featured Resource
              </div>
              <h2 className="text-[2.5rem] md:text-h3-caps font-black uppercase leading-[0.85] tracking-tighter text-white">
                Somehow I <span className="text-pink">Managed</span> — Hospitality Edition
              </h2>
              <p className="text-body-m text-white/60 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                A practical guide for hotel operators navigating the chaos of daily operations. Learn how experienced operators manage teams, guests, and systems in the real world.
              </p>
            </div>

            <a 
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-pink text-black rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-2xl shadow-pink/20 inline-flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <BookOpen size={20} />
              Read the Book
              <ArrowRight size={20} />
            </a>
          </div>

          <motion.div 
            initial={{ rotate: -5, y: 30, opacity: 0 }}
            whileInView={{ rotate: -2, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[280px] md:max-w-sm aspect-[3/4] bg-black rounded-[2rem] shadow-2xl p-10 md:p-14 flex flex-col justify-between text-white border border-white/10 relative z-10 group-hover:rotate-0 transition-transform duration-700"
          >
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-pink">Hospitality Edition</div>
              <div className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.85]">
                Somehow <br /> I <span className="text-pink">Managed</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="h-1.5 w-16 bg-pink rounded-full"></div>
              <div className="text-sm text-white/40 font-black uppercase tracking-widest italic">
                A guide for the modern hotel operator.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
