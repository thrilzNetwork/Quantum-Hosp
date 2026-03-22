import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, ChevronRight, ArrowRight } from 'lucide-react';
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
        <div className="max-w-3xl mb-10 md:mb-16">
          <h2 className="text-[2rem] md:text-h2-caps mb-4 md:mb-6 text-white">The Quantum Store</h2>
          <p className="text-body-l opacity-60 text-white">
            High-quality enamel pins for hospitality professionals, digital tools for your hotel, and resources to level up your operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-6 py-2.5 rounded-full text-caps-s font-bold transition-all ${
                activeCategory === cat.value 
                  ? 'bg-pink text-black' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 mb-6">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-pink text-black px-3 py-1 rounded-full text-[0.625rem] font-bold uppercase tracking-wider">
                      {product.badge}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link to={`/product/${product.id}`} className="block group/title">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-caps-s font-bold group-hover/title:text-pink transition-colors text-white">{product.name}</h3>
                      <span className="text-caps-s font-bold text-white">${product.price}</span>
                    </div>
                  </Link>
                  <p className="text-[0.6875rem] text-supporting-grey uppercase tracking-widest mb-3">
                    {getSubcategoryLabel(product)}
                  </p>
                  <p className="text-body-s opacity-60 line-clamp-2 mb-4 text-white">
                    {product.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        addedItems[product.id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-pink text-black hover:bg-pink-light'
                      }`}
                    >
                      {addedItems[product.id] ? <Check size={14} /> : <ShoppingCart size={14} />}
                      {addedItems[product.id] ? 'Added' : 'Buy Now'}
                    </button>
                    <Link 
                      to={`/product/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-supporting-grey">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
