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
      {/* Immersive high-tech background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-pink/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 animate-glow" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16 text-center"
          >
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-pink/20 text-pink"
              >
                <div className="w-2 h-2 rounded-full bg-pink animate-pulse" />
                <span className="text-caps-s">Quantum Hospitality Solutions</span>
              </motion.div>

              <h1 className="text-h1-caps text-white">
                <div className="reveal-text">
                  <span style={{ animationDelay: '0.1s' }}>Operational</span>
                </div>
                <br />
                <div className="reveal-text">
                  <span className="text-pink" style={{ animationDelay: '0.2s' }}>Excellence</span>
                </div>
                <br />
                <div className="reveal-text">
                  <span style={{ animationDelay: '0.3s' }}>Redefined.</span>
                </div>
              </h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-body-l max-w-3xl mx-auto font-medium leading-tight text-white/80"
            >
              {settings?.heroSubtitle || 'AI-powered operational tools built by hospitality operators to solve real hospitality problems. Improve operations, increase guest satisfaction, and deploy tools instantly.'}
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={handleScrollToTools}
                className="btn-primary w-full sm:w-auto text-sm"
              >
                Explore Tools
              </button>
              {settings?.bookUrl && (
                <a 
                  href={settings.bookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full sm:w-auto text-sm"
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
