import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    });
    return unsub;
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-black text-white border-b border-white/10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[10px] font-bold text-supporting-grey uppercase tracking-widest mb-2">Insights & Updates</p>
            <h2 className="text-h2-caps text-white">The Quantum Blog</h2>
          </div>
          <button className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all text-white hover:text-pink">
            View All Posts <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-pink text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[10px] font-bold text-supporting-grey uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                </div>
                <h3 className="text-xl font-black leading-tight group-hover:text-pink transition-colors text-white">
                  {post.title}
                </h3>
                <p className="text-supporting-grey text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
