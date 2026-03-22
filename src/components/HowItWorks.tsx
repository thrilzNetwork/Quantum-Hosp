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
    <section id="how-it-works" className="py-16 md:py-32 bg-black text-white border-b border-white/10">
      <div className="container">
        <div className="max-w-xl mb-10 md:mb-20">
          <h2 className="text-[2rem] md:text-h3 leading-tight mb-4 md:mb-6">How it works</h2>
          <p className="text-body-m opacity-70">
            No complicated integrations. No long implementation cycles. Just simple, effective tools ready to work for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="text-[4rem] font-black text-pink/20 leading-none">{step.num}</div>
              <h3 className="text-h6">{step.title}</h3>
              <p className="text-body-m opacity-70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
