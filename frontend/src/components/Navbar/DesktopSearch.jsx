import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchContext } from '../../context/SearchContext';
import SuggestionsDropdown from '../Search/Suggestion';

const DesktopSearch = () => {
  const dropdownRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    searchQuery, setSearchQuery, 
    fetchRecentSearches, handleSearchSubmit 
  } = useSearchContext();

  // Bahar click karne par wapas chota ho jayega (Collapse)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    fetchRecentSearches();
    setIsExpanded(true);
  };

  return (
    <div ref={dropdownRef} className="relative hidden md:flex flex-col items-center justify-center">
      
      {/* 🚀 SEARCH INPUT WITH DRAMATIC WIDTH ANIMATION */}
      <motion.div 
        initial={false}
        // Normal size: 300px | Expanded size: 450px
        animate={{ width: isExpanded ? 450 : 300 }} 
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`flex items-center rounded-full py-1.5 px-2 transition-colors duration-300
          ${isExpanded 
            ? 'bg-gray-50 border border-gray-300 shadow-lg ring-4 ring-rose-500/10' 
            : 'bg-white border border-gray-300 shadow-sm hover:shadow-md'}`}
      >
        <input 
          type="text"
          placeholder="Search stays in India..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit(searchQuery);
              setIsExpanded(false);
            }
          }}
          className="flex-grow bg-transparent outline-none text-sm font-medium text-gray-800 placeholder-gray-500 px-3 truncate"
        />
        
        {/* Search Button */}
        <button 
          onClick={() => {
             handleSearchSubmit(searchQuery);
             setIsExpanded(false);
          }}
          className="bg-rose-500 p-2 rounded-full text-white hover:bg-rose-600 transition shadow-sm shrink-0 flex items-center justify-center"
        >
          <Search size={16} strokeWidth={3} />
        </button>
      </motion.div>

      {/* Dropdown UI Container */}
      <AnimatePresence>
        {isExpanded && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[450px] z-50">
            <SuggestionsDropdown onSelectAction={() => setIsExpanded(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopSearch;