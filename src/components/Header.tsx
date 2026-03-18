import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, ChevronRight, ShoppingBag } from 'lucide-react';
import ContactModal from './ContactModal';
import LoginModal from './LoginModal';
import { handleAnchorClick } from '../hooks/useScrollTo';
import { useCart } from '../context/CartContext';
import type { NavItem } from '../types';

const navItems: NavItem[] = [
  { name: 'Tools', href: '#tools' },
  { name: 'Store', href: '#store' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Resources', href: '#resources' },
  { name: 'Consulting', href: '#consulting' },
];

export default function Header() {
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Close mobile menu and search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isMobileMenuOpen]);

  return (
    <>
      {/* Top Bar - Hidden on Mobile for cleaner look */}
      <nav className="hidden md:block relative z-51 border-b py-2 transition-colors border-black/10 bg-white text-black text-xs" aria-label="Utility navigation">
        <div className="container flex justify-end items-center gap-x-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-x-2 hover:opacity-65 transition-opacity min-w-[44px] min-h-[44px]"
            aria-label="Search tools"
          >
            <Search size={14} aria-hidden="true" />
            <span>Search Tools</span>
          </button>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-65 transition-opacity min-h-[44px]">Contact</button>
          <button onClick={() => setIsLoginOpen(true)} className="hover:opacity-65 transition-opacity min-h-[44px]">Log in</button>
        </div>
      </nav>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? 'bg-white/80 backdrop-blur-md border-black/10 py-3' : 'bg-white border-transparent py-4 md:py-5'
        }`}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-x-8 lg:gap-x-12">
            <a href="/" className="text-black font-bold text-xl tracking-tighter">
              QUANTUM
            </a>
            <nav className="hidden lg:flex items-center gap-x-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="text-sm font-medium hover:opacity-65 transition-opacity"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-x-2 md:gap-x-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
              aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pink text-black text-[0.6rem] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <a
              href="#store"
              onClick={(e) => handleAnchorClick(e, '#store')}
              className="btn bg-pink text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[0.7rem] md:text-caps-s font-bold hover:bg-pink-light transition-colors group"
            >
              <span className="hidden xs:inline">Browse Store</span>
              <span className="xs:hidden">Store</span>
              <ChevronRight size={16} className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            <button
              className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white border-b border-black/10 lg:hidden overflow-hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="container py-8 flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href, closeMobileMenu)}
                    className="mobile-nav-item"
                  >
                    {item.name}
                    <ChevronRight size={18} className="text-black/20" aria-hidden="true" />
                  </a>
                ))}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                    className="btn border border-black/10 py-4 rounded-xl text-sm font-bold"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { setIsContactOpen(true); setIsMobileMenuOpen(false); }}
                    className="btn bg-black text-white py-4 rounded-xl text-sm font-bold"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Search tools"
            >
              <div className="container py-6 flex items-center justify-between border-b">
                <div className="flex items-center gap-x-4 flex-1">
                  <Search size={24} className="text-black/40" aria-hidden="true" />
                  <input
                    autoFocus
                    type="search"
                    placeholder="Search for tools (e.g. 'Housekeeping', 'F&B')..."
                    className="w-full text-xl md:text-2xl outline-none"
                    aria-label="Search for tools"
                  />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close search"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="container py-12">
                <p className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6">Popular Searches</p>
                <div className="flex flex-wrap gap-3">
                  {['Check-in Automation', 'Staff Scheduling', 'Inventory Management', 'Guest Messaging'].map(tag => (
                    <button key={tag} className="px-6 py-3 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-sm font-medium">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </header>
    </>
  );
}
