import React, { useState } from 'react';
import Modal from './Modal';
import type { LoginFormData } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // TODO: Replace with actual auth API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log in to Quantum">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider opacity-60">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={254}
            placeholder="your@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
          />
          {errors.email && <p id="login-email-error" className="text-red-600 text-xs" role="alert">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider opacity-60">Password</label>
            <button type="button" className="text-[10px] font-bold uppercase tracking-wider text-pink hover:underline">Forgot?</button>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
          />
          {errors.password && <p id="login-password-error" className="text-red-600 text-xs" role="alert">{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="text-center">
          <p className="text-xs opacity-60">
            Don't have an account? <button type="button" className="font-bold text-black hover:underline">Contact Sales</button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
