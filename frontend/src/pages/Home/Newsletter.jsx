import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, MailOpen } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 4000); // 4 seconds baad wapas normal
    }
  };

  return (
    <section className="w-full bg-white py-12 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 Ultra Clean Light Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full bg-slate-50 border border-gray-100 rounded-[3rem] px-6 py-16 md:py-20 text-center overflow-hidden"
        >
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent opacity-50" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            
            {/* Elegant Icon */}
            <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-gray-50 flex items-center justify-center mb-8">
              <MailOpen className="text-rose-500" size={28} strokeWidth={1.5} />
            </div>

            {/* Typography */}
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-5 leading-tight">
              Your next great escape, <br className="hidden sm:block" />
              <span className="text-rose-500">delivered.</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-lg">
              Sign up for our newsletter and get exclusive access to secret deals, handpicked stays, and travel inspiration.
            </p>

            {/* Minimalist Form Area */}
            <div className="w-full max-w-md mx-auto">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="relative flex items-center">
                      <input 
                        type="email" 
                        required
                        placeholder="Email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 px-6 py-4 rounded-full outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all shadow-sm text-base"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 bg-gray-900 text-white p-3 rounded-full hover:bg-rose-500 transition-colors shadow-md group"
                      >
                        <Send size={18} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      No spam. Unsubscribe at any time.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-emerald-100 shadow-sm rounded-full py-4 px-6 flex items-center justify-center gap-3"
                  >
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                      <Check className="text-emerald-500" size={16} strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 font-bold text-base">You're on the list!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}