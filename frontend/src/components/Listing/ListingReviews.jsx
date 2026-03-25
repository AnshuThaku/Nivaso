import { useState } from "react";
import axios from "axios";
import { FaStar, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

const ListingReviews = ({ listing, user, hasBooked, API_URL, id, fetchListing, showNotification, isListingOwner }) => {
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  // Edit Review State
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const currentUserId = user ? String(user._id || user.id) : null;

  // --- HANDLERS ---
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
               showNotification("Failed to delete review", "error");
          }
      }
  };

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
            <FaStar className="text-base" /> 4.8 · {listing.reviews?.length || 0} reviews
        </h2>
        
        {/* ADD REVIEW FORM */}
        {user && hasBooked && (
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

        {/* DISPLAY ALL REVIEWS */}
        <div className="grid grid-cols-1 gap-y-8">
            {listing.reviews && listing.reviews.map(review => {
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
                                    <button onClick={() => handleEditClick(review)} className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all" title="Edit Review">
                                        <FaEdit size={15} />
                                    </button>
                                )}
                                {(isReviewAuthor || isListingOwner) && (
                                    <button onClick={() => handleDeleteReview(review._id)} className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-full transition-all" title="Delete Review">
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
  );
};

export default ListingReviews;