import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

export default function CartModal() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Sidebar */}
            <motion.div
              key="cart-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[95] w-full max-w-md bg-white shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} aria-hidden="true" />
                  <h2 className="text-lg font-bold">Cart</h2>
                  {totalItems > 0 && (
                    <span className="bg-pink text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag size={24} className="text-black/30" />
                    </div>
                    <p className="text-sm font-medium opacity-50">Your cart is empty</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-bold text-pink hover:underline"
                    >
                      Browse the store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-4 rounded-xl bg-black/[0.02] border border-black/5"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                          <p className="text-xs text-black/50 capitalize">{item.product.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                                aria-label={`Decrease ${item.product.name} quantity`}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                                aria-label={`Increase ${item.product.name} quantity`}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-sm">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-black/30 hover:text-red-500 transition-colors"
                                aria-label={`Remove ${item.product.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-black/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium opacity-60">Subtotal</span>
                    <span className="text-xl font-black">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-pink text-black py-4 rounded-xl font-bold text-sm hover:bg-pink-light transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <CreditCard size={18} aria-hidden="true" />
                    Checkout — ${totalPrice.toFixed(2)}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs font-medium text-black/40 hover:text-black/60 transition-colors py-2"
                  >
                    Clear cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
