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
    <div className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-zinc-900 p-8 rounded-3xl shadow-sm border border-white/5">
              <div className="w-20 h-20 bg-pink rounded-full flex items-center justify-center text-black mb-6">
                <UserIcon size={40} />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-white">{auth.currentUser?.displayName || 'User'}</h1>
              <p className="text-supporting-grey mb-6">{auth.currentUser?.email}</p>
              <div className="pt-6 border-t border-white/5">
                <p className="text-xs font-bold uppercase tracking-widest text-supporting-grey mb-4">Account Info</p>
                <p className="text-body-s text-white/70">{userData?.info || 'No additional info provided.'}</p>
              </div>
            </div>

            <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-sm border border-white/5">
              <h3 className="text-xl font-bold mb-4">Support</h3>
              <p className="text-sm text-white/60 mb-6">Need help with your tools or have questions about your order?</p>
              <button className="w-full btn bg-pink text-black py-4 rounded-xl font-bold hover:bg-pink-light transition-colors">Contact Support</button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Package size={24} className="text-pink" />
                <h2 className="text-2xl font-bold text-white">Your Products</h2>
              </div>
              {purchasedProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {purchasedProducts.map(product => (
                    <div key={product.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex gap-4">
                      <img src={product.image} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-white">{product.name}</h4>
                        <p className="text-xs text-supporting-grey mb-2">{product.category}</p>
                        {product.downloadable && (
                          <button className="text-pink text-xs font-bold flex items-center gap-1 hover:underline">
                            Download <ExternalLink size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-900 p-12 rounded-3xl border-2 border-dashed border-white/10 text-center">
                  <p className="text-supporting-grey">You haven't purchased any products yet.</p>
                  <a href="/#store" className="text-pink font-bold hover:underline mt-2 inline-block">Browse Store</a>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <BookOpen size={24} className="text-pink" />
                <h2 className="text-2xl font-bold text-white">Tutorials & Resources</h2>
              </div>
              <div className="space-y-4">
                {tutorials.map(tutorial => (
                  <motion.div 
                    whileHover={{ x: 10 }}
                    key={tutorial.id} 
                    className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 group-hover:text-pink transition-colors">
                        <PlayCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{tutorial.title}</h4>
                        <p className="text-xs text-supporting-grey">{tutorial.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/20" />
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
