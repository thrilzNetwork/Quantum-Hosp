import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, CheckCircle2, Zap, ShoppingCart, Info, Mail, Calendar, Eye } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import Modal from './Modal';
import { Tool, Product, SiteSettings } from '../types';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';

export default function OperationsSection() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });

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
      unsubSettings();
      unsubTools();
      unsubProducts();
    };
  }, []);

  const handleBookCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = 'mailto:alejandrosoria@me.com';
  };

  const handleBuyNow = (e: React.MouseEvent, productId?: string) => {
    e.stopPropagation();
    if (!productId) return;
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product);
    }
  };

  return (
    <section id="tools" className="section-padding bg-black text-white border-b border-white/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full -translate-x-1/2 animate-glow" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full translate-x-1/2" />

      <div className="container relative z-10">
        <div className="max-w-3xl mb-20 md:mb-32 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-1 rounded-full glass border-pink/20 text-pink"
          >
            <Zap size={14} className="animate-pulse" />
            <span className="text-caps-s">Featured Tools</span>
          </motion.div>
          <h2 className="text-h2-caps font-black uppercase tracking-tight">Operational <span className="text-pink">Excellence</span></h2>
          <p className="text-body-l opacity-100 text-white/90 max-w-2xl">
            Simple, product-first solutions for every department. No fluff, just operational efficiency.
          </p>
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
            <h3 className="text-h3-caps text-white/20">Operational Tools <br /> <span className="text-white/5">In Development</span></h3>
            <p className="text-body-m text-white/40 max-w-md mx-auto">
              We're building the next generation of hospitality tools. Get early access to our beta release.
            </p>
            <div className="pt-10">
              <button 
                onClick={() => window.location.href = 'mailto:alejandrosoria@me.com?subject=Tools Beta Access'}
                className="btn-secondary px-12"
              >
                Request Beta Access
              </button>
            </div>
          </motion.div>
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
              <p className="text-body-m opacity-100 text-white/90 leading-relaxed">{selectedTool.description}</p>
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
                  onClick={() => window.location.href = 'mailto:alejandrosoria@me.com'}
                  className="flex-1 bg-pink text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
                >
                  <Mail size={18} /> Contact Alejandro
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
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}
