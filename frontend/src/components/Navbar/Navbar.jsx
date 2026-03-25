import { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSearch, FaArrowLeft } from "react-icons/fa"; // 🔥 FaArrowLeft import kiya

// 🧩 Components Import
import Categories from "./Categories";
import DesktopSearch from "./DesktopSearch";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // 🔥 NAYA LOGIC: Check karo ki user Home ya Main Listings page par hai ya nahi
  const isMainPage = location.pathname === "/" || location.pathname === "/listings";

  // Global Search State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1️⃣ Logo / Back Button Section */}
          <div className="flex-shrink-0 flex items-center">
            
            {/* Desktop Logo (Hamesha dikhega badi screen pe) */}
            <Link to="/" className="hidden md:flex items-center">
               <span className="text-xl md:text-2xl font-bold text-rose-500 block tracking-tight">
                 Nivaso
               </span>
            </Link>

            {/* Mobile Logo OR Back Button */}
            <div className="md:hidden flex items-center">
              {isMainPage ? (
                <Link to="/" className="flex items-center">
                   <span className="text-xl font-bold text-rose-500 block tracking-tight">
                     Nivaso
                   </span>
                </Link>
              ) : (
                <button 
                  onClick={() => navigate(-1)} 
                  className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <FaArrowLeft size={18} />
                </button>
              )}
            </div>

          </div>
          
          {/* 2️⃣ Desktop Search Bar Component */}
          <DesktopSearch 
             searchQuery={searchQuery} 
             setSearchQuery={setSearchQuery} 
             handleSearch={handleSearch} 
          />

          {/* 3️⃣ User Menu Component */}
          <UserMenu 
             user={user} 
             logout={logout} 
             handleHostClick={handleHostClick} 
          />
        </div>
      </div>

      {/* 🔥 Mobile Search Bar - SIRF HOME PAGE PAR DIKHEGA */}
      {isMainPage && (
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
      )}

       {/* 4️⃣ Categories Component - SIRF HOME PAGE PAR DIKHEGA */}
       {isMainPage && (
           <Categories 
               selectedCategory={selectedCategory} 
               onCategoryClick={handleCategoryClick} 
           />
       )}
    </nav>
  );
};

export default Navbar;