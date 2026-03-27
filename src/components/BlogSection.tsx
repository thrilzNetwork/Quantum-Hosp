import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, ExternalLink } from 'lucide-react';

export default function BlogSection() {
  const featuredPost = {
    title: "Day 01: Founder Journal",
    excerpt: "The journey begins. A raw look into the first day of building Quantum Hospitality Solutions and the vision behind the operational revolution.",
    author: "Alejandro Soria",
    date: "Mar 27, 2026",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200",
    link: "https://medium.com/@AlejandroSoriaQuantum/day-01-founder-journal-ff66e279e5b9",
    category: "Founder Journal"
  };

  return (
    <section id="blog" className="py-24 md:py-40 bg-black text-white border-b border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest">
              Featured Insight
            </div>
            <h2 className="text-[3.5rem] md:text-[5rem] font-black uppercase leading-[0.85] tracking-tighter text-white">
              The <span className="text-pink">Operator's</span> Journal.
            </h2>
            <p className="text-white/40 text-lg font-medium max-w-xl mx-auto">
              Follow the journey of building the future of hospitality operations, one day at a time.
            </p>
          </div>

          <motion.a
            href={featuredPost.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group block relative rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 hover:border-pink/40 transition-all duration-700"
          >
            <div className="grid lg:grid-cols-2 items-center">
              <div className="aspect-[4/3] lg:aspect-square overflow-hidden relative">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-pink text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <ExternalLink size={24} />
                  </div>
                </div>
              </div>
              
              <div className="p-10 md:p-16 space-y-8">
                <div className="flex items-center gap-6 text-[10px] font-black text-pink uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {featuredPost.date}</span>
                  <span className="flex items-center gap-2"><User size={14} /> {featuredPost.author}</span>
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{featuredPost.category}</span>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] group-hover:text-pink transition-colors">
                    {featuredPost.title}
                  </h3>
                </div>

                <p className="text-white/60 text-lg font-medium leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-8 border-t border-white/10">
                  <div className="inline-flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs group-hover:gap-6 transition-all">
                    Read Full Entry <ArrowRight size={20} className="text-pink" />
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
