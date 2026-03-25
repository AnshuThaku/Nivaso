import { useState, useEffect, useRef } from "react";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const DesktopSearch = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const guestDropdownRef = useRef(null);

  // Click outside to close guest dropdown
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
    <div className="hidden md:flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer relative">
      <input
        type="text"
        placeholder="Search destinations"
        className="text-sm font-semibold px-4 border-r border-gray-300 outline-none w-40 bg-transparent placeholder-gray-600"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <div className="text-sm font-semibold px-4 border-r border-gray-300 whitespace-nowrap cursor-pointer" onClick={() => alert("Coming soon!")}>
        Any week
      </div>
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
          <motion.div 
            ref={guestDropdownRef} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="absolute top-16 right-0 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-[400px] z-50"
          >
            {['adults', 'children', 'infants', 'pets'].map((type) => (
              <div key={type} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-semibold text-base capitalize">{type}</h3>
                  <p className="text-sm text-gray-500">
                    {type === 'adults' ? 'Ages 13+' : type === 'children' ? 'Ages 2-12' : type === 'infants' ? 'Under 2' : 'Service animal?'}
                  </p>
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
  );
};

export default DesktopSearch;