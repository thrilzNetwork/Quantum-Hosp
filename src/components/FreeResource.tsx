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
    <section id="resources" className="py-16 md:py-32 bg-black">
      <div className="container">
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row gap-10 md:gap-16 items-center border border-white/5 shadow-2xl">
          <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="text-caps-s text-pink">Featured Resource</span>
              <h2 className="text-[2rem] md:text-h3 leading-tight text-white">Somehow I Managed — Hospitality Edition</h2>
              <p className="text-body-m text-white/70 max-w-md mx-auto lg:mx-0">
                A practical guide for hotel operators navigating the chaos of daily operations. Learn how experienced operators manage teams, guests, and systems in the real world.
              </p>
            </div>

            <a 
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-pink text-black px-8 py-4 rounded-full text-caps-s font-bold hover:bg-pink-light transition-all inline-flex items-center gap-2 w-full sm:w-fit"
            >
              <BookOpen size={18} />
              Read the Book
              <ArrowRight size={18} />
            </a>
          </div>

          <motion.div 
            initial={{ rotate: -5, y: 20 }}
            whileInView={{ rotate: -2, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-[280px] md:max-w-sm aspect-[3/4] bg-black rounded-xl shadow-2xl p-8 md:p-12 flex flex-col justify-between text-white"
          >
            <div className="space-y-2">
              <div className="text-caps-s opacity-60">Hospitality Edition</div>
              <div className="text-2xl font-black uppercase tracking-tighter leading-tight">
                Somehow <br /> I Managed
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-1 w-12 bg-pink"></div>
              <div className="text-sm opacity-60 italic">
                A guide for the modern hotel operator.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
