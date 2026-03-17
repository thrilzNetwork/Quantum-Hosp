import { motion } from 'motion/react';

export default function FounderSection() {
  return (
    <section className="py-20 md:py-32 bg-black text-white overflow-hidden relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-4">
              <span className="text-caps-s text-pink">Built by a Hotel General Manager</span>
              <h2 className="text-[2.5rem] md:text-h3 leading-tight">Practical tools from real experience</h2>
            </div>
            
            <div className="space-y-6 text-body-m opacity-80 max-w-lg">
              <p>
                Quantum Hospitality Solutions was created by a hotel operator who understands the real challenges of hospitality.
              </p>
              <p>
                These tools are built from real operational needs inside hotels — not theoretical software ideas.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 md:gap-8 pt-4">
              {['Practical', 'Simple', 'Deployable'].map((word) => (
                <div key={word} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink"></div>
                  <span className="text-caps-s font-bold">{word}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-grey"
          >
            <img 
              src="https://picsum.photos/seed/founder/800/800" 
              alt="Hotel General Manager" 
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <div className="text-h6">Built by operators</div>
              <div className="text-caps-s opacity-70">For operators</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
