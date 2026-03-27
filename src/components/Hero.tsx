import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, where, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { PromoSlide, SiteSettings } from '../types';

import { Link } from 'react-router-dom';

export default function Hero() {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });

    const q = query(
      collection(db, 'promo_slides'),
      where('isActive', '==', true),
      orderBy('order')
    );
    const unsubSlides = onSnapshot(q, (snapshot) => {
      setSlides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoSlide)));
    });
    
    return () => {
      unsubSettings();
      unsubSlides();
    };
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const handleScrollToTools = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector('#tools');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-black py-4 md:py-8">
      <div className="container grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-black text-white rounded-2xl p-8 md:p-16 lg:p-20 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-1/2 -left-10 w-9 h-9 text-supporting-grey -translate-y-1/2">
             <svg viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5023 14.2275C22.3563 14.115 23 13.389 23 12.5277C23 11.6734 22.3661 10.9507 21.52 10.8322C8.56301 9.01687 2.2622 7.3115 0 0.5V24.5C2.34095 18.2157 7.6187 16.0568 21.5023 14.2275Z" fill="currentColor"></path>
             </svg>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 relative z-10"
          >
            <h1 className="text-[2rem] sm:text-[2.5rem] md:text-h3-caps leading-[1.1] md:leading-[0.9]">
              {settings?.heroTitle ? (
                <span dangerouslySetInnerHTML={{ __html: settings.heroTitle }} />
              ) : (
                <>Tools Built by <br className="hidden md:block" /> <span className="text-pink">Operators</span> for <br className="hidden md:block" /> Operators</>
              )}
            </h1>
            
            <p className="text-body-m opacity-80 max-w-md">
              {settings?.heroSubtitle || 'AI-powered operational tools built by a hotel general manager to solve real hospitality problems. Improve operations, increase guest satisfaction, and deploy tools instantly.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={handleScrollToTools}
                className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-tight hover:scale-105 transition-all shadow-lg shadow-white/10"
              >
                Explore Tools
              </button>
              {settings?.bookUrl && (
                <a 
                  href={settings.bookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-pink text-black rounded-2xl font-black uppercase tracking-tight hover:scale-105 transition-all shadow-lg shadow-pink/20"
                >
                  Buy the Book
                </a>
              )}
            </div>
          </motion.div>
        </div>

        <div className="bg-neutral-900 rounded-2xl overflow-hidden relative aspect-square lg:aspect-auto">
          <AnimatePresence mode="wait">
            {slides.length > 0 ? (
              <motion.div
                key={slides[currentSlide].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=1200" 
                alt="Luxury hotel lobby" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}
