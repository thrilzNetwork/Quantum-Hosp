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
    <section id="how-it-works" className="py-16 md:py-32 bg-black text-white border-b border-white/5">
      <div className="container">
        <div className="max-w-xl mb-10 md:mb-20">
          <h2 className="text-[2.5rem] md:text-h3-caps leading-[0.9] mb-4 md:mb-8">How it works</h2>
          <p className="text-body-m opacity-70 font-medium">
            No complicated integrations. No long implementation cycles. Just simple, effective tools ready to work for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6 group"
            >
              <div className="text-[5rem] font-black text-pink/20 leading-none group-hover:text-pink/40 transition-colors duration-500">{step.num}</div>
              <h3 className="text-h6 uppercase tracking-tight">{step.title}</h3>
              <p className="text-body-m opacity-70 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
