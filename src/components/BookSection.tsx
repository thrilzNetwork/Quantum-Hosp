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
    <section id="book" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-bold text-pink uppercase tracking-widest mb-6">
              <BookOpen size={12} /> The Definitive Guide
            </div>
            <h2 className="text-[2.5rem] md:text-[4rem] font-black uppercase leading-[0.9] tracking-tighter text-white mb-8">
              Somehow I <span className="italic text-pink">Managed</span>.
            </h2>
            <p className="text-body-l text-white/60 mb-10 leading-relaxed max-w-xl">
              Fifteen years of hospitality leadership distilled into a single, practical guide. No corporate fluff—just the frameworks, templates, and hard-won lessons from the front lines of hotel operations.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-pink shrink-0">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Operational Excellence</h4>
                  <p className="text-xs text-white/40">Master the systems that keep properties running smoothly under pressure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-pink shrink-0">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Leadership Frameworks</h4>
                  <p className="text-xs text-white/40">Build and lead high-performing teams that deliver consistent results.</p>
                </div>
              </div>
            </div>

            <a 
              href={settings.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-pink text-black rounded-2xl font-black uppercase tracking-tight hover:scale-105 transition-all shadow-lg shadow-pink/20"
            >
              Get the Book <ArrowRight size={20} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800" 
                alt="Somehow I Managed Book Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                <p className="text-pink font-black text-2xl uppercase tracking-tighter mb-2">Available Now</p>
                <p className="text-white/60 text-sm">The manual for the modern hospitality operator.</p>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl rotate-12 border-4 border-black">
              <div className="text-center">
                <p className="text-[10px] font-black text-black uppercase leading-none">Must</p>
                <p className="text-lg font-black text-black uppercase leading-none">Read</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
