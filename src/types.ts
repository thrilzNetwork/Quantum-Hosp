export interface Tool {
  id: string;
  name: string;
  tag: string;
  headline?: string;
  description: string;
  features: string[];
  useCase: string;
  color: string;
  textColor?: string;
  span: string;
  productId?: string;
}

export interface OtherTool {
  name: string;
  tag: string;
  description: string;
  impact: string;
  color: string;
  textColor?: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface FooterLinkSection {
  title: string;
  links: { name: string; href: string }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Store / Marketplace types
export type ProductCategory = 'pin' | 'tool' | 'book';
export type PinSubcategory = 'position' | 'achievement' | 'fun' | 'brand';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  slug?: string;
  mediumLink?: string;
  metaDescription?: string;
  tags?: string[];
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  customerEmail: string;
  date: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  purchasedProducts?: string[];
  info?: string;
}

export interface Product {
  id: string;
  name: string;
  headline?: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  pinSubcategory?: PinSubcategory;
  badge?: string;
  downloadable?: boolean;
  contactOnly?: boolean;
  // New fields for product pages
  isComingSoon?: boolean;
  releaseDate?: string;
  heroBenefits?: string[];
  screenshots?: string[];
  features?: string[];
  onboardingSteps?: string[];
  sops?: { name: string; url: string }[];
  whatToExpect?: string;
  supportEmail?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  contactEmail: string;
  googleCalendarBookingLink?: string;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  mcpConfig?: string;
  apiKeys?: { [key: string]: string };
  footerText?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  founderName?: string;
  founderRole?: string;
  founderBio?: string;
  founderImage?: string;
  mediumUsername?: string;
  bookUrl?: string;
}
