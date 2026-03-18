import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { books } from '../data/products';

export default function FreeResource() {
  const { addItem } = useCart();
  const book = books[0];

  return (
    <section id="resources" className="py-20 md:py-32 bg-pink-lightest">
      <div className="container">
        <div className="bg-white rounded-3xl p-6 md:p-16 lg:p-24 flex flex-col lg:flex-row gap-12 md:gap-16 items-center shadow-sm">
          <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="text-caps-s text-black/60">Featured Book</span>
              <h2 className="text-[2rem] md:text-h3 leading-tight">Somehow I Managed — Hospitality Edition</h2>
              <p className="text-body-m opacity-70 max-w-md mx-auto lg:mx-0">
                A practical guide for hotel operators navigating the chaos of daily operations. Learn how experienced operators manage teams, guests, and systems in the real world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => addItem(book)}
                className="btn bg-black text-white px-8 py-4 rounded-full text-caps-s font-bold hover:bg-black/80 transition-colors inline-flex items-center gap-2 w-full sm:w-fit"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                Add to Cart — ${book.price.toFixed(2)}
              </button>
            </div>

            <p className="text-xs opacity-40 italic">Instant PDF download after purchase.</p>
          </div>

          <motion.div
            initial={{ rotate: -5, y: 20 }}
            whileInView={{ rotate: -2, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-[280px] md:max-w-sm aspect-[3/4] bg-black rounded-xl shadow-2xl p-8 md:p-12 flex flex-col justify-between text-white"
            aria-hidden="true"
          >
            <div className="space-y-2">
              <div className="text-caps-s opacity-60">Hospitality Edition</div>
              <div className="text-2xl font-black uppercase tracking-tighter leading-tight">
                Somehow <br /> I Managed
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-1 w-12 bg-pink"></div>
              <div className="text-sm opacity-60 italic">
                A guide for the modern hotel operator.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
