import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';

export default function HostBanner() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-13 md:py-20 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        
        {/* Full Width Rounded Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50"
        >
          
          <div className="flex flex-col lg:flex-row min-h-[450px] lg:min-h-[500px]">
            
            {/* 🚀 Left Content - Premium Dark Section */}
            <div className="lg:w-1/2 bg-gray-900 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              
              {/* Subtle Rose Background Glow */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rose-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white rounded-full blur-[80px]" />
              </div>

              <div className="relative z-10">
                <span className="inline-block text-rose-400 font-bold text-xs tracking-[0.2em] uppercase mb-4">
                  Become a Host
                </span>
                
                {/* 🚀 Reduced Font Size & Tighter Tracking */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] mb-5 tracking-tight">
                  Turn your extra space into
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-rose-500 block mt-1"> extra income.</span>
                </h2>
                
                <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed max-w-md">
                  Join thousands of hosts who are earning by sharing their properties on Nivaso. It's simple, secure, and highly profitable.
                </p>

                {/* Compact Stats Row */}
                <div className="flex gap-8 mb-10">
                  <div>
                    <div className="text-1xl md:text-2xl font-black text-white">₹45K</div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Avg. Monthly</div>
                  </div>
                  <div className="w-px bg-gray-800" />
                  <div>
                    <div className="text-2xl md:text-`3xl font-black text-white">5K+</div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Active Hosts</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/listings/new')}
                    className="bg-rose-500 text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-500/25 cursor-pointer"
                  >
                    Start hosting
                  </button>
                  <button className="group border border-gray-700 text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                    <Play size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    Watch how it works
                  </button>
                </div>
              </div>
            </div>

            {/* 🚀 Right Image Section */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" 
                alt="Modern home interior" 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Glassmorphism Floating Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-auto bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-[320px] border border-white/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                    alt="Host"
                    className="w-12 h-12 rounded-full object-cover border-2 border-rose-500"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">Rahul Sharma</h4>
                    <p className="text-xs text-gray-500">Superhost since '22</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed mb-3">
                  "Hosting on Nivaso helped me earn ₹60K/month from my spare room. Best decision ever!"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-rose-500 text-rose-500" />
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}