import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa"; 
import { AnimatePresence, motion } from "framer-motion";

const UserMenu = ({ user, logout, handleHostClick, isTransparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="flex items-center gap-4 relative">
      
      {/* Profile Icon Wrapper */}
      <div 
        className="relative py-2 flex items-center gap-2 cursor-pointer group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isTransparent 
            ? 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20' 
            : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <FaUserCircle className={`text-[24px] transition-colors duration-200 ${
            isTransparent 
              ? 'text-white' 
              : (user ? 'text-gray-900' : 'text-gray-500')
          }`} />
        </div>

        <FaChevronDown 
          className={`text-[10px] transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          } ${
            isTransparent ? 'text-white/70' : 'text-gray-400'
          }`} 
        />

        {/* Hover Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 z-50 overflow-hidden"
            >
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-semibold text-gray-900 truncate">Hi, {user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || "Manage your account"}</p>
                  </div>
                  <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsOpen(false)}>Profile Page</Link>
                      <Link to="/account-settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsOpen(false)}>Account Settings</Link>
                  </div>
                  <hr className="my-1 border-gray-100" />
                  <div className="py-1">
                      <Link to="/trips" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsOpen(false)}>My Trips</Link>
                      <Link to="/wishlists" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsOpen(false)}>Wishlists</Link>
                  </div>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Log in</Link>
                  <Link to="/signup" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsOpen(false)}>Sign up</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link to="/help" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsOpen(false)}>Help Center</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
};

export default UserMenu;