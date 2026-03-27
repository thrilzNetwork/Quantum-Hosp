import { motion } from 'motion/react';

const steps = [
  {
    num: '01',
    title: 'Choose a Tool',
    description: 'Browse the marketplace and select the tool that solves your operational problem.'
  },
  {
    num: '02',
    title: 'Purchase',
    description: 'Secure checkout and instant account activation.'
  },
  {
    num: '03',
    title: 'Deploy',
    description: 'Access your dashboard and start using the tool immediately.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-black text-white border-b border-white/5 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-end mb-24 md:mb-40">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-4 py-1 rounded-full glass border-pink/20 text-pink"
            >
              <div className="w-2 h-2 rounded-full bg-pink animate-pulse" />
              <span className="text-caps-s">The Process</span>
            </motion.div>
            <h2 className="text-h2-caps">How it <br /> <span className="text-pink">Works</span></h2>
          </div>
          <p className="text-body-l opacity-100 text-white/80 max-w-xl pb-6 leading-tight">
            No complicated integrations. No long implementation cycles. Just simple, effective tools ready to work for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10 group"
            >
              <div className="flex items-center gap-8">
                <div className="text-3xl font-black text-pink w-20 h-20 rounded-3xl glass border-pink/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-pink/10">
                  {step.num}
                </div>
                <div className="h-px flex-1 bg-white/10 group-hover:bg-pink/30 transition-colors" />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-pink transition-colors">{step.title}</h3>
                <p className="text-body-m opacity-100 text-white/70 leading-relaxed font-medium">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
