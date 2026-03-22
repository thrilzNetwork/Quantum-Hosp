import React, { useState } from 'react';
import Modal from './Modal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Us">
      {isSubmitted ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold">Message Sent!</h4>
          <p className="text-body-m opacity-70">We'll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black text-white focus:border-pink outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="john@hotel.com"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black text-white focus:border-pink outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Message</label>
            <textarea 
              required
              rows={4}
              placeholder="How can we help your operations?"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black text-white focus:border-pink outline-none transition-colors resize-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-pink text-black py-4 rounded-xl font-bold hover:bg-pink-light transition-colors active:scale-[0.98]"
          >
            Send Message
          </button>
        </form>
      )}
    </Modal>
  );
}
