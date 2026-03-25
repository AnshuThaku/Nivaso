import { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ listing, user, showNotification, API_URL }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
  };

  const handleReserveClick = async () => {
    if (!user) return showNotification("Please login to book this place", "error");
    if (!booking.checkIn || !booking.checkOut) return showNotification("Please select check-in and check-out dates", "error");

    setIsProcessing(true);

    try {
        const res = await loadRazorpayScript();
        if (!res) {
            setIsProcessing(false);
            return showNotification("Failed to load Razorpay SDK. Check your connection.", "error");
        }

        const orderResponse = await axios.post(`${API_URL}/listings/${listing._id}/bookings`, booking, { withCredentials: true });
        const { order, bookingId } = orderResponse.data;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
            amount: order.amount,
            currency: order.currency,
            name: "Nivaso Stays",
            description: `Booking for ${listing.title}`,
            order_id: order.id,
            handler: async function (response) {
                try {
                    const verifyResponse = await axios.post(`${API_URL}/listings/${listing._id}/bookings/confirm-payment`, {
                        bookingId: bookingId,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }, { withCredentials: true });

                    if (verifyResponse.data.success) {
                        showNotification("Payment Successful! 🎉", "success");
                        navigate("/listings"); 
                    }
                } catch (error) {
                    showNotification("Payment Verification Failed!", "error");
                }
            },
            prefill: {
                name: user?.username || "Guest User",
                email: user?.email || "guest@example.com",
            },
            theme: { color: "#e11d48" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
            showNotification(response.error.description, "error");
        });
        paymentObject.open();

    } catch (error) {
        showNotification(error.response?.data?.message || "Booking creation failed", "error");
    } finally {
        setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * listing.price : 0;
  };

  const total = calculateTotal();
  const serviceFee = Math.round(total * 0.14);
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + serviceFee + taxes;

  return (
<div className="sticky top-28 self-start z-10 bg-white border border-gray-200 rounded-xl p-6 shadow-xl ring-1 ring-gray-200">  
          <div className="flex justify-between items-baseline mb-6">
            <div>
                <span className="text-2xl font-semibold text-gray-900">₹{listing.price.toLocaleString("en-IN")}</span>
                <span className="text-gray-600 font-light"> night</span>
            </div>
            <div className="flex items-center gap-1">
                <FaStar size={12} className="text-gray-900" />
                <span className="font-semibold text-sm">4.8</span>
                <span className="text-gray-500 text-sm"> · {listing.reviews?.length || 0} reviews</span>
            </div>
        </div>

        <div className="border border-gray-400 rounded-lg mb-4 overflow-hidden">
            <div className="grid grid-cols-2 border-b border-gray-400">
                <div className="p-2 border-r border-gray-400 relative">
                    <label className="block text-[10px] font-bold uppercase text-gray-800">Check-in</label>
                    <input 
                        type="date" 
                        name="checkIn"
                        value={booking.checkIn}
                        onChange={handleBookingChange}
                        className="w-full text-sm outline-none bg-transparent text-gray-600 cursor-pointer p-0 m-0"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="p-2 relative">
                    <label className="block text-[10px] font-bold uppercase text-gray-800">Checkout</label>
                    <input 
                        type="date" 
                        name="checkOut"
                        value={booking.checkOut}
                        onChange={handleBookingChange}
                        className="w-full text-sm outline-none bg-transparent text-gray-600 cursor-pointer p-0 m-0"
                        min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>
            <div className="p-2">
                <label className="block text-[10px] font-bold uppercase text-gray-800">Guests</label>
                <select 
                    name="guests"
                    value={booking.guests}
                    onChange={handleBookingChange}
                    className="w-full text-sm outline-none bg-transparent text-gray-600 cursor-pointer"
                >
                    {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                </select> {/* 🔥 YAHAN FIX KIYA HAI: </select> */}
            </div>
        </div>

        <button 
            className={`w-full text-white font-semibold py-3 rounded-lg transition mb-4 text-base shadow-sm ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 active:scale-[0.98]'}`}
            onClick={handleReserveClick}
            disabled={isProcessing}
        >
            {isProcessing ? "Processing..." : "Reserve"}
        </button>
        
        <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>
        
        {total > 0 && (
            <>
                <div className="space-y-3 text-gray-600 text-base">
                    <div className="flex justify-between">
                        <span className="underline decoration-gray-300">₹{listing.price.toLocaleString("en-IN")} x {total/listing.price} nights</span>
                        <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="underline decoration-gray-300">Nivaso service fee</span>
                        <span>₹{serviceFee.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="underline decoration-gray-300">Taxes</span>
                        <span>₹{taxes.toLocaleString("en-IN")}</span>
                    </div>
                </div>
                <hr className="my-6 border-gray-200" />
                <div className="flex justify-between font-semibold text-lg text-gray-900">
                    <span>Total before taxes</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
            </>
        )}
    </div>
  );
};

export default BookingCard;