import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, logout } from '../firebase';
import { Product, Tool, Tutorial, BlogPost, Sale, PromoSlide, SiteSettings } from '../types';
import { Plus, Trash2, Edit2, Save, X, Layout, Package, BookOpen, Users, BarChart3, Newspaper, Image as ImageIcon, LogOut, Globe, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

type AdminTab = 'products' | 'tools' | 'sales' | 'promo_slides' | 'blog' | 'tutorials' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [promoSlides, setPromoSlides] = useState<PromoSlide[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const unsubProducts = onSnapshot(query(collection(db, 'products'), orderBy('name')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    const unsubTools = onSnapshot(query(collection(db, 'tools'), orderBy('name')), (snapshot) => {
      setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tools');
    });
    const unsubTutorials = onSnapshot(query(collection(db, 'tutorials'), orderBy('title')), (snapshot) => {
      setTutorials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tutorials');
    });

    const unsubBlog = onSnapshot(query(collection(db, 'blog'), orderBy('date', 'desc')), (snapshot) => {
      setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'blog');
    });

    const unsubSales = onSnapshot(query(collection(db, 'sales'), orderBy('date', 'desc')), (snapshot) => {
      setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sales');
    });

    const unsubPromo = onSnapshot(query(collection(db, 'promo_slides'), orderBy('order')), (snapshot) => {
      setPromoSlides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoSlide)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'promo_slides');
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteSettings({ id: snapshot.id, ...snapshot.data() } as SiteSettings);
      } else {
        // Initialize with default settings if not exists
        setSiteSettings({
          id: 'site_config',
          siteName: 'QUANTUM',
          siteDescription: 'AI-powered operational tools built by hospitality operators for hospitality operators.',
          heroTitle: 'Tools Built by Operators for Operators',
          heroSubtitle: 'Quantum Hospitality Solutions',
          heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=1200',
          contactEmail: 'alejandro@quantumhospitality.com',
          footerText: '© 2026 Quantum Hospitality Solutions. All rights reserved.',
          founderName: 'Alejandro Soria',
          founderRole: 'Founder & Hospitality Operator',
          founderBio: `I came to this country with a dream that didn't work out, a language I was still learning, and a job cleaning offices I thought were something else. What I found instead was an industry I fell in love with — and I spent the next fifteen years learning every corner of it from the inside out.

I started as a houseman. I became a night auditor, a front desk agent, a front office manager, an AGM, a GM. I opened hotels from scratch under pressure. I walked into broken properties and rebuilt them. I stayed through a hurricane on property. I survived COVID while running one of the best-performing hotels in the company. I sat across from ownership with numbers nobody wanted to see and delivered them anyway.

What I never found — in any of those roles, at any of those properties — were tools built by someone who actually understood the job. The software was always designed by people who had studied hospitality, never by people who had lived it. I watched teams work around systems that were supposed to help them. I watched operators accept manual processes because nothing better existed. I got tired of waiting for someone else to build it.

Quantum was not born in a boardroom. It was born from fifteen years of doing the work nobody sees — and finally having enough experience, enough clarity, and enough patience exhausted to build what this industry actually needs.

I am not a tech founder who studied hotels. I am an operator who studied technology. That difference is everything.`,
          founderImage: 'https://ais-dev-jfmomv2ukjrevu5lfqhfbr-208298624240.us-east1.run.app/api/attachments/f0e97923-40a9-45e0-86a7-eb7428025524/founder.png',
          mediumUsername: '@AlejandroSoriaQuantum',
          bookUrl: 'https://somehowimanaged.netlify.app/',
          googleCalendarBookingLink: 'https://calendar.app.google/qpAdrEbntEimg74D7',
          socialLinks: {
            twitter: '#',
            linkedin: '#',
            facebook: '#',
            instagram: '#',
            youtube: '#'
          }
        } as SiteSettings);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/site_config');
    });

    return () => {
      unsubProducts();
      unsubTools();
      unsubTutorials();
      unsubBlog();
      unsubSales();
      unsubPromo();
      unsubSettings();
    };
  }, []);

  const handleAdd = async () => {
    const path = activeTab;
    try {
      if (activeTab === 'products') {
        await addDoc(collection(db, 'products'), {
          name: 'New Product',
          description: 'A detailed description of the product.',
          price: 25,
          image: 'https://picsum.photos/seed/product/800/800',
          category: 'pin',
          pinSubcategory: 'position',
          badge: 'New',
          downloadable: false,
          isComingSoon: false,
          releaseDate: '',
          heroBenefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
          screenshots: ['https://picsum.photos/seed/s1/800/450', 'https://picsum.photos/seed/s2/800/450'],
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          onboardingSteps: ['Step 1', 'Step 2', 'Step 3'],
          supportEmail: 'alejandro@quantumhospitality.com',
          whatToExpect: 'Coming soon details...'
        });
      } else if (activeTab === 'tools') {
        await addDoc(collection(db, 'tools'), {
          name: 'New Tool',
          tag: 'TAG',
          description: 'A brief description of the tool and its benefits.',
          useCase: 'Describe a specific scenario where this tool excels.',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          color: 'bg-pink',
          span: 'md:col-span-2',
          productId: ''
        });
      } else if (activeTab === 'tutorials') {
        await addDoc(collection(db, 'tutorials'), {
          title: 'New Tutorial',
          description: 'Step-by-step guide description.',
          videoUrl: '',
          content: 'Tutorial content goes here...'
        });
      } else if (activeTab === 'blog') {
        await addDoc(collection(db, 'blog'), {
          title: 'New Blog Post',
          excerpt: 'Short summary of the post.',
          content: 'Full content goes here...',
          author: siteSettings?.founderName || 'Alejandro Soria',
          date: new Date().toISOString(),
          image: 'https://picsum.photos/seed/blog/800/450',
          category: 'Medium',
          slug: '',
          mediumLink: '',
          metaDescription: 'SEO meta description here...',
          tags: ['Operations']
        });
      } else if (activeTab === 'promo_slides') {
        await addDoc(collection(db, 'promo_slides'), {
          title: 'New Promo Slide',
          subtitle: 'Exciting news or featured product.',
          image: 'https://picsum.photos/seed/promo/1200/1200',
          link: '#tools',
          buttonText: 'Learn More',
          order: promoSlides.length,
          isActive: true
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleUpdate = async (id: string) => {
    const path = `${activeTab}/${id}`;
    try {
      const { id: _, ...dataToUpdate } = editData;
      await updateDoc(doc(db, activeTab, id), dataToUpdate);
      setIsEditing(null);
      setEditData({});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const path = `${activeTab}/${id}`;
    try {
      await deleteDoc(doc(db, activeTab, id));
      setDeleteConfirm(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const startEditing = (item: any) => {
    setIsEditing(item.id);
    setEditData(item);
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const tabTitles: Record<AdminTab, string> = {
    products: 'Marketplace (Products & Services)',
    tools: 'Operations Tools',
    sales: 'Analytics & Sales',
    promo_slides: 'Promo Slides',
    blog: 'Blog Posts',
    tutorials: 'Tutorials',
    settings: 'Site Settings'
  };

  const handleUpdateSettings = async () => {
    if (!siteSettings) return;
    try {
      const { id, ...settingsData } = siteSettings;
      await updateDoc(doc(db, 'settings', 'site_config'), settingsData);
      alert('Settings updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/site_config');
    }
  };

  return (
    <div className="min-h-screen bg-black flex text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col fixed h-full">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 bg-pink rounded-lg flex items-center justify-center text-black font-black group-hover:scale-110 transition-transform">Q</div>
            <span className="font-bold tracking-tight text-white">QUANTUM ADMIN</span>
          </Link>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Business Manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Package size={18} /> Marketplace (Products & Services)
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'tools' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Layout size={18} /> Operations Tools
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <BarChart3 size={18} /> Analytics & Sales
          </button>
          <button 
            onClick={() => setActiveTab('promo_slides')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'promo_slides' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <ImageIcon size={18} /> Promo Slides
          </button>
          <button 
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Newspaper size={18} /> Blog Posts
          </button>
          <button 
            onClick={() => setActiveTab('tutorials')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'tutorials' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <BookOpen size={18} /> Tutorials
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-pink text-black shadow-lg shadow-pink/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <SettingsIcon size={18} /> Site Settings
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link 
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:bg-white/5 transition-all"
          >
            <Globe size={18} /> View Website
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-black">
        <div className="p-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-h3 font-black uppercase tracking-tight mb-2 text-white">{tabTitles[activeTab]}</h1>
              <p className="text-white/40 text-sm">Manage your {tabTitles[activeTab].toLowerCase()} and real-time content</p>
            </div>
            
            <div className="flex gap-3">
              {activeTab !== 'sales' && (
                <button 
                  onClick={handleAdd}
                  className="btn bg-pink text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink/20 hover:scale-105 transition-all"
                >
                  <Plus size={18} /> Add New
                </button>
              )}
              {activeTab === 'sales' && (
                <button 
                  onClick={async () => {
                    if (window.confirm("Seed initial sales data?")) {
                      const initialSales = [
                        { productId: '1', productName: 'ReviewFlow', amount: 29, customerEmail: 'guest1@example.com', date: new Date().toISOString() },
                        { productId: '2', productName: 'SignatureFlow', amount: 49, customerEmail: 'guest2@example.com', date: new Date().toISOString() },
                        { productId: '1', productName: 'ReviewFlow', amount: 29, customerEmail: 'guest3@example.com', date: new Date().toISOString() },
                      ];
                      for (const sale of initialSales) {
                        await addDoc(collection(db, 'sales'), sale);
                      }
                    }
                  }}
                  className="btn bg-zinc-900 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Seed Sales Data
                </button>
              )}
              {activeTab === 'blog' && (
                <button 
                  onClick={async () => {
                    if (window.confirm("Seed initial blog posts?")) {
                      const initialPosts = [
                        { title: 'The Future of Hotel Operations', excerpt: 'How AI is changing the way we run hotels.', content: 'Full content...', author: 'Admin', date: new Date().toISOString(), image: 'https://picsum.photos/seed/blog1/800/450', category: 'Operations' },
                        { title: 'Maximizing Guest Satisfaction', excerpt: 'Tips for keeping your guests happy.', content: 'Full content...', author: 'Admin', date: new Date().toISOString(), image: 'https://picsum.photos/seed/blog2/800/450', category: 'Guest Experience' },
                      ];
                      for (const post of initialPosts) {
                        await addDoc(collection(db, 'blog'), post);
                      }
                    }
                  }}
                  className="btn bg-zinc-900 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Seed Blog Posts
                </button>
              )}
              {activeTab === 'products' && (
                <button 
                  onClick={async () => {
                    if (window.confirm("Seed initial products?")) {
                      const initialProducts = [
                        { 
                          name: 'ReviewFlow', 
                          description: 'Automate your guest review responses with AI that sounds like your brand.', 
                          price: 29, 
                          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', 
                          category: 'tool',
                          badge: 'Popular',
                          heroBenefits: ['Save 10+ hours/week', 'Improve response rate by 100%', 'Consistent brand voice'],
                          features: ['AI Response Generation', 'Sentiment Analysis', 'Multi-platform support'],
                          supportEmail: 'alejandro@quantumhospitality.com'
                        },
                        { 
                          name: 'SignatureFlow', 
                          description: 'Digital check-in and signature capture for the modern operator.', 
                          price: 49, 
                          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800', 
                          category: 'tool',
                          badge: 'New',
                          heroBenefits: ['Paperless operations', 'Instant sync', 'Legal compliance'],
                          features: ['Digital Signatures', 'ID Verification', 'Automated Archiving'],
                          supportEmail: 'alejandro@quantumhospitality.com'
                        },
                        { 
                          name: 'Somehow I Managed', 
                          description: 'The definitive guide to modern hospitality leadership.', 
                          price: 19.99, 
                          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', 
                          category: 'book',
                          badge: 'Bestseller',
                          heroBenefits: ['Leadership frameworks', 'Operational excellence', 'Team building'],
                          features: ['15+ years of experience', 'Practical templates', 'Case studies'],
                          supportEmail: 'alejandro@quantumhospitality.com'
                        }
                      ];
                      for (const product of initialProducts) {
                        await addDoc(collection(db, 'products'), product);
                      }
                    }
                  }}
                  className="btn bg-zinc-900 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Seed Products
                </button>
              )}
            </div>
          </div>

          {activeTab === 'sales' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-sm">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Total Revenue</p>
                  <h2 className="text-h3 font-black text-white">${totalSales.toFixed(2)}</h2>
                </div>
                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-sm">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Total Sales</p>
                  <h2 className="text-h3 font-black text-white">{sales.length}</h2>
                </div>
                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-sm">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Avg. Order Value</p>
                  <h2 className="text-h3 font-black text-white">${sales.length ? (totalSales / sales.length).toFixed(2) : '0.00'}</h2>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/60">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/60">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/60">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/60">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {sales.map(sale => (
                      <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm text-white">{sale.productName}</td>
                        <td className="px-6 py-4 text-sm text-white/60">{sale.customerEmail}</td>
                        <td className="px-6 py-4 font-bold text-sm text-white">${sale.amount}</td>
                        <td className="px-6 py-4 text-xs text-white/40">{new Date(sale.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {activeTab === 'products' && products.map(product => (
              <div key={product.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-sm">
                {isEditing === product.id ? (
                  <div className="space-y-4">
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.name}
                      onChange={e => setEditData({...editData, name: e.target.value})}
                      placeholder="Name"
                    />
                    <textarea 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.description}
                      onChange={e => setEditData({...editData, description: e.target.value})}
                      placeholder="Description"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-white/40 font-bold hover:text-white transition-colors">Cancel</button>
                      <button onClick={() => handleUpdate(product.id)} className="px-6 py-2 bg-pink text-black rounded-xl font-bold hover:scale-105 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-bold text-white">{product.name}</h3>
                        <p className="text-xs text-white/40">${product.price} • {product.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(product)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {activeTab === 'tools' && tools.map(tool => (
              <div key={tool.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-sm">
                {isEditing === tool.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={editData.name}
                        onChange={e => setEditData({...editData, name: e.target.value})}
                        placeholder="Name"
                      />
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={editData.tag}
                        onChange={e => setEditData({...editData, tag: e.target.value})}
                        placeholder="Tag"
                      />
                    </div>
                    <select 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.productId || ''}
                      onChange={e => setEditData({...editData, productId: e.target.value})}
                    >
                      <option value="">Link to Product (Optional)</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <textarea 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.description}
                      onChange={e => setEditData({...editData, description: e.target.value})}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-white/40 font-bold hover:text-white transition-colors">Cancel</button>
                      <button onClick={() => handleUpdate(tool.id)} className="px-6 py-2 bg-pink text-black rounded-xl font-bold hover:scale-105 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-white/40">{tool.tag} {tool.productId && `• Linked to ${products.find(p => p.id === tool.productId)?.name}`}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(tool)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(tool.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {activeTab === 'blog' && blogPosts.map(post => (
              <div key={post.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-sm">
                {isEditing === post.id ? (
                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/40">Medium Integration</label>
                      <div className="flex gap-2">
                        <input 
                          className="flex-1 px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                          value={editData.mediumLink || ''}
                          onChange={e => setEditData({...editData, mediumLink: e.target.value})}
                          placeholder="Paste Medium Article Link"
                        />
                        <button 
                          onClick={async () => {
                            if (!editData.mediumLink) return;
                            try {
                              // Extract username from link: https://medium.com/@username/slug
                              const match = editData.mediumLink.match(/medium\.com\/(@[^\/]+)/);
                              if (match) {
                                const username = match[1];
                                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${username}`);
                                const data = await response.json();
                                if (data.status === 'ok' && data.items) {
                                  const post = data.items.find((item: any) => item.link.includes(editData.mediumLink) || editData.mediumLink.includes(item.link));
                                  if (post) {
                                    let image = post.thumbnail;
                                    if (!image && post.description) {
                                      const imgMatch = post.description.match(/<img[^>]+src="([^">]+)"/);
                                      if (imgMatch) image = imgMatch[1];
                                    }
                                    setEditData({
                                      ...editData,
                                      title: post.title,
                                      excerpt: post.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
                                      content: post.content,
                                      image: image || editData.image,
                                      date: post.pubDate,
                                      author: post.author || editData.author,
                                      slug: post.link
                                    });
                                    alert('Metadata fetched successfully!');
                                  } else {
                                    alert('Could not find this specific post in the user feed. Please ensure the link is correct.');
                                  }
                                }
                              } else {
                                alert('Invalid Medium link format. Use: https://medium.com/@username/slug');
                              }
                            } catch (e) {
                              console.error(e);
                              alert('Error fetching metadata. You may need to fill fields manually.');
                            }
                          }}
                          className="px-4 py-2 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all text-xs"
                        >
                          Fetch Metadata
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={editData.title}
                        onChange={e => setEditData({...editData, title: e.target.value})}
                        placeholder="Title"
                      />
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={editData.slug}
                        onChange={e => setEditData({...editData, slug: e.target.value})}
                        placeholder="Article URL (Medium Link)"
                      />
                    </div>
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.image}
                      onChange={e => setEditData({...editData, image: e.target.value})}
                      placeholder="Featured Image URL"
                    />
                    <textarea 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.excerpt}
                      onChange={e => setEditData({...editData, excerpt: e.target.value})}
                      placeholder="Excerpt (SEO summary)"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-white/40 font-bold hover:text-white transition-colors">Cancel</button>
                      <button onClick={() => handleUpdate(post.id)} className="px-6 py-2 bg-pink text-black rounded-xl font-bold hover:scale-105 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={post.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-bold text-white">{post.title}</h3>
                        <p className="text-xs text-white/40">{post.category} • {post.author} • {post.mediumLink ? 'Medium Link' : 'Local Post'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(post)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {activeTab === 'promo_slides' && promoSlides.map(slide => (
              <div key={slide.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-sm">
                {isEditing === slide.id ? (
                  <div className="space-y-4">
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.title}
                      onChange={e => setEditData({...editData, title: e.target.value})}
                      placeholder="Title"
                    />
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.subtitle}
                      onChange={e => setEditData({...editData, subtitle: e.target.value})}
                      placeholder="Subtitle"
                    />
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.image}
                      onChange={e => setEditData({...editData, image: e.target.value})}
                      placeholder="Image URL"
                    />
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.link}
                      onChange={e => setEditData({...editData, link: e.target.value})}
                      placeholder="Link URL"
                    />
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.buttonText}
                      onChange={e => setEditData({...editData, buttonText: e.target.value})}
                      placeholder="Button Text"
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-white/60">
                        Order:
                        <input 
                          type="number"
                          className="w-20 px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                          value={editData.order}
                          onChange={e => setEditData({...editData, order: parseInt(e.target.value)})}
                        />
                      </label>
                      <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-white/60">
                        <input 
                          type="checkbox"
                          checked={editData.isActive}
                          onChange={e => setEditData({...editData, isActive: e.target.checked})}
                          className="accent-pink"
                        />
                        Active
                      </label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-white/40 font-bold hover:text-white transition-colors">Cancel</button>
                      <button onClick={() => handleUpdate(slide.id)} className="px-6 py-2 bg-pink text-black rounded-xl font-bold hover:scale-105 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={slide.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-bold text-white">{slide.title}</h3>
                        <p className="text-xs text-white/40">{slide.subtitle}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${slide.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {slide.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                            Order: {slide.order}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(slide)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(slide.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {activeTab === 'tutorials' && tutorials.map(tutorial => (
              <div key={tutorial.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-sm">
                {isEditing === tutorial.id ? (
                  <div className="space-y-4">
                    <input 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.title}
                      onChange={e => setEditData({...editData, title: e.target.value})}
                      placeholder="Title"
                    />
                    <textarea 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                      value={editData.description}
                      onChange={e => setEditData({...editData, description: e.target.value})}
                      placeholder="Description"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-white/40 font-bold hover:text-white transition-colors">Cancel</button>
                      <button onClick={() => handleUpdate(tutorial.id)} className="px-6 py-2 bg-pink text-black rounded-xl font-bold hover:scale-105 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{tutorial.title}</h3>
                      <p className="text-xs text-white/40">{tutorial.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(tutorial)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(tutorial.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {activeTab === 'settings' && siteSettings && (
              <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">General Info</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Site Name</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.siteName}
                        onChange={e => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Site Description</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.siteDescription}
                        onChange={e => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Contact Email</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.contactEmail}
                        onChange={e => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Footer Text</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.footerText || ''}
                        onChange={e => setSiteSettings({...siteSettings, footerText: e.target.value})}
                        placeholder="© 2026 Quantum Hospitality Solutions. All rights reserved."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Hero Section</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Hero Title</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.heroTitle}
                        onChange={e => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Hero Subtitle</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.heroSubtitle}
                        onChange={e => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Hero Image URL</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.heroImage}
                        onChange={e => setSiteSettings({...siteSettings, heroImage: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Integrations & API</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Stripe Public Key</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.stripePublicKey || ''}
                        onChange={e => setSiteSettings({...siteSettings, stripePublicKey: e.target.value})}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Google Calendar Booking Link</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.googleCalendarBookingLink || ''}
                        onChange={e => setSiteSettings({...siteSettings, googleCalendarBookingLink: e.target.value})}
                        placeholder="https://calendar.google.com/calendar/appointments/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Stripe Secret Key</label>
                      <input 
                        type="password"
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.stripeSecretKey || ''}
                        onChange={e => setSiteSettings({...siteSettings, stripeSecretKey: e.target.value})}
                        placeholder="sk_test_..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Medium Username (e.g. @username)</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.mediumUsername || ''}
                        onChange={e => setSiteSettings({...siteSettings, mediumUsername: e.target.value})}
                        placeholder="@AlejandroSoriaQuantum"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Book URL</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.bookUrl || ''}
                        onChange={e => setSiteSettings({...siteSettings, bookUrl: e.target.value})}
                        placeholder="https://somehowimanaged.netlify.app/"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">MCP Config (JSON)</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all font-mono text-xs"
                        value={siteSettings.mcpConfig || ''}
                        onChange={e => setSiteSettings({...siteSettings, mcpConfig: e.target.value})}
                        placeholder='{"server": "..."}'
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Social Links</h3>
                    {['twitter', 'linkedin', 'facebook', 'instagram', 'youtube'].map(platform => (
                      <div key={platform}>
                        <label className="block text-xs font-bold mb-1 capitalize text-white/60">{platform}</label>
                        <input 
                          className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                          value={siteSettings.socialLinks?.[platform as keyof typeof siteSettings.socialLinks] || ''}
                          onChange={e => setSiteSettings({
                            ...siteSettings, 
                            socialLinks: {
                              ...siteSettings.socialLinks,
                              [platform]: e.target.value
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Founder Info</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Founder Name</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.founderName || ''}
                        onChange={e => setSiteSettings({...siteSettings, founderName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Founder Role</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.founderRole || ''}
                        onChange={e => setSiteSettings({...siteSettings, founderRole: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Founder Image URL</label>
                      <input 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.founderImage || ''}
                        onChange={e => setSiteSettings({...siteSettings, founderImage: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Founder Bio</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-white/60">Bio (Markdown supported)</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:border-pink outline-none transition-all"
                        value={siteSettings.founderBio || ''}
                        onChange={e => setSiteSettings({...siteSettings, founderBio: e.target.value})}
                        rows={8}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/10">
                  <button 
                    onClick={handleUpdateSettings}
                    className="btn bg-pink text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink/20 hover:scale-105 transition-all"
                  >
                    <Save size={18} /> Save All Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
