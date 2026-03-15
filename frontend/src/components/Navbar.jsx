import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaSearch, FaPlus, FaMinus, FaMountain, FaSnowflake, FaCity, FaFire } from "react-icons/fa";
import { GiCastle, GiFarmTractor, GiCampingTent, GiBoatFishing, GiForestCamp } from "react-icons/gi";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlinePool, MdApartment } from "react-icons/md";

const categories = [
  { label: "Trending", icon: <FaFire /> },
  { label: "Rooms", icon: <MdApartment /> },
  { label: "Iconic cities", icon: <FaCity /> },
  { label: "Mountains", icon: <FaMountain /> },
  { label: "Castles", icon: <GiCastle /> },
  { label: "Amazing pools", icon: <MdOutlinePool /> },
  { label: "Camping", icon: <GiCampingTent /> },
  { label: "Farms", icon: <GiFarmTractor /> },
  { label: "Arctic", icon: <FaSnowflake /> },
  { label: "Boats", icon: <GiBoatFishing /> },
  { label: "Domes", icon: <GiForestCamp /> },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestDropdownRef = useRef(null);

  useEffect(() => {
    if (!isGuestOpen) return;
    const handleClose = (e) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target)) {
        setIsGuestOpen(false);
      }
    };
    const handleKeyClose = () => setIsGuestOpen(false);
    document.addEventListener('mousedown', handleClose);
    document.addEventListener('keydown', handleKeyClose);
    return () => {
      document.removeEventListener('mousedown', handleClose);
      document.removeEventListener('keydown', handleKeyClose);
    };
  }, [isGuestOpen]);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });

  const handleSearch = () => {
    let query = `/listings?`;
    if (searchQuery.trim()) query += `search=${encodeURIComponent(searchQuery)}&`;
    if (selectedCategory) query += `category=${encodeURIComponent(selectedCategory)}&`;
    navigate(query);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      navigate("/listings");
    } else {
      setSelectedCategory(category);
      navigate(`/listings?category=${encodeURIComponent(category)}`);
    }
  };

  const handleHostClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login", { state: { from: "/listings/new" } });
    }
  };

  const updateGuest = (type, operation) => {
    setGuests((prev) => {
      const newValue = operation === "inc" ? prev[type] + 1 : prev[type] - 1;
      if (newValue < 0) return prev;
      if (type === "adults" && newValue < 1) return prev; 
      return { ...prev, [type]: newValue };
    });
  };

  const totalGuests = guests.adults + guests.children;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
               <span className="text-xl md:text-2xl font-bold text-rose-500 block tracking-tight">
                 Nivaso
               </span>
            </Link>
          </div>
          
          {/* Desktop Search Bar */}
           <div className="hidden md:flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer relative">
              <input
                type="text"
                placeholder="Search destinations"
                className="text-sm font-semibold px-4 border-r border-gray-300 outline-none w-40 bg-transparent placeholder-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="text-sm font-semibold px-4 border-r border-gray-300 whitespace-nowrap cursor-pointer" onClick={() => alert("Coming soon!")}>Any week</div>
              <div className="text-sm text-gray-500 px-4 whitespace-nowrap" onClick={() => setIsGuestOpen(!isGuestOpen)}>
                 <span className={`${totalGuests ? 'font-semibold text-gray-800' : ''}`}>
                    {totalGuests > 0 ? `${totalGuests} guests` : 'Add guests'}
                 </span>
              </div>
              <div className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition" onClick={handleSearch}>
                <FaSearch size={12} />
              </div>

               {/* Guest Dropdown */}
               <AnimatePresence>
                {isGuestOpen && (
                  <motion.div ref={guestDropdownRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute top-16 right-0 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-[400px] z-50">
                      {['adults', 'children', 'infants', 'pets'].map((type) => (
                        <div key={type} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                          <div>
                            <h3 className="font-semibold text-base capitalize">{type}</h3>
                            <p className="text-sm text-gray-500">{type === 'adults' ? 'Ages 13+' : type === 'children' ? 'Ages 2-12' : type === 'infants' ? 'Under 2' : 'Service animal?'}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button onClick={() => updateGuest(type, 'dec')} disabled={type === 'adults' ? guests[type] <= 1 : guests[type] <= 0} className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-20"><FaMinus size={10} /></button>
                            <span className="w-4 text-center">{guests[type]}</span>
                            <button onClick={() => updateGuest(type, 'inc')} className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center"><FaPlus size={10} /></button>
                          </div>
                        </div>
                      ))}
                  </motion.div>
                )}
               </AnimatePresence>
           </div>

          {/* Right Menu Section */}
        
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
                  <div className="flex items-center gap-2 bg-gray-50 border px-3 py-1.5 rounded-full">
                    <FaUserCircle className="text-rose-500 text-xl" />
                    <span className="text-sm font-semibold text-gray-700">{user.username}</span>
                  </div>
                  <button onClick={logout} className="text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full transition shadow-sm">Log out</button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm font-semibold text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition">Log in</Link>
                  <Link to="/signup" className="text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full shadow-sm transition">Sign up</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
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
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden pb-4 px-4">
         <div className="flex items-center border border-gray-300 rounded-full py-2.5 px-4 shadow-sm bg-gray-50">
           <FaSearch className="text-gray-500 mr-2" />
           <input
             type="text"
             placeholder="Search destinations..."
             className="flex-grow bg-transparent outline-none text-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
           />
         </div>
      </div>

      {/* 🔥 FIX: Categories Bar aligned with the main container on big screens */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex z-0 items-center gap-8 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <div key={cat.label} onClick={() => handleCategoryClick(cat.label)} className={`flex flex-col items-center gap-2 min-w-[64px] cursor-pointer group transition ${selectedCategory === cat.label ? 'text-black border-b-2 border-black pb-2' : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200 pb-2'}`}>
                  <div className="text-2xl group-hover:scale-110 transition">{cat.icon}</div>
                  <span className="text-xs font-semibold whitespace-nowrap">{cat.label}</span>
                </div>
              ))}
           </div>
       </div>
    </nav>
  );
};

export default Navbar;