import { Product, Tool, OtherTool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'attenda',
    name: 'Attenda',
    tag: 'GUEST EXPERIENCE',
    description: 'A simple, QR-based in-room ordering system that eliminates friction and increases F&B revenue. No app download required.',
    features: ['Instant QR access', 'Custom digital menus', 'Direct staff notifications', 'Revenue reporting'],
    useCase: 'Best for boutique hotels looking to modernize room service without expensive software.',
    color: 'bg-pink',
    textColor: 'text-black',
    span: 'lg:col-span-2'
  },
  {
    id: 'shift-sync',
    name: 'ShiftSync',
    tag: 'OPERATIONS',
    description: 'AI-powered staff scheduling that predicts occupancy and suggests optimal staffing levels for every department.',
    features: ['Occupancy forecasting', 'Automated scheduling', 'Staff availability tracking', 'Labor cost analysis'],
    useCase: 'Perfect for General Managers trying to control labor costs while maintaining service standards.',
    color: 'bg-black',
    textColor: 'text-white',
    span: 'lg:col-span-1'
  },
  {
    id: 'guest-flow',
    name: 'GuestFlow',
    tag: 'FRONT DESK',
    description: 'Automated guest messaging and check-in assistant that handles common requests so your team can focus on hospitality.',
    features: ['Automated check-in', 'AI guest messaging', 'Request routing', 'Sentiment analysis'],
    useCase: 'Ideal for busy front desks looking to reduce phone calls and improve response times.',
    color: 'bg-supporting-grey',
    textColor: 'text-black',
    span: 'lg:col-span-1'
  },
  {
    id: 'audit-pro',
    name: 'AuditPro',
    tag: 'FINANCE',
    description: 'Digital night audit and financial reporting tool that eliminates paper waste and automates daily reconciliation.',
    features: ['Paperless night audit', 'Automated reporting', 'Discrepancy alerts', 'Cloud storage'],
    useCase: 'Essential for modern finance teams and night auditors looking for efficiency.',
    color: 'bg-pink-light',
    textColor: 'text-black',
    span: 'lg:col-span-2'
  }
];

export const OTHER_TOOLS: OtherTool[] = [
  {
    name: 'Inventory AI',
    tag: 'HOUSEKEEPING',
    description: 'Predictive supply ordering based on real-time consumption data.',
    impact: 'Reduces waste by 15%',
    color: 'bg-black/5'
  },
  {
    name: 'Menu Optimizer',
    tag: 'F&B',
    description: 'AI analysis of menu performance and ingredient cost fluctuations.',
    impact: 'Increases margins by 8%',
    color: 'bg-black/5'
  },
  {
    name: 'Review Responder',
    tag: 'MARKETING',
    description: 'AI-generated, personalized responses to guest reviews across all platforms.',
    impact: 'Saves 5 hours/week',
    color: 'bg-black/5'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'pin-gm',
    name: 'General Manager Pin',
    description: 'High-quality enamel pin for hotel General Managers.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'pin',
    pinSubcategory: 'position',
    badge: 'Best Seller'
  },
  {
    id: 'pin-front-desk',
    name: 'Front Desk Hero Pin',
    description: 'Celebrate your front desk team with this exclusive enamel pin.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'pin',
    pinSubcategory: 'position'
  },
  {
    id: 'tool-sop-template',
    name: 'Hotel SOP Templates',
    description: 'A complete set of standard operating procedures for every department.',
    price: 49,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'tool',
    downloadable: true,
    badge: 'Digital'
  },
  {
    id: 'book-somehow-i-managed',
    name: 'Somehow I Managed',
    description: 'A practical guide for hotel operators navigating the chaos of daily operations.',
    price: 29,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'book',
    badge: 'New'
  }
];
