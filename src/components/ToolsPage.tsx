import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Info, Search, Filter, ChevronRight, Mail, Calendar, Eye } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Tool, Product, SiteSettings } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
    if (settings?.googleCalendarBookingLink) {
      window.open(settings.googleCalendarBookingLink, '_blank');
    } else {
      setIsBookingOpen(true);
    }
  };

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
    <div className="pt-40 pb-24 bg-black text-white min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest mb-8">
            The Full Suite
          </div>
          <h1 className="text-[3.5rem] md:text-h1-caps font-black uppercase leading-[0.85] tracking-tighter text-white mb-10">
            Browse All <span className="text-pink">Tools</span>.
          </h1>
          <p className="text-body-l text-white/60 font-medium leading-relaxed max-w-2xl">
            Explore our full suite of AI-powered operational tools designed specifically for hospitality professionals.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search tools by name, tag, or description..."
              className="w-full pl-16 pr-8 py-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-pink transition-all outline-none font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-3 px-10 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-white/10 transition-all">
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
                className="group flex flex-col rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-pink/30 transition-all duration-500 bg-white/5"
              >
                <div className={`p-10 ${tool.color} ${tool.textColor || 'text-black'} flex-1 flex flex-col relative overflow-hidden`}>
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[size:20px_20px]"></div>
                  
                  <div className="relative z-10 flex items-center gap-x-3 mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-black/10 rounded-full border border-black/5">{tool.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                    {tool.productId && (
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {products.find(p => p.id === tool.productId)?.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="relative z-10 text-3xl font-black mb-2 uppercase tracking-tight leading-none">{tool.name}</h3>
                  {tool.headline && (
                    <p className="relative z-10 text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">
                      {tool.headline}
                    </p>
                  )}
                  <p className="relative z-10 text-sm font-medium opacity-80 mb-10 flex-1 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="relative z-10 space-y-4 mb-10">
                    {tool.features?.slice(0, 3).map(feature => (
                      <div key={feature} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex flex-col gap-3">
                    <button 
                      onClick={handleBookCall}
                      className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl"
                    >
                      <Calendar size={18} /> Book a Call
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to={`/tool/${tool.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                      >
                        <Eye size={16} /> Preview
                      </Link>
                      {tool.productId ? (
                        <Link 
                          to={`/product/${tool.productId}`}
                          className="flex items-center justify-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                        >
                          <Info size={16} /> Learn More
                        </Link>
                      ) : (
                        <Link 
                          to={`/tool/${tool.id}`}
                          className="flex items-center justify-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                        >
                          <Info size={16} /> Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5">
            <p className="text-white/20 font-black uppercase tracking-widest">No tools found matching your search.</p>
          </div>
        )}
      </div>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
