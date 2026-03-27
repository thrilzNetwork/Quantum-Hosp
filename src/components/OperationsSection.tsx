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
    <section id="tools" className="py-20 md:py-32 bg-black text-white border-b border-white/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-pink/5 blur-[120px] rounded-full -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink/5 blur-[120px] rounded-full translate-x-1/2" />

      <div className="container relative z-10">
        <div className="max-w-xl mb-16 space-y-4">
          <span className="text-caps-s text-pink">Featured Tools</span>
          <h2 className="text-h3 font-black uppercase tracking-tight">Operational Excellence</h2>
          <p className="text-body-m opacity-60">
            Simple, product-first solutions for every department. No fluff, just operational efficiency.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-6">
          {tools.map((tool) => (
            <motion.div 
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedTool(tool)}
              className={`${tool.span} group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 hover:border-pink/30 transition-all p-8 md:p-12 min-h-[350px] md:min-h-[450px]`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-x-3 mb-6">
                  <span className="text-caps-s font-bold text-pink">{tool.name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="text-[0.625rem] font-black uppercase tracking-widest text-white/40">{tool.tag}</span>
                </div>
                <h3 className="text-h4 font-black uppercase tracking-tight mb-4">{tool.name}</h3>
                <p className="text-body-m opacity-60 max-w-lg mb-8 leading-relaxed">
                  {tool.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="text-[0.625rem] font-black uppercase tracking-widest text-white/40">Key Features:</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tool.features?.map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
                  <div className="text-[0.625rem] font-black uppercase tracking-widest text-white/40 mb-2">Use Case:</div>
                  <p className="text-sm font-bold text-white/90 leading-relaxed">{tool.useCase}</p>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 relative z-10">
                <button 
                  onClick={(e) => handleBuyNow(e, tool.productId)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-pink text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-pink/20"
                >
                  <ShoppingCart size={14} /> Buy Now
                </button>
                {tool.productId ? (
                  <Link 
                    to={`/product/${tool.productId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    <Info size={14} /> Learn More
                  </Link>
                ) : (
                  <div className="flex items-center gap-x-2 text-[0.625rem] font-black uppercase tracking-widest text-white/60 group-hover:text-pink transition-colors">
                    <span>Deploy instantly</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>

              {/* Decorative background seed */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-20 pointer-events-none blur-3xl bg-pink/10 rounded-full group-hover:bg-pink/20 transition-colors"></div>
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
            <div className={`p-10 rounded-3xl bg-zinc-900 border border-white/10`}>
              <div className="text-caps-s text-pink mb-2">{selectedTool.tag}</div>
              <h4 className="text-h4 font-black uppercase tracking-tight mb-4">{selectedTool.name}</h4>
              <p className="text-body-m opacity-60 leading-relaxed">{selectedTool.description}</p>
            </div>

            <div className="space-y-6">
              <h5 className="text-[0.625rem] font-black uppercase tracking-widest text-white/40">Key Features</h5>
              <div className="grid gap-3">
                {selectedTool.features?.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-pink/20 transition-colors">
                    <CheckCircle2 size={18} className="text-pink" />
                    <span className="text-sm font-bold text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-black border border-white/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink/5 blur-3xl rounded-full" />
              <div className="flex items-center gap-3 text-pink relative z-10">
                <Zap size={18} fill="currentColor" />
                <span className="text-[0.625rem] font-black uppercase tracking-widest">Instant Deployment</span>
              </div>
              <p className="text-sm font-bold text-white/60 leading-relaxed relative z-10">This tool can be activated for your hotel in less than 5 minutes. No integration required.</p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                  onClick={(e) => handleBuyNow(e, selectedTool.productId)}
                  className="flex-1 bg-pink text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>
                {selectedTool.productId && (
                  <Link 
                    to={`/product/${selectedTool.productId}`}
                    className="flex-1 bg-white/5 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10"
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
