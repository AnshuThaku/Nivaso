import { useState, useEffect, useRef } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// 🚀 DesktopSearch ko import kiya
import DesktopSearch from "../../components/Navbar/DesktopSearch"; 

const HeroSection = ({ listingMode, setListingMode }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const navigate = useNavigate();

  // Intersection Observer Logic
  useEffect(() => { 
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
              setIsVideoPlaying(false);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      ref={heroRef}
      className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
          style={{  }}
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
        >
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-4">
        
        {/* Brand Badge */}
        <div className="mb-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          <span className="text-white/90 text-[13px] font-medium tracking-wide">Trusted by travelers worldwide</span>
        </div>

        {/* 🚀 Headline: Font size reduced for better balance */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Find your perfect{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-rose-500">
            {listingMode === "stays" ? "escape" : "home"}
          </span>.
        </h1>
        
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto font-light mb-10">
          {listingMode === "stays" 
            ? "Discover handpicked vacation stays in extraordinary destinations."
            : "Connect directly with verified property owners for hassle-free rentals."
          }
        </p>

        {/* 🚀 Mode Toggle */}
        <div className="mb-8 bg-black/20 backdrop-blur-xl border border-white/10 p-1 rounded-full flex relative w-fit">
          <button 
            onClick={() => setListingMode("stays")}
            className={`relative z-10 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${listingMode === "stays" ? "text-black" : "text-white/70 hover:text-white"}`}
          >
            Vacation Stays
          </button>
          <button 
            onClick={() => setListingMode("rentals")}
            className={`relative z-10 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${listingMode === "rentals" ? "text-black" : "text-white/70 hover:text-white"}`}
          >
            Room Rentals
          </button>
          <div 
            className={`absolute top-1 bottom-1 bg-white rounded-full shadow-md transition-all duration-500 ease-out ${listingMode === "stays" ? "left-1" : "left-[51%]"}`}
            style={{ width: '48%' }} 
          />
        </div>

        {/* 🚀 INTEGRATED SEARCH: DesktopSearch component injected here */}
        <div className="w-full max-w-3xl transform scale-105 md:scale-110">
          <DesktopSearch isHero={true} />
        </div>

      </div>

      {/* Video Controls & Scroll */}
      <div className="absolute bottom-8 right-8 z-20">
        <button onClick={toggleMute} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition">
          {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-50">
        <span className="text-white text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1">
          <div className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;