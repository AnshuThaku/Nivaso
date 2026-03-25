import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const UserMenu = ({ user, logout, handleHostClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 relative">
      <Link 
        to="/listings/new" 
        onClick={handleHostClick} 
        className="hidden md:block text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-[1px] active:scale-95"
      >
        Host Your Home
      </Link>

      {/* Desktop User Section */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 bg-gray-50 border px-3 py-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
              <FaUserCircle className="text-rose-500 text-xl" />
              <span className="text-sm font-semibold text-gray-700">{user.username}</span>
            </Link>
            <button onClick={logout} className="text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full transition shadow-sm">Log out</button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-semibold text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition">Log in</Link>
            <Link to="/signup" className="text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full shadow-sm transition">Sign up</Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Trigger & Dropdown */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 border border-gray-300 rounded-full p-2 px-3 hover:shadow-md transition bg-white">
          <FaBars className="text-gray-600" />
          <FaUserCircle className={`text-2xl ${user ? 'text-rose-500' : 'text-gray-500'}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-14 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b"><p className="text-sm font-semibold truncate">Hi, {user.username}</p></div>
                  <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Profile</Link>
                  <Link to="/trips" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Trips</Link>
                  <Link to="/wishlists" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Wishlists</Link>
                  <Link to="/listings/new" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Host Your Home</Link>
                  <hr className="my-1" />
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-sm text-rose-500 font-semibold hover:bg-gray-50">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Log in</Link>
                  <Link to="/signup" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Sign up</Link>
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