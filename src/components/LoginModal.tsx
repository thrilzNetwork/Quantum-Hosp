import React from 'react';
import Modal from './Modal';
import { signInWithGoogle } from '../firebase';
import { Chrome } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log in to Quantum">
      <div className="space-y-6">
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-white/10 py-4 rounded-xl font-bold hover:bg-zinc-700 transition-all active:scale-[0.98] text-white"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Continue with Google
        </button>
        
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-xs text-supporting-grey uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60">Email</label>
            <input 
              type="email" 
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white focus:border-pink outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60">Password</label>
              <button type="button" className="text-[10px] font-bold uppercase tracking-wider text-pink hover:underline">Forgot?</button>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white focus:border-pink outline-none transition-colors"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-pink text-black py-4 rounded-xl font-bold hover:bg-pink-light transition-colors active:scale-[0.98]"
          >
            Sign In
          </button>
          <div className="text-center">
            <p className="text-xs text-white/60">
              Don't have an account? <button type="button" className="font-bold text-pink hover:underline">Contact Sales</button>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
}
