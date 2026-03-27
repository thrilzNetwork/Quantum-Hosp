import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Tool } from '../types';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'tools', id), (docSnap) => {
      if (docSnap.exists()) {
        const toolData = { id: docSnap.id, ...docSnap.data() } as Tool;
        setTool(toolData);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `tools/${id}`);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <h1 className="text-h3 mb-4 font-black uppercase tracking-tighter">Tool not found</h1>
        <Link to="/tools" className="px-8 py-4 bg-pink text-black rounded-full font-black uppercase tracking-widest text-xs">
          Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container relative z-10">
        <Link to="/tools" className="inline-flex items-center gap-3 text-white/40 hover:text-pink mb-16 transition-all group font-black uppercase tracking-widest text-[10px]">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-pink/50 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Tools
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-16 rounded-[3rem] ${tool.color} ${tool.textColor || 'text-black'} relative overflow-hidden flex flex-col justify-center min-h-[500px]`}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[size:30px_30px]"></div>
            
            <div className="relative z-10 mb-10">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] px-4 py-2 bg-black/10 rounded-full border border-black/5 inline-block mb-8">
                {tool.tag}
              </span>
              <h1 className="text-[4.5rem] md:text-[6rem] font-black uppercase leading-[0.85] tracking-tighter mb-8">
                {tool.name}.
              </h1>
              {tool.headline && (
                <p className="text-2xl md:text-3xl font-black uppercase tracking-tight opacity-90 leading-tight max-w-xl">
                  {tool.headline}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-12">
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink mb-6">Overview</h2>
                <p className="text-body-l font-medium opacity-60 leading-relaxed text-white max-w-xl">
                  {tool.description}
                </p>
              </div>

              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink mb-8">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {tool.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                      <div className="w-2 h-2 rounded-full bg-pink flex-shrink-0"></div>
                      <span className="text-[11px] font-black uppercase tracking-tight text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/40 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-pink" />
                  Instant Setup
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-pink" />
                  Direct Support
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <section className="py-32 border-t border-white/5">
          <div className="p-16 md:p-24 rounded-[4rem] bg-white/5 text-white text-center relative overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,105,180,0.05),transparent_70%)]"></div>
            <div className="relative z-10">
              <h2 className="text-[3rem] md:text-h1-caps font-black uppercase tracking-tighter leading-none text-white mb-10">Ready to <span className="text-pink">get started</span>?</h2>
              <p className="text-body-l font-medium opacity-80 mb-16 max-w-2xl mx-auto text-white">
                {tool.useCase}
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <a 
                  href={`mailto:alejandro@quantumhospitalitysolutions.com?subject=Inquiry about ${tool.name}`}
                  className="px-16 py-6 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-white transition-all flex items-center gap-3"
                >
                  <Mail size={18} /> Contact Alejandro
                </a>
                <Link to="/tools" className="flex items-center gap-3 text-white/40 hover:text-pink transition-all font-black uppercase tracking-widest text-[10px]">
                  View All Tools <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
