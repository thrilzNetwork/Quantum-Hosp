import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import { BookOpen, ArrowRight, Star } from 'lucide-react';

export default function BookSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsubSettings;
  }, []);

  if (!settings?.bookUrl) return null;

  return (
    <section id="book" className="py-24 md:py-32 bg-black relative overflow-hidden border-b border-white/5">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest mb-8">
              <BookOpen size={12} /> The Definitive Guide
            </div>
            <h2 className="text-[3rem] md:text-h3-caps font-black uppercase leading-[0.85] tracking-tighter text-white mb-10">
              Somehow I <span className="italic text-pink">Managed</span>.
            </h2>
            <p className="text-body-m text-white/60 mb-12 leading-relaxed max-w-xl font-medium">
              Fifteen years of hospitality leadership distilled into a single, practical guide. No corporate fluff—just the frameworks, templates, and hard-won lessons from the front lines of hotel operations.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-16">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-pink shrink-0 border border-white/5">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white mb-2 uppercase tracking-tight">Operational Excellence</h4>
                  <p className="text-sm text-white/40 leading-relaxed">Master the systems that keep properties running smoothly under pressure.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-pink shrink-0 border border-white/5">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white mb-2 uppercase tracking-tight">Leadership Frameworks</h4>
                  <p className="text-sm text-white/40 leading-relaxed">Build and lead high-performing teams that deliver consistent results.</p>
                </div>
              </div>
            </div>

            <a 
              href={settings.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn px-10 py-5 bg-pink text-black rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-2xl shadow-pink/20"
            >
              Get the Book <ArrowRight size={20} className="ml-2" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800" 
                alt="Somehow I Managed Book Cover"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-12">
                <p className="text-pink font-black text-3xl uppercase tracking-tighter mb-3">Available Now</p>
                <p className="text-white/60 text-base font-medium">The manual for the modern hospitality operator.</p>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl rotate-12 border-4 border-black z-20">
              <div className="text-center">
                <p className="text-[11px] font-black text-black uppercase leading-none mb-1">Must</p>
                <p className="text-2xl font-black text-black uppercase leading-none">Read</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
