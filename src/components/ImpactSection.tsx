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
  const otherTools = [
    {
      name: 'ShuttleFlow',
      tag: 'Scheduling',
      description: 'Airport shuttle signup and scheduling system. Guests register for shuttle times using an iPad, QR code, or mobile page.',
      impact: 'Reduces front desk workload and improves shuttle organization.',
      color: 'bg-zinc-900',
      textColor: 'text-white'
    },
    {
      name: 'DirectoryOS',
      tag: 'Guest Services',
      description: 'Digital guest directory that works like an app. Access hotel services, restaurant menus, amenities, and local recommendations.',
      impact: 'All accessible from phone. No printed directories needed.',
      color: 'bg-zinc-900',
      textColor: 'text-white'
    },
    {
      name: 'SEO Engine',
      tag: 'Marketing',
      description: 'Hospitality SEO optimization tools. Improve hotel website visibility through automated analysis and optimization recommendations.',
      impact: 'Increase direct bookings through better search visibility.',
      color: 'bg-zinc-900',
      textColor: 'text-white'
    },
    {
      name: 'Content Studio',
      tag: 'Marketing',
      description: 'AI-powered marketing content generator. Create social media posts, event promotions, and restaurant announcements.',
      impact: 'All aligned with your brand voice. Save hours on content creation.',
      color: 'bg-zinc-900',
      textColor: 'text-white'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-black border-b border-white/10 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink/5 blur-[120px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink/5 blur-[120px] rounded-full translate-y-1/2" />

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-caps-s text-pink">Operational Excellence</span>
            <h2 className="text-h3 font-black uppercase tracking-tight">Browse All Tools</h2>
            <p className="text-body-m opacity-60">
              Simple, product-first solutions for every department. No fluff, just operational efficiency.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherTools.map((tool, i) => (
            <motion.div 
              key={tool.name}
              className={`rounded-3xl ${tool.color} ${tool.textColor || 'text-black'} p-8 flex flex-col justify-between min-h-[320px] border border-white/10 hover:border-pink/30 transition-all group`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                <div className="text-caps-s text-pink mb-4 group-hover:translate-x-1 transition-transform">{tool.tag}</div>
                <h3 className="text-h6 font-bold mb-4 uppercase tracking-tight">{tool.name}</h3>
                <p className="text-sm opacity-60 mb-6 leading-relaxed">{tool.description}</p>
              </div>
              <div className="pt-6 border-t border-white/10">
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-white/40 mb-2">Impact:</div>
                <p className="text-sm font-bold text-white/90">{tool.impact}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
