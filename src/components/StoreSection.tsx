import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Download, Star, Briefcase, Award, Smile, Sparkles, Package, Truck, Shield, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { pins, tools, books } from '../data/products';
import Modal from './Modal';
import type { Product, ProductCategory, PinSubcategory } from '../types';

const categories: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pin', label: 'Pins' },
  { key: 'tool', label: 'Tools' },
  { key: 'book', label: 'Books' },
];

const pinSubcategories: { key: PinSubcategory | 'all'; label: string; icon: typeof Briefcase }[] = [
  { key: 'all', label: 'All Pins', icon: Sparkles },
  { key: 'position', label: 'By Position', icon: Briefcase },
  { key: 'achievement', label: 'Achievement', icon: Award },
  { key: 'fun', label: 'Fun & Morale', icon: Smile },
  { key: 'brand', label: 'Quantum Brand', icon: Star },
];

const allProducts = [...pins, ...tools, ...books];

function getSubcategoryLabel(product: Product) {
  if (product.pinSubcategory) {
    return { position: 'Position Pin', achievement: 'Achievement Pin', fun: 'Fun Pin', brand: 'Brand Pin' }[product.pinSubcategory];
  }
  return product.category === 'tool' ? 'Digital Tool' : 'PDF Book';
}

function getCategoryDetails(product: Product) {
  if (product.category === 'pin') {
    return {
      material: 'Hard enamel with gold / silver plating',
      size: 'Approx. 1.25" × 1.25"',
      backing: 'Rubber clutch backing (2 included)',
      extras: 'Comes on a branded backing card, individually poly-bagged',
    };
  }
  if (product.category === 'tool') {
    return {
      material: 'Cloud-hosted SaaS tool',
      size: 'Instant activation after purchase',
      backing: 'No hardware or integration required',
      extras: 'Includes onboarding guide and email support',
    };
  }
  return {
    material: 'Downloadable PDF',
    size: '120+ pages, full color',
    backing: 'Instant download after purchase',
    extras: 'Printable format, lifetime access',
  };
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden border border-black/5 group hover:shadow-lg transition-shadow"
    >
      {/* Clickable area — opens detail modal */}
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="w-full text-left cursor-pointer"
        aria-label={`View details for ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-grey">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.badge && (
            <div className="absolute top-3 left-3 bg-pink text-black text-[0.6875rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {product.badge}
            </div>
          )}
          {product.downloadable && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
              <Download size={10} aria-hidden="true" />
              Digital
            </div>
          )}
          {/* Quick view hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
              <Eye size={14} aria-hidden="true" />
              Quick View
            </span>
          </div>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base leading-tight">{product.name}</h3>
              <p className="text-xs text-black/50 uppercase tracking-wider mt-1">
                {getSubcategoryLabel(product)}
              </p>
            </div>
            <div className="text-lg font-black text-black whitespace-nowrap">
              ${product.price.toFixed(2)}
            </div>
          </div>
          <p className="text-sm text-black/60 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </button>

      {/* Add to Cart button — works independently */}
      <div className="px-5 pb-5">
        <button
          onClick={handleAdd}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
            added
              ? 'bg-emerald-500 text-white'
              : 'bg-black text-white hover:bg-black/85'
          }`}
        >
          {added ? (
            <>Added to Cart</>
          ) : (
            <>
              <ShoppingBag size={16} aria-hidden="true" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ProductDetailModal({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  const details = getCategoryDetails(product);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-6">
        {/* Hero image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-grey">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <div className="absolute top-3 left-3 bg-pink text-black text-[0.6875rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {product.badge}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-black/40">
              {getSubcategoryLabel(product)}
            </span>
            {product.downloadable && (
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Download size={10} aria-hidden="true" />
                Digital
              </span>
            )}
          </div>
          <p className="text-black/70 leading-relaxed">{product.description}</p>
        </div>

        {/* Product specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-black/[0.03] border border-black/5">
            <div className="text-[0.6rem] font-bold uppercase tracking-widest text-black/40 mb-1">
              {product.category === 'pin' ? 'Material' : 'Format'}
            </div>
            <div className="text-xs font-medium">{details.material}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/[0.03] border border-black/5">
            <div className="text-[0.6rem] font-bold uppercase tracking-widest text-black/40 mb-1">
              {product.category === 'pin' ? 'Size' : 'Access'}
            </div>
            <div className="text-xs font-medium">{details.size}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/[0.03] border border-black/5">
            <div className="text-[0.6rem] font-bold uppercase tracking-widest text-black/40 mb-1">
              {product.category === 'pin' ? 'Backing' : 'Setup'}
            </div>
            <div className="text-xs font-medium">{details.backing}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/[0.03] border border-black/5">
            <div className="text-[0.6rem] font-bold uppercase tracking-widest text-black/40 mb-1">Includes</div>
            <div className="text-xs font-medium">{details.extras}</div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-[0.65rem] text-black/40 font-medium">
          <span className="flex items-center gap-1">
            <Truck size={12} aria-hidden="true" />
            {product.category === 'pin' ? 'Ships in 3-5 days' : 'Instant access'}
          </span>
          <span className="flex items-center gap-1">
            <Shield size={12} aria-hidden="true" />
            Secure checkout
          </span>
          <span className="flex items-center gap-1">
            <Package size={12} aria-hidden="true" />
            Quality guaranteed
          </span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center gap-4 pt-2">
          <div className="text-2xl font-black">${product.price.toFixed(2)}</div>
          <button
            onClick={handleAdd}
            className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-pink text-black hover:bg-pink-light'
            }`}
          >
            {added ? (
              'Added to Cart!'
            ) : (
              <>
                <ShoppingBag size={18} aria-hidden="true" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function StoreSection() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [activePinSub, setActivePinSub] = useState<PinSubcategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = (() => {
    if (activeCategory === 'all') return allProducts;
    if (activeCategory === 'pin') {
      return activePinSub === 'all'
        ? pins
        : pins.filter((p) => p.pinSubcategory === activePinSub);
    }
    return allProducts.filter((p) => p.category === activeCategory);
  })();

  return (
    <section id="store" className="py-20 md:py-32 bg-white border-b border-black/10">
      <div className="container">
        <div className="max-w-xl mb-12 md:mb-16">
          <span className="text-caps-s text-pink tracking-[0.15em]">Marketplace</span>
          <h2 className="text-h3 mt-4 mb-4">The Quantum Store</h2>
          <p className="text-body-m opacity-70">
            High-quality enamel pins for hospitality professionals, digital tools for your hotel, and resources to level up your operations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-6" role="tablist" aria-label="Product categories">
          {categories.map((cat) => {
            const count =
              cat.key === 'all'
                ? allProducts.length
                : cat.key === 'pin'
                ? pins.length
                : allProducts.filter((p) => p.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  if (cat.key !== 'pin') setActivePinSub('all');
                }}
                role="tab"
                aria-selected={activeCategory === cat.key}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-black text-white'
                    : 'bg-black/5 text-black hover:bg-black/10'
                }`}
              >
                {cat.label}
                <span className="ml-2 text-xs opacity-50">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Pin Subcategory Filter — show only when Pins or All is active */}
        {(activeCategory === 'pin' || activeCategory === 'all') && activeCategory === 'pin' && (
          <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Pin categories">
            {pinSubcategories.map((sub) => {
              const Icon = sub.icon;
              const count =
                sub.key === 'all'
                  ? pins.length
                  : pins.filter((p) => p.pinSubcategory === sub.key).length;
              return (
                <button
                  key={sub.key}
                  onClick={() => setActivePinSub(sub.key)}
                  role="tab"
                  aria-selected={activePinSub === sub.key}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activePinSub === sub.key
                      ? 'bg-pink text-black'
                      : 'bg-pink/10 text-black/70 hover:bg-pink/20'
                  }`}
                >
                  <Icon size={13} aria-hidden="true" />
                  {sub.label}
                  <span className="opacity-50">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeCategory !== 'pin' && <div className="mb-4" />}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-black/40">
            <p className="text-lg font-medium">No products found in this category.</p>
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-black/40">
          <div className="flex items-center gap-2">
            <Star size={16} fill="currentColor" aria-hidden="true" />
            Free shipping on pin orders over $30
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-black/20" aria-hidden="true"></div>
          <div className="flex items-center gap-2">
            <Download size={16} aria-hidden="true" />
            Instant download for digital products
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-black/20" aria-hidden="true"></div>
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} aria-hidden="true" />
            Secure checkout
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
