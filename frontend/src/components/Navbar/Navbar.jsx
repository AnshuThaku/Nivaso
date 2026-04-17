import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Globe, ChevronDown, User, Menu, X, Home, LogIn, UserPlus } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import DesktopSearch from './DesktopSearch';
import MobileSearchModal from './MobileSearchModel';

const Navbar = () => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // 🔥 Restored Desktop Dropdown State
  
  const [user, setUser] = useState(null); 

  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Desktop Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close sidebar & desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) setIsSidebarOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  };

  const showSearch = !isHomePage || isScrolled;

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 
        max-md:bg-white max-md:h-14 max-md:border-b max-md:border-gray-100 max-md:shadow-sm
        ${isScrolled || !isHomePage 
          ? 'md:bg-white md:border-b md:border-gray-100 md:shadow-sm md:h-20 py-0' 
          : 'md:bg-transparent md:h-20 md:py-2'}
      `}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
          
          {/* Hamburger (Mobile Left) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-700">
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <Link to="/">
              <span className={`text-rose-500 font-black tracking-tighter transition-all ${isScrolled ? 'text-xl' : 'text-2xl'} max-md:text-xl`}>
                Nivaso
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className={`hidden md:flex flex-1 justify-center transition-all duration-500 ${
            showSearch ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
          }`}>
             <DesktopSearch />
          </div>

          {/* Mobile Search Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileModalOpen(true)} className="p-2 text-rose-500"><Search size={22} /></button>
          </div>

          {/* 🚀 Desktop User Menu (Dropdown Restored) */}
          <div className="hidden md:flex items-center justify-end gap-5 relative" ref={dropdownRef}>
             <Link to="/listings/new" className={`flex items-center gap-2 font-bold text-sm transition-colors ${
               isScrolled || !isHomePage ? 'text-slate-500 hover:text-rose-500' : 'text-white hover:text-gray-200'
             }`}>
               <Globe size={18} /><span>Host Your Home</span>
             </Link>

             {/* Profile Trigger */}
             <div 
               onClick={() => setIsProfileOpen(!isProfileOpen)} 
               className="flex items-center gap-2 cursor-pointer group"
             >
                <ChevronDown size={14} className={`${isScrolled || !isHomePage ? 'text-slate-400' : 'text-white'} ${isProfileOpen ? 'rotate-180 text-rose-500' : ''} transition-all`} />
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-white shadow-sm group-hover:shadow-md transition-all">
                  {user ? <img src={user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><User size={22} /></div>}
                </div>
             </div>

             {/* 🔥 Desktop Dropdown Menu */}
             <AnimatePresence>
               {isProfileOpen && (
                 <motion.div 
                   initial={{ opacity: 0, y: 12, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 12, scale: 0.95 }}
                   transition={{ duration: 0.2, ease: "easeIn" }}
                   className="absolute top-full right-0 mt-3 w-60 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                 >
                   <div className="flex flex-col">
                      {!user ? (
                        <>
                          <button onClick={() => handleNavigation('/signup')} className="text-left px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition">Sign up</button>
                          <button onClick={() => handleNavigation('/login')} className="text-left px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition border-b border-gray-100">Log in</button>
                        </>
                      ) : (
                        <button onClick={() => handleNavigation('/profile')} className="text-left px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition border-b border-gray-100">My Profile</button>
                      )}
                      <div className="h-[1px] bg-gray-100 my-1"></div>
                      <button onClick={() => handleNavigation('/listings/new')} className="text-left px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition">Host your home</button>
                      <button onClick={() => handleNavigation('/help')} className="text-left px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition">Help Center</button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* 🚀 Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50]" />
            <motion.div 
              ref={sidebarRef}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[60] shadow-2xl flex flex-col"
            >
              <div className="bg-slate-50 p-6 pt-10 border-b border-gray-100 relative text-left">
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-white rounded-full transition"><X size={20} /></button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center overflow-hidden">
                    {user ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={28} className="text-slate-200" />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 truncate w-32">{user ? user.name : 'Nivaso User'}</h3>
                    <p className="text-xs text-gray-500">{user ? 'View Profile' : 'Welcome to Nivaso'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 text-left">
                <button onClick={() => handleNavigation('/')} className="flex items-center gap-4 px-4 py-3 text-gray-700 font-bold hover:bg-rose-50 rounded-xl transition"><Home size={20}/> Home</button>
                <button onClick={() => handleNavigation('/listings/new')} className="flex items-center gap-4 px-4 py-3 text-gray-700 font-bold hover:bg-rose-50 rounded-xl transition"><Globe size={20}/> Host your home</button>
                <div className="h-[1px] bg-gray-100 my-2 mx-4"></div>
                {!user ? (
                  <>
                    <button onClick={() => handleNavigation('/signup')} className="flex items-center gap-4 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition"><UserPlus size={20}/> Sign up</button>
                    <button onClick={() => handleNavigation('/login')} className="flex items-center gap-4 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition"><LogIn size={20}/> Log in</button>
                  </>
                ) : (
                  <button onClick={() => handleNavigation('/profile')} className="flex items-center gap-4 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition"><User size={20}/> My Profile</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MobileSearchModal isOpen={isMobileModalOpen} onClose={() => setIsMobileModalOpen(false)} />
    </>
  );
};

export default Navbar;