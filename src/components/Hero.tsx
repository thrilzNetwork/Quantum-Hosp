import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, X, ChevronLeft } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { PromoSlide, SiteSettings } from '../types';

import { Link } from 'react-router-dom';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('OPERATIONS');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
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
    <section className="bg-black py-6">
      <div className="container grid lg:grid-cols-2 gap-6">
        <div className="bg-black text-white rounded-2xl p-10 md:p-16 lg:p-20 flex flex-col justify-center relative overflow-hidden">
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
            <div className="flex items-center gap-x-4 text-supporting-grey">
              <span className="text-caps-s uppercase">Quantum Hospitality Solutions</span>
            </div>
            
            <h1 className="text-[2.5rem] md:text-h3-caps leading-[0.9]">
              {settings?.heroTitle ? (
                <span dangerouslySetInnerHTML={{ __html: settings.heroTitle }} />
              ) : (
                <>Tools Built by <br className="hidden md:block" /> <span className="text-pink">Operators</span> for <br className="hidden md:block" /> Operators</>
              )}
            </h1>
            
            <p className="text-body-m opacity-80 max-w-md">
              {settings?.heroSubtitle || 'AI-powered operational tools built by a hotel general manager to solve real hospitality problems. Improve operations, increase guest satisfaction, and deploy tools instantly.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/tools" 
                className="btn bg-pink text-black px-8 py-4 rounded-full text-caps-s font-bold hover:bg-pink-light transition-colors group w-full sm:w-fit uppercase"
              >
                Browse Tools
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="btn border border-white/20 text-white px-8 py-4 rounded-full text-caps-s font-bold hover:bg-white/10 transition-colors w-full sm:w-fit uppercase"
              >
                Watch Tutorials
              </button>
            </div>

            <p className="text-[0.6875rem] text-supporting-grey italic">
              Built by hospitality operators — not generic software developers.
            </p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-pink text-[10px] font-bold uppercase tracking-widest mb-2">{slides[currentSlide].subtitle}</p>
                    <h2 className="text-white text-2xl md:text-3xl font-black mb-6 leading-tight">{slides[currentSlide].title}</h2>
                    <a 
                      href={slides[currentSlide].link}
                      className="inline-flex items-center gap-2 bg-pink text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-pink-light transition-colors"
                    >
                      {slides[currentSlide].buttonText}
                      <ChevronRight size={14} />
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200&h=1200" 
                alt="Luxury hotel pool scene" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </AnimatePresence>
          
          {slides.length > 1 && (
            <>
              <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2">
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'bg-pink w-6' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Product Tabs Overlay - Only show if no slides or as a secondary navigation */}
          {!slides.length && (
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
              {['OPERATIONS', 'GUEST EXPERIENCE', 'F&B', 'FINANCE'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-[0.6875rem] font-bold transition-colors ${
                    activeTab === tab ? 'bg-pink text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-6">
                <div className="w-20 h-20 bg-pink rounded-full flex items-center justify-center text-black">
                  <Play size={32} fill="currentColor" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Quantum Platform Walkthrough</h3>
                  <p className="opacity-60">Learn how to optimize your hotel in 5 minutes.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
