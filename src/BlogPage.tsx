import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost } from './types';
import { motion } from 'motion/react';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container">
        <div className="max-w-3xl mb-20">
          <p className="text-xs font-bold text-supporting-grey uppercase tracking-[0.2em] mb-4">Insights & Updates</p>
          <h1 className="text-h1 font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white">
            The Quantum <br /> <span className="text-pink">Blog</span>
          </h1>
          <p className="text-xl text-supporting-grey">
            Deep dives into hospitality automation, operational efficiency, and the future of hotel management.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[16/9] bg-white/5 rounded-2xl" />
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-8 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-supporting-grey uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight group-hover:text-pink transition-colors text-white">
                    {post.title}
                  </h3>
                  <p className="text-supporting-grey text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all text-white hover:text-pink">
                    Read Article <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
