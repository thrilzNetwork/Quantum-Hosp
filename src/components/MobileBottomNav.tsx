import React from 'react';
import { Home, Grid, BookOpen, MessageSquare } from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { name: 'Home', icon: Home, href: 'top' },
    { name: 'Tools', icon: Grid, href: '#tools' },
    { name: 'Resources', icon: BookOpen, href: '#resources' },
    { name: 'Consult', icon: MessageSquare, href: '#consulting' },
  ];

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
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
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-black/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <a 
            key={item.name} 
            href={item.href} 
            onClick={(e) => handleClick(e, item.href)}
            className="flex flex-col items-center justify-center flex-1 h-full text-black/40 hover:text-black transition-colors"
          >
            <item.icon size={20} />
            <span className="text-[0.625rem] font-bold mt-1 uppercase tracking-wider">{item.name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
