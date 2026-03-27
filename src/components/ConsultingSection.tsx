import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Calendar } from 'lucide-react';
import BookingModal from './BookingModal';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export default function ConsultingSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsub;
  }, []);

  const handleBooking = () => {
    window.location.href = 'mailto:alejandrosoria@me.com';
  };

  return (
    <section id="consulting" className="relative py-24 md:py-32 text-center text-white overflow-hidden bg-black border-b border-white/5">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink/5 blur-[150px] rounded-full"></div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest">
              Expert Guidance
            </div>
            <h2 className="text-[3rem] md:text-h2-caps font-black uppercase leading-[0.85] tracking-tighter text-white">
              Need a <span className="text-pink">Custom</span> Solution?
            </h2>
            <p className="text-body-l text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Beyond the marketplace, I provide direct consulting for complex operational challenges, technology implementation, and leadership development.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={handleBooking}
              className="w-full sm:w-auto px-12 py-6 bg-pink text-black rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-2xl shadow-pink/20 flex items-center justify-center gap-3"
            >
              <Calendar size={20} />
              Book a Consultation
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="mailto:alejandrosoria@me.com"
              className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-white/10 transition-all flex items-center justify-center"
            >
              Send a Message
            </a>
          </div>
        </motion.div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}
