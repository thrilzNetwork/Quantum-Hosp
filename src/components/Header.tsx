import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, ChevronRight, ShoppingBag, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth, signInWithGoogle, logout, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import ContactModal from './ContactModal';
import LoginModal from './LoginModal';
import { SiteSettings } from '../types';

import { useAuthUI } from '../context/AuthUIContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsubSettings;
  }, []);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { isLoginOpen, setIsLoginOpen } = useAuthUI();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { setIsOpen: setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsAuthLoading(true);
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Check if user exists in Firestore, if not create them
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            const isDefaultAdmin = currentUser.email === "thrilznetwork@gmail.com" && currentUser.emailVerified;
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              role: isDefaultAdmin ? 'admin' : 'user',
              purchasedProducts: [],
              info: ''
            });
            setIsAdmin(isDefaultAdmin);
          } else {
            setIsAdmin(userDoc.data().role === 'admin');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setIsLoginOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const isHomePage = window.location.pathname === '/' || window.location.pathname === path;
      
      if (isHomePage) {
        e.preventDefault();
        const element = document.querySelector(`#${hash}`);
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
    }
  };

  const navItems = [
    { name: 'Tools', href: '/tools', isRoute: true },
    { name: 'Store', href: '/#store', isRoute: false },
    { name: 'How it Works', href: '/#how-it-works', isRoute: false },
    { name: 'About', href: '/#about', isRoute: false },
    { name: 'Resources', href: '/#resources', isRoute: false },
    { name: 'Consulting', href: '/#consulting', isRoute: false },
  ];

  return (
    <>
      {/* Top Bar - Hidden on Mobile for cleaner look */}
      <nav className="hidden md:block relative z-51 border-b py-2 transition-colors border-white/10 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
        <div className="container flex justify-end items-center gap-x-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-x-2 hover:text-pink transition-colors"
          >
            <Search size={12} />
            <span>Search Tools</span>
          </button>
          <button onClick={() => window.location.href = 'mailto:alejandrosoria@me.com'} className="hover:text-pink transition-colors">Contact</button>
        </div>
      </nav>

      <header 
        className={`sticky top-0 z-50 transition-all duration-500 border-b ${
          isScrolled ? 'glass-dark py-3 border-white/10' : 'bg-black/0 border-transparent py-6 md:py-8'
        }`}
      >
        <div className="container flex items-center justify-between relative">
          {/* Subtle glow behind logo */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-pink/10 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-x-12 lg:gap-x-16 relative z-10">
            <Link to="/" className="text-white font-black text-2xl md:text-3xl tracking-tighter uppercase group flex items-center gap-2">
              <div className="w-8 h-8 bg-pink rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <div className="w-4 h-4 bg-black rounded-sm" />
              </div>
              <span className="hidden sm:inline-block">{settings?.siteName || 'QUANTUM'}</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-x-10">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link 
                    key={item.name} 
                    to={item.href}
                    className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-pink transition-all duration-300 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-pink transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-pink transition-all duration-300 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-pink transition-all duration-300 group-hover:w-full" />
                  </a>
                )
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-x-3 md:gap-x-6 relative z-10">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-white/5 rounded-2xl transition-all duration-300 group border border-transparent hover:border-white/10"
              aria-label="Open Cart"
            >
              <ShoppingBag size={22} className="group-hover:text-pink transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink text-black text-[0.6rem] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink/20">
                  {totalItems}
                </span>
              )}
            </button>

            {isAuthLoading ? (
              <div className="w-10 h-10 rounded-2xl bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-x-3">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="p-3 hover:bg-white/5 rounded-2xl transition-all duration-300 text-white border border-transparent hover:border-white/10"
                    title="Admin Dashboard"
                  >
                    <Settings size={22} />
                  </Link>
                )}
                <Link 
                  to="/user" 
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all duration-300 text-white border border-transparent hover:border-white/10"
                  title="User Profile"
                >
                  <UserIcon size={22} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all duration-300 text-white border border-transparent hover:border-white/10"
                  title="Logout"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="p-3 hover:bg-white/5 rounded-2xl transition-all duration-300 text-white border border-transparent hover:border-white/10"
                title="Login"
              >
                <UserIcon size={22} />
              </button>
            )}

            <button 
              className="lg:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Immersive Full Screen */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[60] bg-black lg:hidden flex flex-col"
            >
              <div className="container py-8 flex items-center justify-between border-b border-white/5">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black text-2xl tracking-tighter uppercase">
                  {settings?.siteName || 'QUANTUM'}
                </Link>
                <button 
                  className="p-3 rounded-2xl bg-white/5 border border-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={26} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-12 px-6">
                <div className="flex flex-col gap-y-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {item.isRoute ? (
                        <Link 
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-6 text-4xl font-black uppercase tracking-tighter group"
                        >
                          <span className="group-hover:text-pink transition-colors">{item.name}</span>
                          <ChevronRight size={32} className="text-white/10 group-hover:text-pink transition-all" />
                        </Link>
                      ) : (
                        <a 
                          href={item.href} 
                          onClick={(e) => handleNavClick(e, item.href)}
                          className="flex items-center justify-between py-6 text-4xl font-black uppercase tracking-tighter group"
                        >
                          <span className="group-hover:text-pink transition-colors">{item.name}</span>
                          <ChevronRight size={32} className="text-white/10 group-hover:text-pink transition-all" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => { window.location.href = 'mailto:alejandrosoria@me.com'; setIsMobileMenuOpen(false); }}
                    className="btn-primary py-6 text-sm"
                  >
                    Contact Alejandro
                  </button>
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="btn-secondary py-6 text-sm flex items-center justify-center gap-3"
                  >
                    <Search size={18} />
                    Search Tools
                  </button>
                </div>
              </div>
              
              {/* Decorative glow in mobile menu */}
              <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-pink/10 to-transparent pointer-events-none" />
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
              className="fixed inset-0 z-[100] bg-black flex flex-col"
            >
              <div className="container py-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-x-4 flex-1">
                  <Search size={24} className="text-white/40" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search for tools (e.g. 'Housekeeping', 'F&B')..."
                    className="w-full text-xl md:text-2xl outline-none text-white bg-transparent"
                  />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="container py-12">
                <p className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6 text-white">Popular Searches</p>
                <div className="flex flex-wrap gap-3">
                  {['Check-in Automation', 'Staff Scheduling', 'Inventory Management', 'Guest Messaging'].map(tag => (
                    <button key={tag} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white">
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
