import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
// 🔥 FaArrowLeft yahan add kar diya hai
import { FaStar, FaShare, FaHeart, FaUserCircle, FaEdit, FaTrash, FaTimes, FaCheck, FaArrowLeft } from "react-icons/fa";

const ShowListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const fetchListing = useCallback(() => {
      axios.get(`${API_URL}/listings/${id}`)
      .then((response) => {
        setListing(response.data);
      })
      .catch((error) => {
        console.error("Error fetching listing:", error);
      });
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  // --- REVIEW HANDLERS ---
  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post(`${API_URL}/listings/${id}/reviews`, {
              review: { rating, comment }
          }, { withCredentials: true });
          showNotification("Review added successfully", "success");
          setComment("");
          setRating(5);
          fetchListing(); 
      } catch (error) {
          console.error("Failed to add review:", error.response?.data || error.message);
          showNotification(error.response?.data?.error || error.response?.data?.message || "Failed to add review", "error");
      }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await axios.put(`${API_URL}/listings/${id}/reviews/${reviewId}`, {
        review: { rating: editRating, comment: editComment }
      }, { withCredentials: true });
      showNotification("Review updated successfully", "success");
      setEditingReviewId(null);
      fetchListing();
    } catch (error) {
       console.error("Failed to update review:", error);
       showNotification("Failed to update review", "error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
      if (window.confirm("Are you sure you want to delete this review?")) {
          try {
               await axios.delete(`${API_URL}/listings/${id}/reviews/${reviewId}`, { withCredentials: true });
               showNotification("Review deleted successfully", "success");
               fetchListing();
          } catch (error) {
               console.error("Delete review error:", error);
               showNotification("Failed to delete review", "error");
          }
      }
  };

  const handleDeleteListing = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`${API_URL}/listings/${id}`, { withCredentials: true });
        showNotification("Listing deleted successfully", "success");
        navigate("/listings");
      } catch (error) {
        console.error("Failed to delete listing:", error);
        showNotification("Failed to delete listing", "error");
      }
    }
  };

  // --- BOOKING STATE ---
  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * listing.price : 0;
  };

  if (!listing) return <div className="p-20 text-center flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div></div>;

  const total = calculateTotal();
  const serviceFee = Math.round(total * 0.14);
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + serviceFee + taxes;

  const currentUserId = user ? String(user._id || user.id) : null;
  const listingOwnerId = listing.owner ? String(listing.owner._id || listing.owner) : null;
  const isListingOwner = Boolean(currentUserId && listingOwnerId && currentUserId === listingOwnerId);

  return (
    <div className="bg-white min-h-screen pb-20 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 SMART BACK BUTTON ADDED HERE */}
        <button 
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 transition-colors"
        >
            <FaArrowLeft /> Go Back
        </button>

        {/* Title Header */}
        <div className="mb-6">
             <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">{listing.title}</h1>
             <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-800 gap-2">
                 <div className="flex items-center gap-2 flex-wrap">
                     <span className="font-semibold flex items-center gap-1"><FaStar className="text-sm" /> 4.8</span>
                     <span className="hidden md:inline">·</span>
                     <span className="font-semibold underline cursor-pointer">{listing.reviews?.length || 0} reviews</span>
                     <span className="hidden md:inline">·</span>
                     <span className="font-semibold underline cursor-pointer flex items-center gap-1">{listing.location}, {listing.country}</span>
                 </div>
                 <div className="flex gap-4">
                     <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md font-semibold underline transition-colors"><FaShare /> Share</button>
                     <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md font-semibold underline transition-colors"><FaHeart /> Save</button>
                 </div>
             </div>
        </div>

        {/* Image Grid */}
        <div className="rounded-xl overflow-hidden h-[300px] md:h-[450px] mb-8 relative w-full">
           <img
              src={listing.image?.url}
              alt={listing.title}
              className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Column: Details */}
            <div className="md:col-span-2">
                 <div className="border-b border-gray-200 pb-6 mb-6">
                     <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Entire home hosted by {listing.owner?.username}</h2>
                            <p className="text-gray-600 mt-1">
                                2 guests · 1 bedroom · 1 bed · 1 bath
                            </p>
                        </div>
                        <FaUserCircle className="text-5xl text-gray-400" />
                     </div>
                 </div>

                 <div className="border-b border-gray-200 pb-8 mb-8">
                     <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                         {listing.description}
                     </p>
                 </div>

                 {/* 🔥 SIRF ASLI OWNER KO DIKHENGA YE SECTION */}
                 {isListingOwner && (
                    <div className="flex gap-4 mb-8 pb-8 border-b border-gray-200">
                        <Link to={`/listings/${listing._id}/edit`} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black transition-colors">
                            Edit Listing
                        </Link>
                         <button onClick={handleDeleteListing} className="bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition-colors">
                            Delete Listing
                         </button>
                    </div>
                 )}

                 {/* Reviews Section */}
                 <div className="mt-12 pt-10 border-t border-gray-200">
                     <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
                        <FaStar className="text-base" /> 4.8 · {listing.reviews?.length || 0} reviews
                     </h2>
                     
                     {/* Add Review Form */}
                     {user && (
                         <form onSubmit={handleReviewSubmit} className="mb-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                             <h3 className="text-lg font-semibold mb-4 text-gray-900">Leave a review</h3>
                             <div className="mb-4">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                 <div className="flex gap-1">
                                     {[1,2,3,4,5].map(star => (
                                         <button 
                                            key={star} 
                                            type="button" 
                                            onClick={() => setRating(star)}
                                            className={`text-3xl transition-colors ${rating >= star ? 'text-gray-900' : 'text-gray-200 hover:text-gray-400'}`}
                                         >
                                             ★
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             <div className="mb-4">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                 <textarea 
                                    className="w-full border border-gray-300 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none" 
                                    rows={4}
                                    placeholder="Share your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                 ></textarea>
                             </div>
                             <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors">
                                 Submit Review
                             </button>
                         </form>
                     )}

                     {/* Display Reviews */}
                     <div className="grid grid-cols-1 gap-y-8">
                         {listing.reviews && listing.reviews.map(review => {
                             // 🔥 SAFE STRING CHECK FOR REVIEW AUTHOR
                             const reviewAuthorId = review.author ? String(review.author._id || review.author) : null;
                             const isReviewAuthor = Boolean(currentUserId && reviewAuthorId && currentUserId === reviewAuthorId);
                             
                             return (
                             <div key={review._id} className="flex flex-col border-b border-gray-100 pb-6 last:border-0 relative">
                                 
                                 {/* Edit Mode */}
                                 {editingReviewId === review._id ? (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                      <div className="mb-2">
                                          <div className="flex gap-1 mb-2">
                                              {[1,2,3,4,5].map(star => (
                                                  <button 
                                                      key={star} 
                                                      type="button" 
                                                      onClick={() => setEditRating(star)}
                                                      className={`text-lg transition-colors ${editRating >= star ? 'text-gray-900' : 'text-gray-300'}`}
                                                  >
                                                      ★
                                                  </button>
                                              ))}
                                          </div>
                                          <textarea 
                                              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                                              rows={3}
                                              value={editComment}
                                              onChange={(e) => setEditComment(e.target.value)}
                                          />
                                      </div>
                                      <div className="flex gap-2 justify-end mt-2">
                                          <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm bg-gray-200 px-3 py-1 rounded-md transition-colors"><FaTimes /> Cancel</button>
                                          <button onClick={() => handleUpdateReview(review._id)} className="bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-black font-semibold flex items-center gap-1 text-sm transition-colors"><FaCheck /> Save</button>
                                      </div>
                                    </div>
                                 ) : (
                                   <>
                                      {/* View Mode */}
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-3">
                                              <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                  {review.author?.username?.[0]?.toUpperCase() || "A"}
                                              </div>
                                              <div>
                                                  <h4 className="font-semibold text-gray-900 text-sm">{review.author?.username || "Anonymous"}</h4>
                                                  <div className="text-xs text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</div>
                                              </div>
                                          </div>
                                          
                                          {/* Review Edit/Delete Icons */}
                                          <div className="flex items-center gap-1">
                                              {isReviewAuthor && (
                                                  <button 
                                                      onClick={() => handleEditClick(review)} 
                                                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all" 
                                                      title="Edit Review"
                                                  >
                                                      <FaEdit size={15} />
                                                  </button>
                                              )}
                                              
                                              {(isReviewAuthor || isListingOwner) && (
                                                  <button 
                                                      onClick={() => handleDeleteReview(review._id)} 
                                                      className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-full transition-all" 
                                                      title="Delete Review"
                                                  >
                                                      <FaTrash size={14} />
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                      
                                      <div className="flex text-black text-xs mb-3 items-center gap-1">
                                          <div className="flex">
                                              {"★".repeat(review.rating)}
                                              <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                                          </div>
                                      </div>

                                      <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line break-words">
                                          {review.comment}
                                      </p>
                                   </>
                                 )}
                             </div>
                         )})}
                     </div>
                 </div>
            </div>

            {/* Right Column: Booking Card */}
            <div className="md:col-span-1 relative">
                <div className="sticky top-28 bg-white border border-gray-200 rounded-xl p-6 shadow-xl ring-1 ring-gray-200">
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
                            </select>
                        </div>
                    </div>

                    <button 
                        className="w-full bg-rose-600 text-white font-semibold py-3 rounded-lg hover:bg-rose-700 transition active:scale-[0.98] mb-4 text-base shadow-sm"
                        onClick={() => showNotification("Reservation feature coming soon!", "info")}
                    >
                        Reserve
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
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShowListing;