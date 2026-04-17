import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance'; // Use our custom instance
import useDebounce from '../hooks/useDebounce';

const SearchContext = createContext();
export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // Shared States
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use our custom hook! (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ── 1. Fetch Recent Searches ──
  const fetchRecentSearches = useCallback(async () => {
    try {
      const res = await api.get('/history/recent-searches');
      if (res.data.success) setRecentSearches(res.data.recentSearches);
    } catch (error) {
      console.error("Failed to fetch recent searches", error);
    }
  }, []);

  // ── 2. Fetch Suggestions (Triggered by Debounce) ──
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await api.get(`/listings/suggestions?q=${debouncedSearchQuery}`);
        if (res.data.success) setSuggestions(res.data.suggestions);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]); // Only runs when debounced value changes

  // ── 3. Handle Submit (Track & Navigate) ──
  const handleSearchSubmit = async (query) => {
    if (!query.trim()) return;
    setIsDropdownOpen(false); // Close dropdown
    
    try {
      // Track history
      await api.post('/history/search', { searchQuery: query });
    } catch (error) {
      console.error("Failed to track search", error);
    }

    // Navigate to results
    navigate(`/listings?search=${encodeURIComponent(query)}`);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      suggestions,
      recentSearches,
      isDropdownOpen,
      setIsDropdownOpen,
      isLoading,
      fetchRecentSearches,
      handleSearchSubmit
    }}>
      {children}
    </SearchContext.Provider>
  );
};