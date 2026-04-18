import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSuitcase, FaMapMarkerAlt, FaCalendarCheck, FaRegClock, FaChevronLeft } from "react-icons/fa";

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        // 🚀 Backend se directly sirf bookings fetch kar rahe hain
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/my-bookings`, {
          withCredentials: true, 
        });
        
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Fetch trips error:", error);
        // Agar unauthorized hai, toh wapas login par bhej do
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyTrips();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // Safely filter bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time for accurate date comparison
  
  const validBookings = bookings.filter(b => b && b.listing);
  const upcomingTrips = validBookings.filter(b => new Date(b.checkIn) >= today);
  const pastTrips = validBookings.filter(b => new Date(b.checkIn) < today);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 Header with Back Button (Mobile) */}
        <div className="mb-10 flex flex-col gap-2">
          <button
            onClick={() => navigate(-1)}
            className="md:hidden flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900 transition-colors w-max"
          >
            <FaChevronLeft size={14} /> Back
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Trips</h1>
          <p className="text-gray-500 text-lg font-medium">Manage your upcoming stays and past adventures.</p>
        </div>

        <div className="space-y-16 animate-fade-in-up">
          
          {/* Upcoming Trips */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
              Upcoming Reservations
            </h2>
            
            {upcomingTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-rose-50 h-24 w-24 rounded-full flex items-center justify-center mb-6">
                  <FaSuitcase className="text-rose-500 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No trips booked... yet!</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Time to dust off your bags and start planning your next great adventure with Nivaso.</p>
                <Link to="/listings" className="bg-rose-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-rose-700 transition-colors shadow-md hover:shadow-lg active:scale-95">
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            )}
          </section>

          {/* Past Trips Section */}
          {pastTrips.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
                Where you've been
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
                {pastTrips.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} isPast={true} />
                ))}
              </div>
            </section>
          )}
          
        </div>
      </div>
    </div>
  );
};

// 💳 The "Premium Ticket" Booking Card (Same Logic as Profile)
const BookingCard = ({ booking, isPast }) => {
  const navigate = useNavigate(); 
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  
  const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

  // 🚀 Image extraction logic
  let displayImage = "https://images.unsplash.com/photo-1502672260266-1c1ea5250831?auto=format&fit=crop&w=800&q=80";
  if (booking.listing?.images && booking.listing.images.length > 0) {
    displayImage = booking.listing.images[0].url;
  } else if (booking.listing?.image?.url) {
    displayImage = booking.listing.image.url;
  }
  
  return (
    <div 
      onClick={() => navigate(`/listings/${booking.listing?._id}`)} 
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden group"
    >
      <div className="h-52 overflow-hidden relative bg-gray-100 shrink-0">
        <img 
          src={displayImage} 
          alt={booking.listing?.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-md backdrop-blur-md uppercase ${
            booking.paymentStatus === "paid" ? "bg-white/95 text-emerald-600" : "bg-white/95 text-amber-600"
          }`}>
            {booking.paymentStatus === "paid" ? "Confirmed" : "Pending"}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h3 className="font-bold text-lg mb-1 truncate drop-shadow-md">{booking.listing?.title}</h3>
          <p className="text-white/90 text-sm flex items-center gap-1.5 drop-shadow-md font-medium">
            <FaMapMarkerAlt size={12} className="text-rose-400" /> {booking.listing?.location}, {booking.listing?.country}
          </p>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Dates Block */}
        <div className="flex items-center justify-between bg-slate-50 border border-gray-100 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-900 border border-gray-100 shrink-0">
               <FaCalendarCheck size={16} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Check-in</p>
               <p className="font-bold text-gray-900 text-sm">{checkIn.toLocaleDateString('en-US', formatOptions)}</p>
             </div>
          </div>
          
          <div className="w-px h-8 bg-gray-200"></div>
          
          <div className="flex items-start gap-3">
             <div className="text-right">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Check-out</p>
               <p className="font-bold text-gray-900 text-sm">{checkOut.toLocaleDateString('en-US', formatOptions)}</p>
             </div>
             <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 border border-gray-100 shrink-0">
               <FaRegClock size={16} />
             </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Paid</p>
              <p className="font-black text-lg text-gray-900">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="shrink-0">
              {isPast ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl transition-colors group-hover:bg-rose-100">
                  Write Review
                </span>
              ) : (
                <span className="text-xs font-bold text-gray-800 bg-gray-100 px-4 py-2.5 rounded-xl transition-colors group-hover:bg-gray-200">
                  View Stay
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;