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
        // Ensure username starts with @ if it's a personal profile
        const formattedUsername = username.startsWith('@') ? username : `@${username}`;
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${formattedUsername}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const mediumPosts: BlogPost[] = data.items.map((item: any, index: number) => {
            // Extract image from content if thumbnail is missing
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
          // Try fallback username if the first one fails
          if (formattedUsername !== '@AlejandroSoria') {
            const fallbackResponse = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@AlejandroSoria`);
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.status === 'ok' && fallbackData.items && fallbackData.items.length > 0) {
              const mediumPosts: BlogPost[] = fallbackData.items.map((item: any, index: number) => {
                let image = item.thumbnail;
                if (!image && item.description) {
                  const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                  if (imgMatch) image = imgMatch[1];
                }
                if (!image) image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';

                return {
                  id: item.guid || `medium-fb-${index}`,
                  title: item.title,
                  excerpt: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
                  content: item.content,
                  author: item.author || 'Alejandro Soria',
                  date: item.pubDate,
                  image: image,
                  category: 'Medium',
                  slug: item.link
                };
              });
              setPosts(mediumPosts);
              setLoading(false);
              return;
            }
          }
          throw new Error('Medium feed returned no items or status not ok');
        }
      } catch (error) {
        console.error('Error fetching Medium posts, falling back to Firestore:', error);
        
        const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
        unsubFirestore = onSnapshot(q, (snapshot) => {
          const firestorePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
          setPosts(firestorePosts);
          setLoading(false);
        }, (err) => {
          console.error('Firestore blog error:', err);
          setLoading(false);
        });
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
    <section className="py-16 md:py-24 bg-black text-white border-b border-white/10">
      <div className="container">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="blog" className="py-16 md:py-24 bg-black text-white border-b border-white/10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <p className="text-[10px] font-bold text-supporting-grey uppercase tracking-widest mb-2">Insights & Updates</p>
            <h2 className="text-[2rem] md:text-h2-caps text-white">The Founder's Journal</h2>
          </div>
          <a 
            href={`https://medium.com/${settings?.mediumUsername || '@AlejandroSoriaQuantum'}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all text-white hover:text-pink"
          >
            Read on Medium <ArrowRight size={16} />
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer block"
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
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-zinc-900/50">
            <p className="text-supporting-grey">No posts found. Check back soon or visit our Medium profile.</p>
          </div>
        )}
      </div>
    </section>
  );
}
