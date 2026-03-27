import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, ChevronRight, ArrowRight, Zap, ShieldCheck, Globe, Package, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useCart } from '../context/CartContext';
import { Product, ProductCategory } from '../types';

export default function StoreSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const categories: { label: string; value: ProductCategory | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pins', value: 'pin' },
    { label: 'Tools', value: 'tool' },
    { label: 'Books', value: 'book' },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const getSubcategoryLabel = (product: Product) => {
    if (product.category === 'pin' && product.pinSubcategory) {
      return product.pinSubcategory.charAt(0).toUpperCase() + product.pinSubcategory.slice(1);
    }
    return product.category.charAt(0).toUpperCase() + product.category.slice(1);
  };

  return (
    <section id="store" className="section-padding bg-black">
      <div className="container">
        <div className="max-w-4xl mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-px bg-pink" />
            <span className="text-caps-s text-pink font-black">Marketplace</span>
          </motion.div>
          <h2 className="text-h2-caps font-black uppercase leading-[0.85] tracking-tighter text-white mb-10">
            The <span className="text-pink">Quantum</span> Store
          </h2>
          <p className="text-body-l opacity-100 text-white/90 max-w-3xl mb-16 font-medium">
            Curated hospitality essentials. From iconic enamel pins to powerful operational frameworks, every item is designed to help you master the art of service.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
            {[
              { icon: Zap, label: 'Instant Access' },
              { icon: ShieldCheck, label: 'Secure Checkout' },
              { icon: Package, label: 'Global Shipping' },
              { icon: Globe, label: 'Operator Built' }
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/40"
              >
                <item.icon size={16} className="text-pink" />
                <span>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20 border-b border-white/5 pb-12">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat.value 
                    ? 'bg-pink text-black shadow-lg shadow-pink/20' 
                    : 'glass text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </div>
        </div>

        <div className="py-40 text-center glass rounded-[3rem] mb-32 relative overflow-hidden group">
          <div className="absolute inset-0 bg-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-pink/20 text-pink mb-4">
              <Zap size={14} className="animate-pulse" />
              <span className="text-caps-s">Coming Soon</span>
            </div>
            <h3 className="text-h3-caps text-white/20">Marketplace <br /> <span className="text-white/5">Under Construction</span></h3>
            <p className="text-body-m text-white/40 max-w-md mx-auto">
              We're curating the ultimate collection of hospitality essentials. Sign up to be notified when we launch.
            </p>
            <div className="pt-10">
              <button 
                onClick={() => window.location.href = 'mailto:alejandrosoria@me.com?subject=Marketplace Waitlist'}
                className="btn-secondary px-12"
              >
                Join the Waitlist
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
