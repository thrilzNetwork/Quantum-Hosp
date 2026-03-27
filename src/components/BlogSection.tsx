import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost, SiteSettings } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });

    return unsubSettings;
  }, []);

  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;

    const fetchMediumPosts = async () => {
      const username = settings?.mediumUsername || '@AlejandroSoriaQuantum';
      
      try {
        // First, check Firestore for manually added posts
        const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
        unsubFirestore = onSnapshot(q, (snapshot) => {
          const firestorePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
          
          if (firestorePosts.length > 0) {
            setPosts(firestorePosts);
            setLoading(false);
          } else {
            // If Firestore is empty, fetch from Medium feed as fallback
            fetchFeed();
          }
        }, (err) => {
          console.error('Firestore blog error:', err);
          fetchFeed();
        });

        const fetchFeed = async () => {
          try {
            const formattedUsername = username.startsWith('@') ? username : `@${username}`;
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${formattedUsername}`);
            const data = await response.json();
            
            if (data.status === 'ok' && data.items && data.items.length > 0) {
              const mediumPosts: BlogPost[] = data.items.map((item: any, index: number) => {
                let image = item.thumbnail;
                if (!image && item.description) {
                  const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                  if (imgMatch) image = imgMatch[1];
                }
                if (!image) image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';

                return {
                  id: item.guid || `medium-${index}`,
                  title: item.title,
                  excerpt: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
                  content: item.content,
                  author: item.author || settings?.founderName || 'Alejandro Soria',
                  date: item.pubDate,
                  image: image,
                  category: 'Medium',
                  slug: item.link
                };
              });
              setPosts(mediumPosts);
              setLoading(false);
            } else {
              setLoading(false);
            }
          } catch (e) {
            console.error('Feed fetch error:', e);
            setLoading(false);
          }
        };
      } catch (error) {
        console.error('Error in blog initialization:', error);
        setLoading(false);
      }
    };

    if (settings) {
      fetchMediumPosts();
    }

    return () => {
      if (unsubFirestore) {
        unsubFirestore();
      }
    };
  }, [settings]);

  if (loading) return (
    <section className="py-24 md:py-32 bg-black text-white border-b border-white/5">
      <div className="container">
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-pink border-t-transparent rounded-full animate-spin shadow-2xl shadow-pink/20"></div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="blog" className="py-24 md:py-32 bg-black text-white border-b border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/10 border border-pink/20 text-[10px] font-black text-pink uppercase tracking-widest">
              Insights & Updates
            </div>
            <h2 className="text-[3rem] md:text-h2-caps font-black uppercase leading-[0.85] tracking-tighter text-white">
              The <span className="text-pink">Operator's</span> Journal.
            </h2>
          </div>
          <a 
            href={`https://medium.com/${settings?.mediumUsername || '@AlejandroSoriaQuantum'}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-pink font-black uppercase tracking-widest text-[11px] hover:text-white transition-colors"
          >
            Read on Medium <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, index) => (
              <motion.a
                key={post.id}
                href={post.slug}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col h-full bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden hover:border-pink/30 transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-[10px] font-black text-pink uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><User size={12} /> {post.author}</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-4 group-hover:text-pink transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                    Read Article <ArrowRight size={14} className="text-pink" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-white/40 font-black uppercase tracking-widest">No articles found at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
