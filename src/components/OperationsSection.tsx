import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, CheckCircle2, Zap } from 'lucide-react';
import Modal from './Modal';

export default function OperationsSection() {
  const [selectedTool, setSelectedTool] = useState<any>(null);

  const tools = [
    {
      id: 'attenda',
      name: 'Attenda',
      tag: 'In-Room Ordering System',
      description: 'Allow guests to order food, amenities, and services directly from their phone using a QR code.',
      features: ['QR ordering', 'Staff dashboard', 'Menu management', 'Room charge ready'],
      useCase: 'Increase F&B revenue and reduce front desk calls.',
      color: 'bg-pink-light',
      span: 'md:col-span-4'
    },
    {
      id: 'reviewflow',
      name: 'ReviewFlow',
      tag: 'Guest Feedback & Review Generator',
      description: 'Turn guest feedback into public reviews and internal alerts.',
      features: ['Smart feedback emails', 'Sentiment routing', 'Google / TripAdvisor redirection', 'Complaint alerts'],
      useCase: 'Increase social reputation and catch problems before they escalate.',
      color: 'bg-yellow',
      span: 'md:col-span-2'
    },
    {
      id: 'eventflow',
      name: 'EventFlow',
      tag: 'Group & Event Operations Portal',
      description: 'Organize group stays and events with a dedicated digital hub.',
      features: ['Custom event landing pages', 'Guest access links', 'Event schedule display', 'Guest service requests'],
      useCase: 'Eliminate confusion between sales, operations, and group organizers.',
      color: 'bg-black-2',
      textColor: 'text-white',
      span: 'md:col-span-3'
    },
    {
      id: 'budgetcontrol',
      name: 'BudgetControl',
      tag: 'Department Budget & Invoice Tracker',
      description: 'Simple financial control system for hotel departments.',
      features: ['Budget allocation', 'Invoice logging', 'Vendor tracking', 'Real-time balance'],
      useCase: 'Give department heads control over spending without complex accounting systems.',
      color: 'bg-blue',
      span: 'md:col-span-3'
    }
  ];

  return (
    <section id="tools" className="py-32 bg-black text-white border-b border-white/10">
      <div className="container">
        <h2 className="text-h3 mb-16">Featured Tools</h2>
        
        <div className="grid gap-6 md:grid-cols-6">
          {tools.map((tool) => (
            <motion.div 
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedTool(tool)}
              className={`${tool.span} group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-2xl ${tool.color} ${tool.textColor || 'text-black'} p-6 md:p-12 min-h-[400px] md:min-h-[450px]`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-x-3 mb-6">
                  <span className="text-caps-s font-bold">{tool.name}</span>
                  <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                  <span className="text-[0.6875rem] opacity-70">{tool.tag}</span>
                </div>
                <h3 className="text-h4 mb-4">{tool.name}</h3>
                <p className="text-body-m opacity-80 max-w-lg mb-8">
                  {tool.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="text-caps-s opacity-60">Features:</div>
                  <ul className="grid grid-cols-2 gap-2">
                    {tool.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 rounded-full bg-current"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                  <div className="text-caps-s opacity-60 mb-1">Use Case:</div>
                  <p className="text-sm font-medium">{tool.useCase}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-x-2 text-caps-s font-bold relative z-10">
                <span>Deploy instantly</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative background seed */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10 pointer-events-none blur-3xl bg-current rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedTool} 
        onClose={() => setSelectedTool(null)}
        title={selectedTool?.name}
      >
        {selectedTool && (
          <div className="space-y-8">
            <div className={`p-8 rounded-2xl ${selectedTool.color} ${selectedTool.textColor || 'text-black'}`}>
              <div className="text-caps-s font-bold mb-2">{selectedTool.tag}</div>
              <h4 className="text-h4 mb-4">{selectedTool.name}</h4>
              <p className="opacity-80">{selectedTool.description}</p>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-bold uppercase tracking-widest opacity-40">Key Features</h5>
              <div className="grid gap-3">
                {selectedTool.features.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-black/5">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black text-white space-y-4">
              <div className="flex items-center gap-2 text-pink">
                <Zap size={18} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-widest">Instant Deployment</span>
              </div>
              <p className="text-sm opacity-70">This tool can be activated for your hotel in less than 5 minutes. No integration required.</p>
              <button className="w-full bg-pink text-black py-4 rounded-xl font-bold hover:bg-pink-light transition-colors">
                Get Started with {selectedTool.name}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
