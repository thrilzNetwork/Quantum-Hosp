import { useState } from 'react';
import { Check, Download } from 'lucide-react';
import Modal from './Modal';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutForm {
  email: string;
  name: string;
  card: string;
  expiry: string;
  cvc: string;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    email: '', name: '', card: '', expiry: '', cvc: '',
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const hasDownloadables = items.some((item) => item.product.downloadable);

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!form.name.trim()) newErrors.name = 'Name required';
    if (!form.card.trim() || form.card.replace(/\s/g, '').length < 16) {
      newErrors.card = 'Valid card number required';
    }
    if (!form.expiry.trim() || !/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'MM/YY';
    }
    if (!form.cvc.trim() || form.cvc.length < 3) {
      newErrors.cvc = '3 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'card') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      const formatted = digits.replace(/(\d{4})/g, '$1 ').trim();
      setForm((prev) => ({ ...prev, card: formatted }));
    } else if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setForm((prev) => ({ ...prev, expiry: formatted }));
    } else if (name === 'cvc') {
      setForm((prev) => ({ ...prev, cvc: value.replace(/\D/g, '').slice(0, 4) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  const handleDone = () => {
    clearCart();
    setIsComplete(false);
    setForm({ email: '', name: '', card: '', expiry: '', cvc: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={isComplete ? handleDone : onClose} title={isComplete ? 'Order Confirmed' : 'Checkout'}>
      {isComplete ? (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Check size={32} aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Payment Successful!</h4>
            <p className="text-body-m opacity-70">
              Your order of <span className="font-bold">${totalPrice.toFixed(2)}</span> has been processed.
            </p>
          </div>
          {hasDownloadables && (
            <div className="bg-black/5 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold">Your Downloads:</p>
              {items
                .filter((item) => item.product.downloadable)
                .map((item) => (
                  <button
                    key={item.product.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white border border-black/5 hover:border-pink transition-colors text-left"
                  >
                    <Download size={16} className="text-pink flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium truncate">{item.product.name}</span>
                  </button>
                ))}
            </div>
          )}
          <p className="text-xs opacity-50">A confirmation email has been sent to {form.email}</p>
          <button
            onClick={handleDone}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Order Summary */}
          <div className="bg-black/[0.02] rounded-xl p-4 space-y-2 border border-black/5">
            <div className="text-xs font-bold uppercase tracking-wider opacity-40">Order Summary</div>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="opacity-70">{item.product.name} x{item.quantity}</span>
                <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-black/5">
              <span className="font-bold">Total</span>
              <span className="font-black text-base">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-email" className="text-xs font-bold uppercase tracking-wider opacity-60">Email</label>
            <input
              id="checkout-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@hotel.com"
              aria-invalid={!!errors.email}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
            />
            {errors.email && <p className="text-red-600 text-xs" role="alert">{errors.email}</p>}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-name" className="text-xs font-bold uppercase tracking-wider opacity-60">Name on Card</label>
            <input
              id="checkout-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              aria-invalid={!!errors.name}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
            />
            {errors.name && <p className="text-red-600 text-xs" role="alert">{errors.name}</p>}
          </div>

          {/* Card */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-card" className="text-xs font-bold uppercase tracking-wider opacity-60">Card Number</label>
            <input
              id="checkout-card"
              name="card"
              type="text"
              inputMode="numeric"
              value={form.card}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              aria-invalid={!!errors.card}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors font-mono"
            />
            {errors.card && <p className="text-red-600 text-xs" role="alert">{errors.card}</p>}
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="checkout-expiry" className="text-xs font-bold uppercase tracking-wider opacity-60">Expiry</label>
              <input
                id="checkout-expiry"
                name="expiry"
                type="text"
                inputMode="numeric"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength={5}
                aria-invalid={!!errors.expiry}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors font-mono"
              />
              {errors.expiry && <p className="text-red-600 text-xs" role="alert">{errors.expiry}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="checkout-cvc" className="text-xs font-bold uppercase tracking-wider opacity-60">CVC</label>
              <input
                id="checkout-cvc"
                name="cvc"
                type="text"
                inputMode="numeric"
                value={form.cvc}
                onChange={handleChange}
                placeholder="123"
                maxLength={4}
                aria-invalid={!!errors.cvc}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors font-mono"
              />
              {errors.cvc && <p className="text-red-600 text-xs" role="alert">{errors.cvc}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-pink text-black py-4 rounded-xl font-bold hover:bg-pink-light transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
          </button>

          <p className="text-[0.6875rem] text-center opacity-40">
            This is a demo checkout. No real charges will be made.
          </p>
        </form>
      )}
    </Modal>
  );
}
