import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Frequent Traveler",
    location: "Delhi",
    quote: "I've used many booking platforms, but Nivaso stands out. The properties are exactly as shown, and the booking process is seamless.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Rohan Desai",
    role: "Business Executive",
    location: "Mumbai",
    quote: "As someone who travels frequently for work, I need reliable accommodations. Nivaso has never disappointed me. The 24/7 support is a game-changer.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Property Host",
    location: "Udaipur",
    quote: "Listing my heritage property on Nivaso was the best decision. The platform brings quality guests, and I've earned over ₹5 lakhs in the past year.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Digital Nomad",
    location: "Bangalore",
    quote: "The long-term rental feature is perfect for remote workers like me. Found an amazing apartment in Kerala for 3 months at an unbeatable price.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Meera Krishnan",
    role: "Family Traveler",
    location: "Chennai",
    quote: "Traveling with kids is challenging, but Nivaso's detailed filters helped us find kid-friendly homes with all amenities. Unforgettable trip!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Arjun Reddy",
    role: "Weekend Explorer",
    location: "Hyderabad",
    quote: "Every weekend getaway is now sorted thanks to Nivaso. The variety of unique stays and easy booking makes trip planning a breeze.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  }
];

// Duplicate for seamless infinite scroll
const allTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollSpeed = 0.5;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollTop += scrollSpeed;
        
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight / 2) {
          scrollContainer.scrollTop = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="w-full bg-slate-50 pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 Header Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-rose-500 font-bold text-xs tracking-widest uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Loved by <span className="text-gray-400">thousands.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg">
            Real stories from travelers and hosts who trust Nivaso for their journeys.
          </p>
        </motion.div>

        {/* Scrolling Cards Container */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="h-[550px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {allTestimonials.map((testimonial, index) => (
                // 🚀 Added Framer Motion to Individual Cards
                <motion.div 
                  key={`${testimonial.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 6) * 0.1, duration: 0.5 }} // Staggered entry animation
                  className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-100 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-base leading-tight">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                  
                  {/* Premium Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < testimonial.rating ? 'fill-rose-500 text-rose-500' : 'fill-gray-200 text-gray-200'} 
                      />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 Trust Badges Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-10 md:gap-20"
        >
          {[
            { value: '4.9', label: 'App Store Rating' },
            { value: '50K+', label: 'Happy Guests' },
            { value: '98%', label: 'Would Recommend' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + (i * 0.1) }} // Staggered badges
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}