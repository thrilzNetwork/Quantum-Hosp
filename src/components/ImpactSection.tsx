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
      color: 'bg-yellow'
    },
    {
      name: 'DirectoryOS',
      tag: 'Guest Services',
      description: 'Digital guest directory that works like an app. Access hotel services, restaurant menus, amenities, and local recommendations.',
      impact: 'All accessible from phone. No printed directories needed.',
      color: 'bg-blue'
    },
    {
      name: 'SEO Engine',
      tag: 'Marketing',
      description: 'Hospitality SEO optimization tools. Improve hotel website visibility through automated analysis and optimization recommendations.',
      impact: 'Increase direct bookings through better search visibility.',
      color: 'bg-pink-light'
    },
    {
      name: 'Content Studio',
      tag: 'Marketing',
      description: 'AI-powered marketing content generator. Create social media posts, event promotions, and restaurant announcements.',
      impact: 'All aligned with your brand voice. Save hours on content creation.',
      color: 'bg-white/10',
      textColor: 'text-white'
    }
  ];

  return (
    <section className="py-32 bg-black border-b border-white/10 text-white">
      <div className="container">
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-xl space-y-4">
            <h2 className="text-h3">Browse All Tools</h2>
            <p className="text-body-m opacity-70">
              Simple, product-first solutions for every department. No fluff, just operational efficiency.
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {otherTools.map((tool, i) => (
            <motion.div 
              key={tool.name}
              className={`rounded-2xl ${tool.color} ${tool.textColor || 'text-black'} p-8 flex flex-col justify-between min-h-[320px] min-w-[280px] md:min-w-0 snap-center`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                <div className="text-caps-s opacity-60 mb-4">{tool.tag}</div>
                <h3 className="text-h6 mb-4">{tool.name}</h3>
                <p className="text-sm opacity-80 mb-6">{tool.description}</p>
              </div>
              <div className="pt-6 border-t border-current/10">
                <div className="text-[0.6875rem] font-bold uppercase tracking-wider opacity-60 mb-1">Impact:</div>
                <p className="text-sm font-medium">{tool.impact}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
