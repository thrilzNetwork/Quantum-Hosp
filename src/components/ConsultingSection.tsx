import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Calendar } from 'lucide-react';
import ContactModal from './ContactModal';

export default function ConsultingSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section id="consulting" className="relative py-32 text-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-black z-0"
        style={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
      >
        <div 
          className="absolute inset-0 bg-black hidden md:block"
          style={{ clipPath: 'inset(0% 5% 0% 5% round 60px)' }}
        ></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-[2.5rem] md:text-[5rem] font-black uppercase leading-[1.1] md:leading-none tracking-tighter mb-8">
            Need help <br /> with automation?
          </h2>
          
          <p className="text-xl opacity-70 mb-12">
            We can help design systems tailored to your operation. Book a consultation to see how we can implement these tools in your property.
          </p>

          <button 
            onClick={() => setIsContactOpen(true)}
            className="btn bg-pink text-black px-10 py-5 rounded-full text-caps-s font-bold hover:bg-pink-light transition-colors group inline-flex items-center"
          >
            <Calendar size={20} className="mr-2" />
            Book a consultation
            <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
}
