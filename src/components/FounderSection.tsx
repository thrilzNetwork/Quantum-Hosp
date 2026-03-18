import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';

const stats = [
  { value: '10+', label: 'Years in hospitality operations' },
  { value: '6+', label: 'Tools built and deployed' },
  { value: '100%', label: 'Built for operators, by an operator' },
];

export default function FounderSection() {
  return (
    <section className="py-20 md:py-32 bg-black text-white overflow-hidden relative">
      <div className="container">
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="text-caps-s text-pink tracking-[0.15em]">The Mind Behind Quantum</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-black uppercase leading-[1] tracking-tight mb-16 md:mb-20 max-w-4xl"
        >
          Built from the inside.{' '}
          <span className="text-pink">By someone who lived it.</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden bg-charcoal order-1 lg:order-none"
          >
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800&h=1000"
              alt="Alejandro Soria — Founder of Quantum Hospitality Solutions"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            {/* Badge */}
            <div className="absolute top-6 left-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5">
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.1em]">
                  Hospitality Operator · 10+ Years
                </span>
              </div>
            </div>
          </motion.div>

          {/* Body Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 order-2"
          >
            <div className="space-y-6 text-[1.0625rem] leading-relaxed opacity-80">
              <p>
                My name is <span className="text-white font-semibold opacity-100">Alejandro Soria</span>. I've spent over a decade inside hotel operations — managing teams, handling guests, optimizing systems, and watching the same problems repeat themselves every single day.
              </p>
              <p>
                Understaffed front desks drowning in manual requests. Guest experiences that fell apart because of broken communication. Revenue walking out the door because the right tool didn't exist.
              </p>
              <p>
                I didn't build Quantum because I read about hospitality. I built it because I <span className="text-white font-semibold opacity-100">lived it</span> — as a General Manager running one of the most demanding hotel properties in the DFW area.
              </p>
              <p>
                Every tool in the Quantum marketplace was born from a real problem I watched happen in real time. <span className="text-pink font-semibold">Attenda</span> — our in-room ordering system — was built because I knew exactly where guests were dropping off and why. It turned a broken process into real results for a single property.
              </p>
              <p>
                That's the difference. I'm not a tech founder guessing what hotels need. I'm an operator who got tired of waiting for someone else to build the right tools.
              </p>
              <p className="text-white font-semibold text-lg opacity-100">
                So I built them myself.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 md:mt-20"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
            >
              <div className="text-[2.5rem] md:text-[3rem] font-black text-pink leading-none mb-3">
                {stat.value}
              </div>
              <div className="text-caps-s opacity-60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 pt-12 border-t border-white/10"
        >
          <p className="text-[1.25rem] md:text-[1.75rem] lg:text-[2rem] font-black uppercase leading-tight tracking-tight max-w-4xl">
            We don't build tools for hotels.{' '}
            <span className="text-pink">We build tools from inside them.</span>
          </p>

          {/* Signature */}
          <div className="mt-10 flex items-center gap-6">
            <div>
              <div className="text-lg font-bold">Alejandro Soria</div>
              <div className="text-caps-s opacity-60">Founder, Quantum Hospitality Solutions</div>
            </div>
            <a
              href="https://www.linkedin.com/in/alejandrosoria"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Alejandro Soria on LinkedIn"
            >
              <Linkedin size={20} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
