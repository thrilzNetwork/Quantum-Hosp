import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

import { useAuthUI } from '../context/AuthUIContext';
import { auth } from '../firebase';

export default function CartModal() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { setIsLoginOpen } = useAuthUI();

  const handleCheckout = () => {
    if (!auth.currentUser) {
      setIsLoginOpen(true);
      return;
    }
    // Proceed to checkout logic (e.g., Stripe)
    console.log("Proceeding to checkout...");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-zinc-900 text-white h-full shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black">
              <div className="flex items-center gap-x-3">
                <ShoppingBag size={20} className="text-pink" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Your Bag ({totalItems})</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-black">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                    <ShoppingBag size={40} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/60">Your bag is empty</p>
                    <p className="text-xs text-white/30 max-w-[200px] mx-auto">Looks like you haven't added any hospitality essentials yet.</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-bold uppercase tracking-widest text-pink hover:text-white transition-colors border-b border-pink/30 pb-1"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-x-5 group">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#111] flex-shrink-0 border border-white/5">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xs font-bold truncate pr-4 text-white uppercase tracking-wide">{item.product.name}</h3>
                            <span className="text-xs font-bold text-white">${item.product.price * item.quantity}</span>
                          </div>
                          <p className="text-[9px] text-pink font-bold uppercase tracking-[0.15em] mb-4">
                            {item.product.category}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white/5 rounded-md p-1 border border-white/10">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:text-pink transition-colors text-white/40"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-[10px] font-bold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:text-pink transition-colors text-white/40"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-white/10 bg-[#0a0a0a] space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>Subtotal</span>
                    <span className="text-white">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>Shipping</span>
                    <span className="text-white">Calculated at checkout</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center border-t border-white/5">
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Total</span>
                    <span className="text-2xl font-black text-white">${totalPrice}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-pink text-black py-5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center group hover:bg-white transition-all shadow-2xl shadow-pink/10"
                >
                  Complete Purchase
                  <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                    Secure Checkout
                  </p>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
