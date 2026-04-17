import React, { useEffect, useRef } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchContext } from '..//../context/SearchContext';
import SuggestionsDropdown from '../Search/Suggestion';

const MobileSearchModal = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);
  const { 
    searchQuery, setSearchQuery, 
    fetchRecentSearches, handleSearchSubmit 
  } = useSearchContext();

  // Auto-focus input when modal opens & fetch history
  useEffect(() => {
    if (isOpen) {
      fetchRecentSearches();
      // Small timeout ensures the modal is mounted before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, fetchRecentSearches]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-50 z-[100] flex flex-col overflow-hidden"
        >
          {/* Top Bar with Input */}
          <div className="bg-white px-4 pt-6 pb-4 shadow-sm flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm transition-all">
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search stays in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(searchQuery);
                    onClose();
                  }
                }}
                className="w-full bg-transparent outline-none text-base font-medium text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Body for Suggestions & Recent */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
             <SuggestionsDropdown onSelectAction={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchModal;