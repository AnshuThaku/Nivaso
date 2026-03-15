import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";

const categories = [
  "Trending", "Rooms", "Iconic cities", "Mountains", "Castles", 
  "Amazing pools", "Camping", "Farms", "Arctic", "Boats", "Domes"
];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 🔥 Ye history manage karta hai
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [originalImageUrl, setOriginalImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    category: "Trending",
    image: null, 
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/listings/${id}/edit`, { withCredentials: true })
      .then((res) => {
        const listing = res.data;
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          country: listing.country,
          location: listing.location,
          category: listing.category || "Trending",
          image: null, 
        });
        
        if (listing.image && listing.image.url) {
            let url = listing.image.url;
            url = url.replace("/upload", "/upload/w_300"); 
            setOriginalImageUrl(url);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listing data:", err);
        showNotification("Failed to load listing data", "error");
        navigate(-1); // Error aane par bhi pichle page par bhej dega
      });
  }, [id, navigate, showNotification]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("country", formData.country);
    data.append("location", formData.location);
    data.append("category", formData.category);
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(`http://localhost:8080/listings/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true 
      });
      showNotification("Listing Updated Successfully!", "success");
      navigate(`/listings/${id}`); // Update hone ke baad specifically usi listing par le jayega
    } catch (error) {
      console.error("Update Error:", error);
      showNotification(error.response?.data?.message || "Failed to update listing", "error");
    }
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center h-[70vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 SMART BACK BUTTON: navigate(-1) use karke exact purane page par jayega */}
        <button 
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 transition-colors"
        >
            <FaArrowLeft /> Go Back
        </button>

        {/* Main Form Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            
            {/* Header Area */}
            <div className="bg-gray-900 px-8 py-6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold">Edit Your Place</h2>
                <p className="text-gray-400 text-sm mt-1">Make changes to your listing details below.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Listing Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                        className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all shadow-sm" 
                        placeholder="Catchy title for your place"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        rows="5" 
                        className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none shadow-sm"
                        placeholder="Tell guests what makes your place special..."
                    ></textarea>
                </div>

                {/* Image Section */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-4">Listing Image</label>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Current Image Preview */}
                        {originalImageUrl && (
                            <div className="w-full md:w-1/3">
                                <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Current Image</p>
                                <img 
                                    src={originalImageUrl} 
                                    alt="Original" 
                                    className="w-full h-32 object-cover rounded-lg shadow-sm border border-gray-200" 
                                />
                            </div>
                        )}
                        
                        {/* Upload New Image */}
                        <div className="w-full md:w-2/3">
                            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Upload New (Optional)</p>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition-colors text-center cursor-pointer group">
                                <input 
                                    type="file" 
                                    name="image" 
                                    onChange={handleChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                />
                                <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-800">
                                    <FaCloudUploadAlt className="text-3xl mb-2" />
                                    <span className="text-sm font-semibold">Click to browse or drag and drop</span>
                                    <span className="text-xs mt-1">PNG, JPG, JPEG up to 5MB</span>
                                </div>
                            </div>
                            {formData.image && (
                                <p className="text-sm text-green-600 font-semibold mt-2">
                                    ✓ New file selected: {formData.image.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price & Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Price (per night)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleChange} 
                                required 
                                className="w-full border border-gray-300 rounded-xl p-4 pl-8 text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all shadow-sm" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all shadow-sm bg-white cursor-pointer"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location & Country Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Location (City)</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            required 
                            className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all shadow-sm" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
                        <input 
                            type="text" 
                            name="country" 
                            value={formData.country} 
                            onChange={handleChange} 
                            required 
                            className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all shadow-sm" 
                        />
                    </div>
                </div>

                <hr className="border-gray-200 my-8" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {/* 🔥 SMART CANCEL BUTTON */}
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className="flex-1 bg-white border border-gray-900 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm order-2 sm:order-1"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="flex-[2] bg-rose-600 text-white font-bold py-4 rounded-xl hover:bg-rose-700 transition-all active:scale-[0.98] shadow-md order-1 sm:order-2"
                    >
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;