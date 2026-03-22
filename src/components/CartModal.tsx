import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartModal() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

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
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <ShoppingBag size={24} className="text-pink" />
                <h2 className="text-xl font-bold">Cart ({totalItems})</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-supporting-grey">Your cart is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-pink font-bold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-x-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-bold truncate pr-4">{item.product.name}</h3>
                          <span className="text-sm font-bold">${item.product.price * item.quantity}</span>
                        </div>
                        <p className="text-[0.625rem] text-supporting-grey uppercase tracking-widest mb-3">
                          {item.product.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-white/10 rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:text-pink transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:text-pink transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-supporting-grey hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-supporting-grey">Subtotal</span>
                  <span className="text-xl font-bold">${totalPrice}</span>
                </div>
                <button className="w-full btn bg-pink text-black py-4 rounded-full font-bold flex items-center justify-center group">
                  Checkout
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[0.625rem] text-center text-supporting-grey uppercase tracking-widest">
                  Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
