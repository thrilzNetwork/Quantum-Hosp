import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, ArrowRight, Mail, Download, Zap, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'products', id), (docSnap) => {
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `products/${id}`);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <h1 className="text-h3 mb-4">Product not found</h1>
        <Link to="/#store" className="btn bg-pink text-black px-8 py-4 rounded-full font-bold">
          Back to Store
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <Link to="/#store" className="inline-flex items-center gap-3 text-white/40 hover:text-pink mb-16 transition-all group font-black uppercase tracking-widest text-[10px]">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-pink/50 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Store
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 group"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <div className="absolute top-10 left-10 bg-pink text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                {product.badge}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest mb-8 w-fit">
              {product.category} {product.pinSubcategory && `• ${product.pinSubcategory}`}
            </div>
            <h1 className="text-[4rem] md:text-h1-caps font-black uppercase leading-[0.85] tracking-tighter text-white mb-10">
              {product.name}.
            </h1>
            {product.headline && (
              <p className="text-2xl md:text-3xl font-black uppercase tracking-tight text-pink mb-8 leading-tight max-w-xl">
                {product.headline}
              </p>
            )}
            <p className="text-body-l font-medium opacity-100 text-white/90 mb-12 leading-relaxed max-w-xl">
              {product.description}
            </p>

            {product.isComingSoon ? (
              <div className="space-y-10">
                <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-pink text-black font-black uppercase tracking-widest text-xs shadow-2xl">
                  <Clock size={20} />
                  Coming Soon — {product.releaseDate || 'TBA'}
                </div>
                
                <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6 text-white">Notify me when available</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 px-8 py-5 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:border-pink transition-all font-medium"
                    />
                    <button className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-pink transition-all shadow-xl">
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>
            ) : product.contactOnly ? (
              <div className="space-y-12">
                <div className="flex flex-col gap-6">
                  <a 
                    href={`mailto:alejandrosoria@me.com?subject=Inquiry about ${product.name}`}
                    className="flex-1 min-w-[240px] py-6 rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] bg-pink text-black hover:bg-white flex items-center justify-center gap-3"
                  >
                    <Mail size={18} /> Contact Alejandro
                  </a>
                  <p className="text-sm font-bold text-white/40 italic">
                    This is a service-based solution. Contact us for a custom quote and implementation plan.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-pink" />
                    Custom Implementation
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-pink" />
                    Direct Support
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="text-[3.5rem] font-black text-white tracking-tighter leading-none">${product.price}</div>
                <div className="flex flex-wrap gap-6">
                  <button 
                    onClick={() => window.location.href = `mailto:alejandrosoria@me.com?subject=Inquiry about ${product.name}`}
                    className="flex-1 min-w-[240px] py-6 rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] bg-pink text-black hover:bg-white flex items-center justify-center gap-3"
                  >
                    <Mail size={18} /> Contact Alejandro
                  </button>
                  <button className="px-10 py-6 rounded-2xl border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                    Share
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-pink" />
                    Instant Download
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-pink" />
                    Lifetime Support
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Benefits Section */}
        {product.heroBenefits && product.heroBenefits.length > 0 && (
          <section className="py-32 border-t border-white/5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <h2 className="text-[2.5rem] md:text-h2-caps font-black uppercase tracking-tighter leading-none text-white">Why you <span className="text-pink">need</span> this.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {product.heroBenefits.map((benefit, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-pink/20 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="text-emerald-500" size={28} />
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-white/80">{benefit}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Breakdown */}
        {product.features && product.features.length > 0 && (
          <section className="py-32 border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-[2.5rem] md:text-h2-caps font-black uppercase tracking-tighter leading-none text-white mb-12">Features <span className="text-pink">Breakdown</span>.</h2>
                <div className="space-y-6">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-6 p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                      <div className="w-8 h-8 rounded-xl bg-pink/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-pink"></div>
                      </div>
                      <p className="font-black uppercase tracking-tight text-white leading-tight">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {product.screenshots?.slice(0, 4).map((src, i) => (
                  <div key={i} className="rounded-[2rem] overflow-hidden border border-white/10 aspect-video group">
                    <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  </div>
                )) || (
                  <>
                    <div className="aspect-video bg-white/5 rounded-[2rem] animate-pulse"></div>
                    <div className="aspect-video bg-white/5 rounded-[2rem] animate-pulse"></div>
                    <div className="aspect-video bg-white/5 rounded-[2rem] animate-pulse"></div>
                    <div className="aspect-video bg-white/5 rounded-[2rem] animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Onboarding Guide */}
        {product.onboardingSteps && product.onboardingSteps.length > 0 && (
          <section className="py-32 border-t border-white/5">
            <h2 className="text-[2.5rem] md:text-h2-caps font-black uppercase tracking-tighter leading-none text-white mb-20">Step-by-Step <span className="text-pink">Onboarding</span>.</h2>
            <div className="grid md:grid-cols-4 gap-12">
              {product.onboardingSteps.map((step, i) => (
                <div key={i} className="relative group">
                  <div className="text-[8rem] font-black text-white/[0.03] absolute -top-20 -left-8 pointer-events-none group-hover:text-pink/[0.05] transition-colors">0{i + 1}</div>
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink mb-6">Step {i + 1}</h4>
                    <p className="text-white/60 font-medium leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Preview */}
        {product.isComingSoon && product.whatToExpect && (
          <section className="py-32 border-t border-white/5 text-center max-w-4xl mx-auto">
            <h2 className="text-[2.5rem] md:text-h2-caps font-black uppercase tracking-tighter leading-none text-white mb-10">What to <span className="text-pink">expect</span>.</h2>
            <p className="text-body-l font-medium opacity-100 text-white/90 leading-relaxed text-white">
              {product.whatToExpect}
            </p>
          </section>
        )}

        {/* Support & CTA */}
        <section className="py-32 border-t border-white/5">
          <div className="p-16 md:p-24 rounded-[4rem] bg-white/5 text-white text-center relative overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,105,180,0.05),transparent_70%)]"></div>
            <div className="relative z-10">
              <h2 className="text-[3rem] md:text-h1-caps font-black uppercase tracking-tighter leading-none text-white mb-10">Ready to <span className="text-pink">level up</span>?</h2>
              <p className="text-body-l font-medium opacity-100 text-white/90 mb-16 max-w-2xl mx-auto">
                Get instant access to {product.name} and start improving your operations today.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {product.isComingSoon ? (
                  <button className="px-16 py-6 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-white transition-all">
                    Join the Waitlist
                  </button>
                ) : product.contactOnly ? (
                  <a 
                    href={`mailto:alejandrosoria@me.com?subject=Inquiry about ${product.name}`}
                    className="px-16 py-6 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-white transition-all flex items-center gap-3"
                  >
                    <Mail size={18} /> Contact Alejandro
                  </a>
                ) : (
                  <button 
                    onClick={() => window.location.href = `mailto:alejandrosoria@me.com?subject=Inquiry about ${product.name}`}
                    className="px-16 py-6 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-white transition-all flex items-center gap-3"
                  >
                    <Mail size={18} /> Contact Alejandro
                  </button>
                )}
                <a href="mailto:alejandrosoria@me.com" className="flex items-center gap-3 text-white/40 hover:text-pink transition-all font-black uppercase tracking-widest text-[10px]">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
