import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, ChevronRight } from 'lucide-react';
import ContactModal from './ContactModal';
import LoginModal from './LoginModal';

export default function Header() {
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80; // Header height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: 'Tools', href: '#tools' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Resources', href: '#resources' },
    { name: 'Consulting', href: '#consulting' },
  ];

  return (
    <>
      {/* Top Bar - Hidden on Mobile for cleaner look */}
      <nav className="hidden md:block relative z-51 border-b py-2 transition-colors border-black/10 bg-white text-black text-xs">
        <div className="container flex justify-end items-center gap-x-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-x-2 hover:opacity-65 transition-opacity"
          >
            <Search size={14} />
            <span>Search Tools</span>
          </button>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-65 transition-opacity">Contact</button>
          <button onClick={() => setIsLoginOpen(true)} className="hover:opacity-65 transition-opacity">Log in</button>
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
            <nav className="hidden lg:flex items-center gap-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium hover:opacity-65 transition-opacity"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-x-2 md:gap-x-4">
            <a 
              href="#tools" 
              onClick={(e) => handleNavClick(e, '#tools')}
              className="btn bg-pink text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[0.7rem] md:text-caps-s font-bold hover:bg-pink-light transition-colors group"
            >
              <span className="hidden xs:inline">Browse Tools</span>
              <span className="xs:hidden">Browse</span>
              <ChevronRight size={16} className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white border-b border-black/10 lg:hidden overflow-hidden"
            >
              <div className="container py-8 flex flex-col">
                {navItems.map((item, i) => (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="mobile-nav-item"
                  >
                    {item.name}
                    <ChevronRight size={18} className="text-black/20" />
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
            >
              <div className="container py-6 flex items-center justify-between border-b">
                <div className="flex items-center gap-x-4 flex-1">
                  <Search size={24} className="text-black/40" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search for tools (e.g. 'Housekeeping', 'F&B')..."
                    className="w-full text-xl md:text-2xl outline-none"
                  />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full"
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
