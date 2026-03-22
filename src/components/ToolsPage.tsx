import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Info, Search, Filter, ChevronRight } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Tool, Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    const qTools = query(collection(db, 'tools'), orderBy('name'));
    const unsubTools = onSnapshot(qTools, (snapshot) => {
      setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tools');
    });

    const qProducts = query(collection(db, 'products'));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    return () => {
      unsubTools();
      unsubProducts();
    };
  }, []);

  const handleBuyNow = (e: React.MouseEvent, productId?: string) => {
    e.stopPropagation();
    if (!productId) return;
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product);
    }
  };

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 bg-black text-white min-h-screen">
      <div className="container">
        <div className="max-w-3xl mb-16">
          <h1 className="text-h2-caps mb-6 text-white">Browse All Tools</h1>
          <p className="text-body-l text-white/60">
            Explore our full suite of AI-powered operational tools designed specifically for hospitality professionals.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Search tools by name, tag, or description..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-pink transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-pink text-black rounded-2xl font-bold hover:bg-pink-light transition-all">
            <Filter size={20} /> Filter
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                layout
                key={tool.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex flex-col rounded-3xl overflow-hidden border border-white/10 hover:shadow-pink/10 hover:shadow-2xl transition-all duration-500`}
              >
                <div className={`p-8 ${tool.color} ${tool.textColor || 'text-black'} flex-1 flex flex-col`}>
                  <div className="flex items-center gap-x-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{tool.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                    {tool.productId && (
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                        {products.find(p => p.id === tool.productId)?.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{tool.name}</h3>
                  <p className="text-sm opacity-80 mb-8 flex-1">
                    {tool.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {tool.features?.slice(0, 3).map(feature => (
                      <div key={feature} className="flex items-center gap-2 text-[11px] font-medium">
                        <div className="w-1 h-1 rounded-full bg-current"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={(e) => handleBuyNow(e, tool.productId)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                      <ShoppingCart size={16} /> Buy Now
                    </button>
                    {tool.productId && (
                      <Link 
                        to={`/product/${tool.productId}`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-bold hover:bg-white/30 transition-all"
                      >
                        <Info size={16} /> Learn More
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-supporting-grey">No tools found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
