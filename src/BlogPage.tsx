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
    <div className="min-h-screen bg-black text-white pt-40 pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest mb-8">
            Insights & Updates
          </div>
          <h1 className="text-[4rem] md:text-h1-caps font-black uppercase leading-[0.85] tracking-tighter text-white mb-10">
            The Quantum <br /> <span className="text-pink">Blog</span>.
          </h1>
          <p className="text-body-l font-medium text-white/60 max-w-2xl leading-relaxed">
            Deep dives into hospitality automation, operational efficiency, and the future of hotel management.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[16/9] bg-white/5 rounded-[2rem]" />
                <div className="h-4 bg-white/5 rounded-full w-1/3" />
                <div className="space-y-3">
                  <div className="h-8 bg-white/5 rounded-xl w-full" />
                  <div className="h-8 bg-white/5 rounded-xl w-4/5" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/5 rounded-lg w-full" />
                  <div className="h-4 bg-white/5 rounded-lg w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-16">
            {posts.map((post, index) => {
              const isExternal = post.slug?.startsWith('http') || post.mediumLink;
              const link = post.mediumLink || post.slug || '#';

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    if (isExternal) {
                      window.open(link, '_blank', 'noopener,noreferrer');
                    } else {
                      // Handle local navigation if needed
                    }
                  }}
                >
                  <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 border border-white/5">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-pink text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Calendar size={14} className="text-pink" /> {new Date(post.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2"><User size={14} className="text-pink" /> {post.author}</span>
                    </div>
                    <h3 className="text-2xl font-black leading-tight group-hover:text-pink transition-colors text-white uppercase tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-white/60 text-sm font-medium line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all text-white group-hover:text-pink">
                      {isExternal ? 'Read on Medium' : 'Read Article'} <ChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
