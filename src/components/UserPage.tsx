import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Product, Tutorial, User } from '../types';
import { BookOpen, Package, User as UserIcon, PlayCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function UserPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubUser = onSnapshot(doc(db, 'users', user.uid), async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.data() as User;
          setUserData(data);

          // Fetch purchased products
          if (data.purchasedProducts && data.purchasedProducts.length > 0) {
            const productPromises = data.purchasedProducts.map(id => getDoc(doc(db, 'products', id)));
            const productSnapshots = await Promise.all(productPromises);
            setPurchasedProducts(productSnapshots.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() } as Product)));
          }
        }
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    const unsubTutorials = onSnapshot(collection(db, 'tutorials'), (snapshot) => {
      setTutorials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tutorials');
    });

    return () => {
      unsubUser();
      unsubTutorials();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-40 pb-24 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md">
              <div className="w-24 h-24 bg-pink rounded-[2rem] flex items-center justify-center text-black mb-8 shadow-2xl rotate-3">
                <UserIcon size={48} />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-white">{auth.currentUser?.displayName || 'User'}</h1>
              <p className="text-white/40 font-medium mb-10 text-sm">{auth.currentUser?.email}</p>
              <div className="pt-10 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink mb-6">Account Info</p>
                <p className="text-sm font-medium text-white/60 leading-relaxed">{userData?.info || 'No additional info provided.'}</p>
              </div>
            </div>

            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 text-white">Support</h3>
              <p className="text-sm font-medium text-white/40 mb-10 leading-relaxed">Need help with your tools or have questions about your order?</p>
              <button className="w-full px-8 py-5 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-2xl">Contact Support</button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-20">
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-pink/10 flex items-center justify-center">
                  <Package size={24} className="text-pink" />
                </div>
                <h2 className="text-[2rem] md:text-h2-caps font-black uppercase tracking-tighter text-white">Your <span className="text-pink">Products</span>.</h2>
              </div>
              {purchasedProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {purchasedProducts.map(product => (
                    <div key={product.id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex gap-6 group hover:border-pink/30 transition-all">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">{product.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">{product.category}</p>
                        {product.downloadable && (
                          <button className="text-pink text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                            Download <ExternalLink size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 p-16 rounded-[3rem] border-2 border-dashed border-white/10 text-center">
                  <p className="text-white/40 font-black uppercase tracking-widest text-xs mb-6">You haven't purchased any products yet.</p>
                  <a href="/#store" className="inline-flex px-10 py-4 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-2xl">Browse Store</a>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-pink/10 flex items-center justify-center">
                  <BookOpen size={24} className="text-pink" />
                </div>
                <h2 className="text-[2rem] md:text-h2-caps font-black uppercase tracking-tighter text-white">Tutorials & <span className="text-pink">Resources</span>.</h2>
              </div>
              <div className="space-y-6">
                {tutorials.map(tutorial => (
                  <motion.div 
                    whileHover={{ x: 15 }}
                    key={tutorial.id} 
                    className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-pink/30 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-pink transition-colors border border-white/5">
                        <PlayCircle size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">{tutorial.title}</h4>
                        <p className="text-sm font-medium text-white/40">{tutorial.description}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-pink group-hover:border-pink/50 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
