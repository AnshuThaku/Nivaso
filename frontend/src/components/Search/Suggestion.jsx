import React from 'react';
import { Clock, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchContext } from '../../context/SearchContext';

const SuggestionsDropdown = ({ onSelectAction }) => {
  const { 
    searchQuery, setSearchQuery, 
    suggestions, recentSearches, 
    isLoading, handleSearchSubmit 
  } = useSearchContext();

  const handleSelect = (text) => {
    setSearchQuery(text);
    handleSearchSubmit(text);
    if(onSelectAction) onSelectAction(); // Close dropdown/modal
  };

  // Framer motion animation variants
  const dropVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <motion.div variants={dropVariants} initial="hidden" animate="visible" className="w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50 text-center">
        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Searching...</p>
      </motion.div>
    );
  }

  // 2. Empty Input -> Show Recent Searches
  if (!searchQuery.trim()) {
    if (recentSearches.length === 0) return null;
    return (
      <motion.div variants={dropVariants} initial="hidden" animate="visible" className="w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50 max-h-[350px] overflow-y-auto">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-6">Recent Searches</h4>
        <ul>
          {recentSearches.map((item) => (
            <li key={item._id} onClick={() => handleSelect(item.searchQuery)} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer transition">
              <div className="bg-gray-100 p-2.5 rounded-full text-gray-600"><Clock size={16} /></div>
              <span className="text-sm font-medium text-gray-700 capitalize">{item.searchQuery}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  // 3. No Suggestions Found
  if (suggestions.length === 0) {
    return (
      <motion.div variants={dropVariants} initial="hidden" animate="visible" className="w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50 text-center">
        <Search className="mx-auto text-gray-300 mb-2" size={24} />
        <p className="text-sm text-gray-500">No stays found for "{searchQuery}"</p>
      </motion.div>
    );
  }

  // 4. Show Suggestions
  return (
    <motion.div variants={dropVariants} initial="hidden" animate="visible" className="w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden max-h-[400px] overflow-y-auto">
      <ul>
        {suggestions.map((item) => (
          <li key={item._id} onClick={() => handleSelect(item.location || item.title)} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer transition">
            <div className="bg-gray-100 p-2.5 rounded-xl text-gray-600 shrink-0"><MapPin size={20} /></div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-gray-900 truncate">{item.title || item.location}</p>
              <p className="text-xs text-gray-500 truncate">{item.category} • {item.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SuggestionsDropdown;