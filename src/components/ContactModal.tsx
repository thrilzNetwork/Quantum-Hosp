import React, { useState } from 'react';
import Modal from './Modal';
import type { ContactFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM: ContactFormData = { name: '', email: '', message: '' };

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length > 2000) newErrors.message = 'Message must be under 2000 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(INITIAL_FORM);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Us">
      {isSubmitted ? (
        <div className="text-center py-12 space-y-4" role="status" aria-live="polite">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold">Message Sent!</h4>
          <p className="text-body-m opacity-70">We'll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider opacity-60">Full Name</label>
            <input
              id="contact-name"
              name="name"
              required
              type="text"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              placeholder="John Doe"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
            />
            {errors.name && <p id="contact-name-error" className="text-red-600 text-xs" role="alert">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider opacity-60">Email Address</label>
            <input
              id="contact-email"
              name="email"
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
              placeholder="john@hotel.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
            />
            {errors.email && <p id="contact-email-error" className="text-red-600 text-xs" role="alert">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider opacity-60">Message</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              maxLength={2000}
              placeholder="How can we help your operations?"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors resize-none"
            />
            {errors.message && <p id="contact-message-error" className="text-red-600 text-xs" role="alert">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </Modal>
  );
}
