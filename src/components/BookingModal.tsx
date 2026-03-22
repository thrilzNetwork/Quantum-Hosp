import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, ChevronRight, CheckCircle2, Globe } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', property: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const dates = [
    { day: 'Mon', date: '23', month: 'Mar' },
    { day: 'Tue', date: '24', month: 'Mar' },
    { day: 'Wed', date: '25', month: 'Mar' },
    { day: 'Thu', date: '26', month: 'Mar' },
    { day: 'Fri', date: '27', month: 'Mar' },
  ];

  const times = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
        >
          {/* Left Side - Info */}
          <div className="md:w-1/3 bg-black text-white p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink flex items-center justify-center mb-8">
                <CalendarIcon className="text-black" size={24} />
              </div>
              <h2 className="text-h4 mb-4">Book a Consultation</h2>
              <p className="text-sm opacity-60 mb-8">
                Design a custom automation system tailored to your property's unique operational needs.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-pink" />
                  <span>45 Minutes</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe size={16} className="text-pink" />
                  <span>Google Meet / Zoom</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Powered by</p>
              <div className="font-bold tracking-tighter text-xl">QUANTUM</div>
            </div>
          </div>

          {/* Right Side - Scheduler */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto text-white">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {settings?.googleCalendarBookingLink ? (
              <div className="w-full h-full min-h-[500px]">
                <iframe 
                  src={settings.googleCalendarBookingLink}
                  className="w-full h-full border-0"
                  title="Google Calendar Booking"
                />
              </div>
            ) : isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-supporting-grey">
                    We've sent a calendar invitation to <span className="text-pink font-medium">{formData.email}</span>.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="btn bg-pink text-black px-8 py-3 rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-6">Select a Date</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {dates.map((d) => (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                              selectedDate === d.date 
                                ? 'border-pink bg-pink/10' 
                                : 'border-white/5 hover:border-white/20'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold opacity-40 mb-1">{d.day}</span>
                            <span className="text-xl font-bold text-white">{d.date}</span>
                            <span className="text-[10px] uppercase font-bold opacity-40 mt-1">{d.month}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="text-xl font-bold mb-6">Select a Time</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {times.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${
                                selectedTime === t 
                                  ? 'border-pink bg-pink/10' 
                                  : 'border-white/5 hover:border-white/20'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="pt-8">
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(2)}
                        className="w-full btn bg-pink text-black py-5 rounded-2xl font-bold disabled:opacity-20 flex items-center justify-center gap-2 group"
                      >
                        Next Step
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <button 
                        onClick={() => setStep(1)}
                        className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 mb-4 flex items-center gap-1"
                      >
                        ← Back to calendar
                      </button>
                      <h3 className="text-xl font-bold">Your Details</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold opacity-40 ml-1">Full Name</label>
                          <input 
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 rounded-xl bg-white/5 border-2 border-transparent focus:border-pink outline-none transition-all text-white"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold opacity-40 ml-1">Email Address</label>
                          <input 
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-4 rounded-xl bg-white/5 border-2 border-transparent focus:border-pink outline-none transition-all text-white"
                            placeholder="john@property.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold opacity-40 ml-1">Property Name</label>
                          <input 
                            required
                            type="text"
                            value={formData.property}
                            onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                            className="w-full p-4 rounded-xl bg-white/5 border-2 border-transparent focus:border-pink outline-none transition-all text-white"
                            placeholder="Grand Hotel & Spa"
                          />
                        </div>
                      </div>

                      <div className="pt-8">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn bg-pink text-black py-5 rounded-2xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                          {!isSubmitting && <CheckCircle2 size={18} />}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
