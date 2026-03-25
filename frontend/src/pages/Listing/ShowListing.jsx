import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { FaStar, FaUserCircle, FaMedal, FaWind, FaKey, FaHome } from "react-icons/fa";

// 🧩 Components Import
import ListingHeader from "../../components/Listing/ListingHeader";
import ImageGallery from "../../components/Listing/ImageGallery";
import BookingCard from "../../components/Listing/BookingCard";
import ListingMap from "../../components/Listing/ListingMap";
import ListingReviews from "../../components/Listing/ListingReviews"; 

const ShowListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchListing = useCallback(() => {
      axios.get(`${API_URL}/listings/${id}`)
      .then((response) => setListing(response.data))
      .catch((error) => console.error("Error fetching listing:", error));
  }, [id, API_URL]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

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

  // Loading State
  if (!listing) return <div className="p-20 text-center flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div></div>;

  // Permissions & Fallbacks
  const currentUserId = user ? String(user._id || user.id) : null;
  const listingOwnerId = listing.owner ? String(listing.owner._id || listing.owner) : null;
  const isListingOwner = Boolean(currentUserId && listingOwnerId && currentUserId === listingOwnerId);
  const hasBooked = false; 

  const imagesArray = listing.images && listing.images.length > 0 
      ? listing.images 
      : (listing.image ? [listing.image] : [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60" }]);

  // 🔥 NAYA LOGIC: Asli Reviews aur Rating Calculate karna
  const totalReviews = listing.reviews?.length || 0;
  const averageRating = totalReviews > 0 
      ? (listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(2) 
      : "New";

  return (
    <div className="bg-white min-h-screen pb-20 pt-2 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8">

        {/* 1️⃣ Header */}
        <ListingHeader 
            title={listing.title} 
            location={listing.location} 
            country={listing.country} 
            reviewsCount={totalReviews} 
        />

        {/* 2️⃣ Image Gallery */}
        <ImageGallery imagesArray={imagesArray} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left Column: Details, Badge, Features & Reviews */}
            <div className="md:col-span-2 pr-0 md:pr-10">
                 
                 {/* Title & Room Details */}
                 <div className="pb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Entire property in {listing.location}, {listing.country}
                    </h2>
                    {/* Database ki fields agar nahi hongi toh 1 default dikhayega */}
                    <p className="text-gray-900 mt-1 text-base">
                        {listing.guests || 1} guests · {listing.bedrooms || 1} bedrooms · {listing.beds || 1} beds · {listing.bathrooms || 1} bathrooms
                    </p>
                 </div>

                 {/* 🔥 Guest Favourite Badge (Ab Asli Data ke sath) */}
                 <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm cursor-pointer hover:shadow-md transition">
                    <div className="flex items-center gap-4 max-w-[60%]">
                        <FaMedal className="text-4xl text-gray-900" />
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg leading-5">
                                {averageRating >= 4.5 ? "Guest" : "Loved"}<br/>
                                {averageRating >= 4.5 ? "favourite" : "home"}
                            </h3>
                        </div>
                        <div className="hidden sm:block text-gray-600 text-sm font-medium border-l border-gray-300 pl-4 ml-2">
                            One of the most loved homes on<br/>Nivaso, according to guests
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{averageRating}</div>
                            <div className="flex text-black text-[10px] mt-0.5 justify-center">
                                {/* Rating ke hisaab se stars dikhana */}
                                {"★".repeat(Math.round(averageRating === "New" ? 0 : averageRating))}
                            </div>
                        </div>
                        <div className="text-center border-l border-gray-300 pl-6">
                            <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
                            <div className="text-xs font-semibold text-gray-900 underline mt-0.5">Reviews</div>
                        </div>
                    </div>
                 </div>

                 {/* 🔥 Host Info (Asli Owner ka naam) */}
                 <div className="flex items-center gap-4 py-6 border-t border-gray-200">
                     <FaUserCircle className="text-5xl text-gray-400" />
                     <div>
                         <h3 className="text-lg font-semibold text-gray-900">Hosted by {listing.owner?.username || "Unknown Host"}</h3>
                         <p className="text-gray-500 text-sm">Superhost</p>
                     </div>
                 </div>

                 {/* Features List */}
                 <div className="py-6 border-t border-gray-200 space-y-6">
                     <div className="flex gap-4">
                         <FaWind className="text-2xl text-gray-800 mt-1" />
                         <div>
                             <h4 className="font-semibold text-gray-900 text-base">Designed for staying cool</h4>
                             <p className="text-gray-500 text-sm">Beat the heat with the A/C and ceiling fan.</p>
                         </div>
                     </div>
                     <div className="flex gap-4">
                         <FaKey className="text-2xl text-gray-800 mt-1" />
                         <div>
                             <h4 className="font-semibold text-gray-900 text-base">Self check-in</h4>
                             <p className="text-gray-500 text-sm">Check yourself in with the lockbox.</p>
                         </div>
                     </div>
                     <div className="flex gap-4">
                         <FaHome className="text-2xl text-gray-800 mt-1" />
                         <div>
                             <h4 className="font-semibold text-gray-900 text-base">Extra spacious</h4>
                             <p className="text-gray-500 text-sm">Guests love this home's spaciousness for a comfortable stay.</p>
                         </div>
                     </div>
                 </div>

                 {/* 🔥 Asli Description */}
                 <div className="py-8 border-t border-gray-200">
                     <h3 className="text-xl font-semibold mb-4 text-gray-900">The space</h3>
                     <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                         {listing.description}
                     </p>
                 </div>

                 {/* Owner Actions (Edit/Delete) */}
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

                 {/* 3️⃣ Reviews Component */}
                 <ListingReviews 
                     listing={listing}
                     user={user}
                     hasBooked={hasBooked}
                     API_URL={API_URL}
                     id={id}
                     fetchListing={fetchListing}
                     showNotification={showNotification}
                     isListingOwner={isListingOwner}
                 />
            </div>

            {/* Right Column: 4️⃣ Booking Card */}
            <div className="md:col-span-1 relative">
                <BookingCard 
                   listing={listing}
                   user={user}
                   API_URL={API_URL}
                   showNotification={showNotification}
                />
            </div>
        </div>
        
        {/* 5️⃣ Map */}
        <ListingMap location={`${listing.location}, ${listing.country}`} />
      </div>
    </div>
  );
};

export default ShowListing;