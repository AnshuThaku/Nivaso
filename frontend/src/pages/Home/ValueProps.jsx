import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Headphones } from 'lucide-react'; // Premium Icons

// Feature Data
const features = [
  {
    id: 1,
    icon: <Zap size={28} strokeWidth={2} />,
    title: "Lightning Fast Booking",
    description: "No more waiting. Book your perfect stay in just 3 clicks with our streamlined, secure checkout process.",
    stat: "3x",
    statLabel: "Faster booking"
  },
  {
    id: 2,
    icon: <ShieldCheck size={28} strokeWidth={2} />,
    title: "100% Verified Stays",
    description: "Every property goes through a strict quality check. What you see in the pictures is exactly what you get.",
    stat: "10k+",
    statLabel: "Verified homes"
  },
  {
    id: 3,
    icon: <Headphones size={28} strokeWidth={2} />,
    title: "24/7 Premium Support",
    description: "Our dedicated concierge team is always online to help you before, during, and after your trip.",
    stat: "24/7",
    statLabel: "Live support"
  }
];

export default function ValueProps() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-slate-50 py-10 md:py-18 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-rose-500 font-bold text-xs tracking-widest uppercase mb-3 block">
            Why Choose Nivaso
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Built for modern <span className="text-gray-400">travelers.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
            We've reimagined the booking experience to be faster, safer, and more transparent so you can focus on the journey.
          </p>
        </motion.div>

        {/* 🚀 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 cursor-pointer">
          {features.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative p-8 md:p-10 bg-white border border-gray-100 rounded-[2rem] hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 overflow-hidden"
            >
              {/* Icon Container */}
              <div className="w-16 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rose-500 transition-all duration-500 text-rose-500 group-hover:text-white shadow-sm">
                {item.icon}
              </div>

              {/* Content */}
              <h3 className="text-1xl font-black text-gray-900 mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {item.description}
              </p>

              {/* Stats Layout */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                <span className="text-2xl font-black text-rose-500">{item.stat}</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider leading-tight w-30">
                  {item.statLabel}
                </span>
              </div>

              {/* Decorative Hover Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* 🚀 Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500 font-medium mb-6">
            Ready to experience the difference?
          </p>
          <button 
            onClick={() => navigate('/listings')}
            className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-500 transition-all duration-300 shadow-lg hover:shadow-rose-500/25 cursor-pointer"
          >
            Start exploring
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
}