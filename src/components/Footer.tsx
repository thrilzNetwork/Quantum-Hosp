import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Youtube, Instagram } from 'lucide-react';
import ContactModal from './ContactModal';
import { scrollToElement } from '../hooks/useScrollTo';
import type { FooterLinkSection } from '../types';

const footerLinks: FooterLinkSection[] = [
  {
    title: 'Tools',
    links: [
      { name: 'Attenda', href: '#tools' },
      { name: 'ReviewFlow', href: '#tools' },
      { name: 'EventFlow', href: '#tools' },
      { name: 'BudgetControl', href: '#tools' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Store', href: '#store' },
      { name: 'Somehow I Managed', href: '#resources' },
      { name: 'Blog', href: '#' },
      { name: 'Support Center', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: 'contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  },
];

const socialIcons = [
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Youtube, label: 'YouTube' },
  { Icon: Instagram, label: 'Instagram' },
];

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === 'contact') {
      e.preventDefault();
      setIsContactOpen(true);
    } else if (href === 'tutorial') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      e.preventDefault();
      scrollToElement(href);
    }
  };

  return (
    <footer className="bg-black text-white pt-20 md:pt-24 pb-12 md:pb-16">
      <div className="container">
        <div className="flex flex-col xl:flex-row justify-between gap-12 mb-16 md:mb-24">
          <div className="xl:w-1/4 space-y-8 text-center xl:text-left">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-white font-bold text-2xl tracking-tighter block"
            >
              QUANTUM
            </a>

            <p className="text-body-s opacity-60 max-w-xs mx-auto xl:mx-0">
              AI-powered operational tools built by hospitality operators for hospitality operators.
            </p>

            <div className="flex justify-center xl:justify-start gap-3">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={label}
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8" aria-label="Footer navigation">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6 text-center sm:text-left">
                <h4 className="text-caps-s text-white/60">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="text-[0.9375rem] md:text-[0.875rem] hover:text-white/60 transition-colors block py-1"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[0.75rem] text-white/60">
            &copy; 2026 Quantum Hospitality Solutions. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.75rem] text-white/60">
            <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="underline hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
}
