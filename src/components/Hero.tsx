import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, X } from 'lucide-react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('OPERATIONS');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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
    <section className="bg-white py-6">
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
              <span className="text-caps-s">Quantum Hospitality Solutions</span>
            </div>
            
            <h1 className="text-[2.5rem] md:text-h3-caps leading-[0.9]">
              AI-Powered <br className="hidden md:block" /> Tools for <br className="hidden md:block" /> Modern Hotel <br className="hidden md:block" /> Operations
            </h1>
            
            <p className="text-body-m opacity-80 max-w-md">
              AI-powered operational tools built by a hotel general manager to solve real hospitality problems. Improve operations, increase guest satisfaction, and deploy tools instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#tools" 
                onClick={handleScrollToTools}
                className="btn bg-pink text-black px-8 py-4 rounded-full text-caps-s font-bold hover:bg-pink-light transition-colors group w-full sm:w-fit"
              >
                Browse Tools
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="btn border border-white/20 text-white px-8 py-4 rounded-full text-caps-s font-bold hover:bg-white/10 transition-colors w-full sm:w-fit"
              >
                Watch Tutorials
              </button>
            </div>

            <p className="text-[0.6875rem] text-supporting-grey italic">
              Built by hospitality operators — not generic software developers.
            </p>
          </motion.div>
        </div>

        <div className="bg-pink-lightest rounded-2xl overflow-hidden relative aspect-square lg:aspect-auto">
          <img 
            src="https://static.vecteezy.com/system/resources/thumbnails/011/002/798/small_2x/hotel-reception-bell-photo.JPG" 
            alt="High scale hotel front desk bell" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          
          {/* Product Tabs Overlay */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
            {['OPERATIONS', 'GUEST EXPERIENCE', 'F&B', 'FINANCE'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[0.6875rem] font-bold transition-colors ${
                  activeTab === tab ? 'bg-black text-white' : 'bg-black/40 text-white hover:bg-black/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
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
