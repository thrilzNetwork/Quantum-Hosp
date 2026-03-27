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
    <section className="py-24 md:py-40 bg-black text-white relative overflow-hidden border-b border-white/5">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink/5 blur-[120px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink/5 blur-[120px] rounded-full translate-y-1/2" />

      <div className="container relative z-10">
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest mb-6">
            Real Impact
          </div>
          <h2 className="text-[3rem] md:text-h3-caps font-black uppercase leading-[0.85] tracking-tighter text-white mb-8">
            Proven Results for <br />
            <span className="text-pink">Modern</span> Operators.
          </h2>
          <p className="text-body-m text-white/60 font-medium leading-relaxed max-w-xl">
            We don't just build tools; we deliver measurable operational improvements. See how our solutions are transforming properties across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, i) => (
            <motion.div 
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group flex flex-col rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 hover:border-pink/30 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={study.image} 
                  alt={study.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-6 left-6 px-4 py-2 rounded-full ${study.color} ${study.textColor || 'text-black'} text-[10px] font-black uppercase tracking-widest`}>
                  Case Study
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-1">
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-8 group-hover:text-pink transition-colors">
                  {study.title}
                </h3>
                
                <div className="mt-auto pt-8 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="text-[3rem] font-black text-white leading-none tracking-tighter mb-1">
                      {study.stat}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      {study.statLabel}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-pink group-hover:text-black group-hover:border-pink transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 pt-20 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Active Users', value: '2.5k+' },
              { label: 'Properties', value: '450+' },
              { label: 'Revenue Generated', value: '$12M+' },
              { label: 'Time Saved', value: '15k hrs' }
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="text-[2.5rem] font-black text-white tracking-tighter mb-1">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-pink">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
