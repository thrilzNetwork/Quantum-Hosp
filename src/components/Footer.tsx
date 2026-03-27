import React, { useState, useEffect } from 'react';
import { Twitter, Linkedin, Facebook, Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

import { collection, onSnapshot, query, where, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const footerLinks = [
    {
      title: 'Tools',
      links: [
        { name: 'Browse All Tools', href: '/tools' },
        { name: 'Attenda', href: '/#tools' },
        { name: 'ReviewFlow', href: '/#tools' },
        { name: 'EventFlow', href: '/#tools' },
      ],
    },
    {
      title: 'Store',
      links: [
        { name: 'Marketplace', href: '/#store' },
        { name: 'Pins', href: '/#store' },
        { name: 'Digital Tools', href: '/#store' },
        { name: 'Somehow I Managed (Book)', href: settings?.bookUrl || 'https://somehowimanaged.netlify.app/' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Tutorials', href: '/#how-it-works' },
        { name: 'Consulting', href: '/#consulting' },
        { name: 'Contact', href: 'contact' },
      ],
    },
  ];

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsubSettings;
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === 'contact') {
      e.preventDefault();
      setIsContactOpen(true);
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const isHomePage = window.location.pathname === '/' || window.location.pathname === path;
      
      if (isHomePage) {
        e.preventDefault();
        const element = document.querySelector(`#${hash}`);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  return (
    <footer className="bg-black text-white pt-24 md:pt-32 pb-12 md:pb-16 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16 md:gap-24 mb-24">
          <div className="space-y-10 text-center md:text-left">
            <Link 
              to="/" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-white font-black text-3xl tracking-tighter uppercase block group"
            >
              {settings?.siteName || 'QUANTUM'}<span className="text-pink group-hover:text-white transition-colors">.</span>
            </Link>
            
            <p className="text-sm font-medium text-white/40 leading-relaxed max-w-xs mx-auto md:mx-0">
              {settings?.siteDescription || 'AI-powered operational tools built by hospitality operators for hospitality operators.'}
            </p>
            
            <div className="flex justify-center md:justify-start gap-4">
              {[
                { Icon: Twitter, href: settings?.socialLinks?.twitter },
                { Icon: Linkedin, href: settings?.socialLinks?.linkedin },
                { Icon: Facebook, href: settings?.socialLinks?.facebook },
                { Icon: Youtube, href: settings?.socialLinks?.youtube },
                { Icon: Instagram, href: settings?.socialLinks?.instagram }
              ].map(({ Icon, href }, i) => (
                href && (
                  <a 
                    key={i} 
                    href={href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-pink hover:border-pink/30 transition-all"
                  >
                    <Icon size={20} />
                  </a>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-8 xl:col-span-3">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-8 text-center sm:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith('http') ? (
                        <a 
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-pink transition-colors block py-1"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link 
                          to={link.href} 
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className="text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-pink transition-colors block py-1"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            {settings?.footerText || `© ${new Date().getFullYear()} Quantum Hospitality Solutions. All rights reserved.`}
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
}
