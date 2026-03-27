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
    <section className="bg-black min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="reveal-text inline-block">
                <span className="text-caps-s text-pink px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20">Quantum Hospitality Solutions</span>
              </div>
              <h1 className="text-[4.5rem] md:text-[8rem] lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter text-white">
                <div className="reveal-text">
                  <span style={{ animationDelay: '0.1s' }}>Operational</span>
                </div>
                <div className="reveal-text">
                  <span className="text-pink" style={{ animationDelay: '0.2s' }}>Excellence</span>
                </div>
                <div className="reveal-text">
                  <span style={{ animationDelay: '0.3s' }}>Redefined.</span>
                </div>
              </h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-body-l max-w-2xl mx-auto font-medium leading-relaxed"
            >
              {settings?.heroSubtitle || 'AI-powered operational tools built by hospitality operators to solve real hospitality problems. Improve operations, increase guest satisfaction, and deploy tools instantly.'}
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={handleScrollToTools}
                className="w-full sm:w-auto px-12 py-6 bg-pink text-black rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-2xl shadow-pink/20"
              >
                Explore Tools
              </button>
              {settings?.bookUrl && (
                <a 
                  href={settings.bookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-white/10 transition-all"
                >
                  Buy the Book
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
