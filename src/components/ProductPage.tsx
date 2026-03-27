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
    <div className="min-h-screen bg-black text-white pt-32 pb-24">
      <div className="container">
        <Link to="/#store" className="inline-flex items-center gap-2 text-supporting-grey hover:text-white mb-12 transition-colors">
          <ChevronLeft size={20} />
          Back to Store
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white/5"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <div className="absolute top-8 left-8 bg-pink text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                {product.badge}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="text-caps-s font-bold text-pink mb-4 uppercase tracking-widest">
              {product.category} {product.pinSubcategory && `• ${product.pinSubcategory}`}
            </div>
            <h1 className="text-h2-caps mb-6 text-white">{product.name}</h1>
            <p className="text-body-l opacity-60 mb-8 leading-relaxed text-white">
              {product.description}
            </p>

            {product.isComingSoon ? (
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-pink text-black font-bold">
                  <Clock size={20} />
                  Coming Soon — {product.releaseDate || 'TBA'}
                </div>
                
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold mb-4 text-white">Notify me when available</h3>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 px-6 py-4 rounded-xl border border-white/10 bg-black text-white focus:outline-none focus:ring-2 focus:ring-pink"
                    />
                    <button className="bg-pink text-black px-8 py-4 rounded-xl font-bold hover:bg-pink-light transition-all">
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-h3 font-bold text-white">${product.price}</div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className={`flex-1 min-w-[200px] py-5 rounded-2xl font-bold text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                      added ? 'bg-emerald-500 text-white' : 'bg-pink text-black hover:bg-pink-light'
                    }`}
                  >
                    {added ? 'Added to Cart!' : 'Buy Now'}
                  </button>
                  <button className="px-8 py-5 rounded-2xl border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-all">
                    Share
                  </button>
                </div>
                <div className="flex items-center gap-6 text-sm text-supporting-grey">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-pink" />
                    Instant Download
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-pink" />
                    Lifetime Support
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Benefits Section */}
        {product.heroBenefits && product.heroBenefits.length > 0 && (
          <section className="py-24 border-t border-white/10">
            <h2 className="text-h3 mb-12 text-white">Why you need this</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {product.heroBenefits.map((benefit, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="text-emerald-500 mb-6" size={32} />
                  <p className="text-lg font-medium leading-relaxed text-white">{benefit}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Breakdown */}
        {product.features && product.features.length > 0 && (
          <section className="py-24 border-t border-white/10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-h3 mb-8 text-white">Features Breakdown</h2>
                <div className="space-y-4">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-pink/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-pink"></div>
                      </div>
                      <p className="font-medium text-white">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product.screenshots?.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} className="rounded-2xl shadow-lg aspect-video object-cover" referrerPolicy="no-referrer" />
                )) || (
                  <>
                    <div className="aspect-video bg-white/5 rounded-2xl animate-pulse"></div>
                    <div className="aspect-video bg-white/5 rounded-2xl animate-pulse"></div>
                    <div className="aspect-video bg-white/5 rounded-2xl animate-pulse"></div>
                    <div className="aspect-video bg-white/5 rounded-2xl animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Onboarding Guide */}
        {product.onboardingSteps && product.onboardingSteps.length > 0 && (
          <section className="py-24 border-t border-white/10">
            <h2 className="text-h3 mb-12 text-white">Step-by-Step Onboarding</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {product.onboardingSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-h2 font-black text-white/5 absolute -top-8 -left-4">0{i + 1}</div>
                  <div className="relative z-10">
                    <h4 className="font-bold mb-4 text-white">Step {i + 1}</h4>
                    <p className="text-supporting-grey">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Preview */}
        {product.isComingSoon && product.whatToExpect && (
          <section className="py-24 border-t border-white/10 text-center max-w-3xl mx-auto">
            <h2 className="text-h3 mb-6 text-white">What to expect</h2>
            <p className="text-body-l opacity-60 leading-relaxed text-white">
              {product.whatToExpect}
            </p>
          </section>
        )}

        {/* Support & CTA */}
        <section className="py-24 border-t border-white/10">
          <div className="p-12 rounded-[3rem] bg-white/5 text-white text-center">
            <h2 className="text-h3 mb-6 text-white">Ready to level up?</h2>
            <p className="opacity-60 mb-12 max-w-xl mx-auto">
              Get instant access to {product.name} and start improving your operations today.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {product.isComingSoon ? (
                <button className="btn bg-pink text-black px-12 py-5 rounded-2xl font-bold">
                  Join the Waitlist
                </button>
              ) : (
                <button onClick={handleAddToCart} className="btn bg-pink text-black px-12 py-5 rounded-2xl font-bold">
                  Get Started Now
                </button>
              )}
              <a href={`mailto:${product.supportEmail || 'alejandro@quantumhospitality.com'}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <Mail size={20} />
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
