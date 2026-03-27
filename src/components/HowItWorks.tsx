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
    <section id="how-it-works" className="section-padding bg-black text-white border-b border-white/5">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-20 items-end mb-20 md:mb-32">
          <div className="space-y-8">
            <span className="text-caps-s text-pink">The Process</span>
            <h2 className="text-h2-caps">How it <br /> <span className="text-pink">Works</span></h2>
          </div>
          <p className="text-body-l opacity-60 max-w-md pb-4">
            No complicated integrations. No long implementation cycles. Just simple, effective tools ready to work for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.8, 0, 0.2, 1] }}
              className="space-y-8 group"
            >
              <div className="flex items-center gap-6">
                <div className="text-[1.5rem] font-black text-pink w-12 h-12 rounded-xl bg-pink/10 flex items-center justify-center border border-pink/20">
                  {step.num}
                </div>
                <div className="h-px flex-1 bg-white/10 group-hover:bg-pink/30 transition-colors" />
              </div>
              <div className="space-y-4">
                <h3 className="text-h6 uppercase tracking-tight">{step.title}</h3>
                <p className="text-body-m opacity-60 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
