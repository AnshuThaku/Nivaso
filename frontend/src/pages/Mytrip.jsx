import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaSuitcase, FaMapMarkerAlt, FaCalendarCheck, 
  FaRegClock, FaChevronLeft, FaRegFileAlt, 
  FaTimesCircle, FaArrowRight 
} from "react-icons/fa";

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMyTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/my-bookings`, { 
        withCredentials: true 
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMyTrips(); 
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel? Refund policy will apply.")) {
      try {
        const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, { 
          withCredentials: true 
        });
        if (response.data.success) {
          setBookings(prev => prev.map(b => 
            b._id === bookingId ? { ...b, status: 'cancelled' } : b
          ));
        }
      } catch (error) {
        alert(error.response?.data?.message || "Cancellation failed");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validBookings = bookings.filter(b => b && b.listing);
  const upcomingTrips = validBookings.filter(b => 
    new Date(b.checkIn) >= today && b.status !== 'cancelled'
  );
  const pastOrCancelled = validBookings.filter(b => 
    new Date(b.checkIn) < today || b.status === 'cancelled'
  );

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-20 pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-all mb-4 font-medium"
          >
            <FaChevronLeft size={12} /> Home
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Trips</h1>
        </div>

        <div className="space-y-20">
          {/* Section 1: Upcoming */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight border-b border-gray-200 pb-4">
              Upcoming Reservations
            </h2>
            {upcomingTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
                <div className="bg-rose-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSuitcase className="text-rose-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips booked... yet!</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Time to dust off your bags and start planning your next great adventure.</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                  Start Exploring <FaArrowRight size={14}/>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingTrips.map(b => (
                  <BookingCardItem key={b._id} booking={b} onCancel={handleCancelBooking} />
                ))}
              </div>
            )}
          </section>

          {/* Section 2: History */}
          {pastOrCancelled.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight border-b border-gray-200 pb-4">
                Where you've been
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
                {pastOrCancelled.map(b => (
                  <BookingCardItem key={b._id} booking={b} isPast={true} onCancel={handleCancelBooking} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingCardItem = ({ booking, isPast, onCancel }) => {
  const navigate = useNavigate();
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

  const getStatus = () => {
    const now = new Date();
    now.setHours(0,0,0,0);
    if (booking.status === "cancelled") return { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-100" };
    if (now >= checkIn && now <= checkOut) return { label: "Staying Now", color: "bg-blue-50 text-blue-600 border-blue-100 font-bold" };
    if (now > checkOut) return { label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    return { label: "Confirmed", color: "bg-gray-50 text-gray-600 border-gray-200" };
  };

  const status = getStatus();

  // Receipt Logic: Opens in new tab, user remains on MyTrips
  const handleReceipt = (e) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Nivaso Receipt - ${booking._id}</title></head>
        <body style="font-family: sans-serif; padding: 50px; line-height: 1.6; color: #333;">
          <h1 style="color: #e11d48; margin-bottom: 0;">NIVASO.</h1>
          <p style="color: #666; margin-top: 5px;">Booking Confirmation Receipt</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <div style="margin-bottom: 20px;">
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Property:</strong> ${booking.listing.title}</p>
            <p><strong>Location:</strong> ${booking.listing.location}</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
            <p><strong>Check-in:</strong> ${checkIn.toLocaleDateString('en-US', formatOptions)}</p>
            <p><strong>Check-out:</strong> ${checkOut.toLocaleDateString('en-US', formatOptions)}</p>
            <p><strong>Total Amount Paid:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</p>
            <p><strong>Payment Status:</strong> Paid (Razorpay)</p>
          </div>
          <footer style="margin-top: 50px; font-size: 12px; color: #999;">
            This is a computer-generated receipt for your stay at Nivaso.
          </footer>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div 
      onClick={() => navigate(`/listings/${booking.listing._id}`)} 
      className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full group"
    >
      {/* Image Header */}
      <div className="h-52 relative overflow-hidden shrink-0">
        <img 
          src={booking.listing.images?.[0]?.url || booking.listing.image?.url} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={booking.listing.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] uppercase font-black border ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 truncate mb-1">{booking.listing.title}</h3>
        <p className="text-gray-500 text-sm mb-6 flex items-center gap-1">
          <FaMapMarkerAlt size={12} className="text-rose-500"/> {booking.listing.location}
        </p>

        {/* Date Row */}
        <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4 mb-6">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-in</p>
            <p className="text-sm font-bold text-gray-800">{checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-out</p>
            <p className="text-sm font-bold text-gray-800">{checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
            <p className="text-lg font-black text-gray-900">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="flex gap-2">
            {/* Receipt Button */}
            {booking.paymentStatus === "paid" && (
              <button 
                onClick={handleReceipt} 
                className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                title="Download Receipt"
              >
                <FaRegFileAlt size={18} />
              </button>
            )}
            
            {/* Cancel Button */}
            {!isPast && booking.status !== 'cancelled' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onCancel(booking._id); }} 
                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                title="Cancel Booking"
              >
                <FaTimesCircle size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;