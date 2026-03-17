import Modal from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log in to Quantum">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">Email</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Password</label>
            <button type="button" className="text-[10px] font-bold uppercase tracking-wider text-pink hover:underline">Forgot?</button>
          </div>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-pink outline-none transition-colors"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-colors active:scale-[0.98]"
        >
          Sign In
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
