export interface Tool {
  id: string;
  name: string;
  tag: string;
  description: string;
  features: string[];
  useCase: string;
  color: string;
  textColor?: string;
  span: string;
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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  pinSubcategory?: PinSubcategory;
  badge?: string;
  downloadable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
