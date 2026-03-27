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
    { name: 'Blog', href: '/blog', isRoute: true },
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
          <button onClick={() => setIsContactOpen(true)} className="hover:text-pink transition-colors">Contact</button>
        </div>
      </nav>

      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? 'bg-black/90 backdrop-blur-md border-white/10 py-3' : 'bg-black border-transparent py-4 md:py-6'
        }`}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-x-8 lg:gap-x-12">
            <Link to="/" className="text-white font-black text-2xl tracking-tighter uppercase">
              {settings?.siteName || 'QUANTUM'}
            </Link>
            <nav className="hidden lg:flex items-center gap-x-8">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link 
                    key={item.name} 
                    to={item.href}
                    className="text-[11px] font-bold uppercase tracking-widest hover:text-pink transition-colors"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-[11px] font-bold uppercase tracking-widest hover:text-pink transition-colors"
                  >
                    {item.name}
                  </a>
                )
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-x-2 md:gap-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/5 rounded-full transition-colors group"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} className="group-hover:text-pink transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-pink text-black text-[0.625rem] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {isAuthLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-x-2">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                    title="Admin Dashboard"
                  >
                    <Settings size={20} />
                  </Link>
                )}
                <Link 
                  to="/user" 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  title="User Profile"
                >
                  <UserIcon size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                title="Login"
              >
                <UserIcon size={20} />
              </button>
            )}

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
              className="absolute top-full left-0 w-full bg-black border-b border-white/10 lg:hidden overflow-hidden"
            >
              <div className="container py-8 flex flex-col">
                {navItems.map((item, i) => (
                  item.isRoute ? (
                    <Link 
                      key={item.name} 
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mobile-nav-item border-white/10 text-white"
                    >
                      {item.name}
                      <ChevronRight size={18} className="text-white/20" />
                    </Link>
                  ) : (
                    <a 
                      key={item.name} 
                      href={item.href} 
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="mobile-nav-item border-white/10 text-white"
                    >
                      {item.name}
                      <ChevronRight size={18} className="text-white/20" />
                    </a>
                  )
                ))}
                <div className="mt-8 grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => { setIsContactOpen(true); setIsMobileMenuOpen(false); }}
                    className="btn bg-pink text-black py-4 rounded-xl text-sm font-bold"
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
