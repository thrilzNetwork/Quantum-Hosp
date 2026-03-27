import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    title: 'GuestHouse Hotels transform guest experience with Mews',
    stat: '45%',
    statLabel: 'increase in direct bookings',
    color: 'bg-yellow',
    image: 'https://picsum.photos/seed/guesthouse/800/600',
  },
  {
    title: '9Hotel Collection shows the way with outstanding performance',
    stat: '45%',
    statLabel: 'increase in RevPAR',
    color: 'bg-blue',
    image: 'https://picsum.photos/seed/9hotel/800/600',
  },
  {
    title: 'C-Hotels chooses modern, flexible hospitality system',
    stat: '93%',
    statLabel: 'Reduction in calls',
    color: 'bg-charcoal',
    textColor: 'text-white',
    image: 'https://picsum.photos/seed/chotels/800/600',
  },
];

export default function ImpactSection() {
  return (
    <section className="section-padding bg-black text-white relative overflow-hidden border-b border-white/5">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 animate-glow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 animate-glow" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10">
        <div className="max-w-4xl mb-24 md:mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-pink/20 text-pink mb-10"
          >
            <div className="w-2 h-2 rounded-full bg-pink animate-pulse" />
            <span className="text-caps-s">Real Impact</span>
          </motion.div>
          <h2 className="text-h2-caps mb-10">
            Proven Results for <br />
            <span className="text-pink">Modern</span> Operators.
          </h2>
          <p className="text-body-l text-white/70 font-medium leading-tight max-w-2xl">
            We don't just build tools; we deliver measurable operational improvements. See how our solutions are transforming properties across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {caseStudies.map((study, i) => (
            <motion.div 
              key={study.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col rounded-[3rem] overflow-hidden glass border-white/5 hover:border-pink/30 transition-all duration-700 hover:shadow-2xl hover:shadow-pink/5"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={study.image} 
                  alt={study.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-8 left-8 px-5 py-2 rounded-2xl glass border-white/20 ${study.textColor || 'text-white'} text-[10px] font-black uppercase tracking-widest`}>
                  Case Study
                </div>
              </div>
              
              <div className="p-12 flex flex-col flex-1">
                <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-10 group-hover:text-pink transition-colors">
                  {study.title}
                </h3>
                
                <div className="mt-auto pt-10 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="text-5xl font-black text-white leading-none tracking-tighter mb-2">
                      {study.stat}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                      {study.statLabel}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl glass border-white/10 flex items-center justify-center text-white/40 group-hover:bg-pink group-hover:text-black group-hover:border-pink transition-all duration-500 group-hover:rotate-12">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 pt-32 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { label: 'Active Users', value: '2.5k+' },
              { label: 'Properties', value: '450+' },
              { label: 'Revenue Generated', value: '$12M+' },
              { label: 'Time Saved', value: '15k hrs' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left space-y-2"
              >
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-pink">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
