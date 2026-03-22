import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, CheckCircle2, Zap, ShoppingCart, Info } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import Modal from './Modal';
import { Tool, Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function OperationsSection() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <section id="tools" className="py-32 bg-black text-white border-b border-white/10">
      <div className="container">
        <h2 className="text-h3 mb-16">Featured Tools</h2>
        
        <div className="grid gap-6 md:grid-cols-6">
          {tools.map((tool) => (
            <motion.div 
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedTool(tool)}
              className={`${tool.span} group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-2xl ${tool.color} ${tool.textColor || 'text-black'} p-6 md:p-12 min-h-[400px] md:min-h-[450px]`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-x-3 mb-6">
                  <span className="text-caps-s font-bold">{tool.name}</span>
                  <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                  <span className="text-[0.6875rem] opacity-70">{tool.tag}</span>
                </div>
                <h3 className="text-h4 mb-4">{tool.name}</h3>
                <p className="text-body-m opacity-80 max-w-lg mb-8">
                  {tool.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="text-caps-s opacity-60">Features:</div>
                  <ul className="grid grid-cols-2 gap-2">
                    {tool.features?.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 rounded-full bg-current"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                  <div className="text-caps-s opacity-60 mb-1">Use Case:</div>
                  <p className="text-sm font-medium">{tool.useCase}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 relative z-10">
                <button 
                  onClick={(e) => handleBuyNow(e, tool.productId)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                >
                  <ShoppingCart size={14} /> Buy Now
                </button>
                {tool.productId ? (
                  <Link 
                    to={`/product/${tool.productId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-bold hover:bg-white/30 transition-all"
                  >
                    <Info size={14} /> Learn More
                  </Link>
                ) : (
                  <div className="flex items-center gap-x-2 text-caps-s font-bold">
                    <span>Deploy instantly</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>

              {/* Decorative background seed */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10 pointer-events-none blur-3xl bg-current rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedTool} 
        onClose={() => setSelectedTool(null)}
        title={selectedTool?.name}
      >
        {selectedTool && (
          <div className="space-y-8">
            <div className={`p-8 rounded-2xl ${selectedTool.color} ${selectedTool.textColor || 'text-black'}`}>
              <div className="text-caps-s font-bold mb-2">{selectedTool.tag}</div>
              <h4 className="text-h4 mb-4">{selectedTool.name}</h4>
              <p className="opacity-80">{selectedTool.description}</p>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-bold uppercase tracking-widest opacity-40">Key Features</h5>
              <div className="grid gap-3">
                {selectedTool.features?.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-black/5">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black text-white space-y-4">
              <div className="flex items-center gap-2 text-pink">
                <Zap size={18} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-widest">Instant Deployment</span>
              </div>
              <p className="text-sm opacity-70">This tool can be activated for your hotel in less than 5 minutes. No integration required.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={(e) => handleBuyNow(e, selectedTool.productId)}
                  className="flex-1 bg-pink text-black py-4 rounded-xl font-bold hover:bg-pink-light transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>
                {selectedTool.productId && (
                  <Link 
                    to={`/product/${selectedTool.productId}`}
                    className="flex-1 bg-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Info size={18} /> Learn More
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
