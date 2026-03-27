import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, ChevronRight, ArrowRight, Zap, ShieldCheck, Globe, Package } from 'lucide-react';
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
    <section id="store" className="bg-black py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl mb-12 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[1px] bg-pink"></span>
            <span className="text-caps-s text-pink font-bold">Marketplace</span>
          </div>
          <h2 className="text-[3rem] md:text-[5rem] font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
            The <span className="text-pink">Quantum</span> Store
          </h2>
          <p className="text-body-l opacity-80 text-white max-w-2xl mb-8">
            Curated hospitality essentials. From iconic enamel pins to powerful operational frameworks, every item is designed to help you master the art of service.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Zap size={14} className="text-pink" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <ShieldCheck size={14} className="text-pink" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Package size={14} className="text-pink" />
              <span>Global Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Globe size={14} className="text-pink" />
              <span>Operator Built</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat.value 
                    ? 'bg-pink text-black' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-24">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#111] mb-6">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                      </span>
                    </div>
                  </Link>
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter">
                      {product.badge}
                    </div>
                  )}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-pink text-black rounded-full flex items-center justify-center transform translate-y-12 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
                  >
                    {addedItems[product.id] ? <Check size={18} /> : <ShoppingCart size={18} />}
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-bold text-pink uppercase tracking-[0.2em] mb-1">
                        {getSubcategoryLabel(product)}
                      </p>
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="text-sm font-bold text-white group-hover:text-pink transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                    <span className="text-sm font-medium text-white/90">${product.price}</span>
                  </div>
                  
                  <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <Link 
                      to={`/product/${product.id}`}
                      className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-pink transition-colors group/link"
                    >
                      View Details
                      <ArrowRight size={12} className="transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-tighter italic">
                      Operator Approved
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-3xl mb-24">
            <p className="text-supporting-grey">No products found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
}
