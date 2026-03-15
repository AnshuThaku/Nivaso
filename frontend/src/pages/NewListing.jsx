import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa"; // 🔥 FaArrowLeft import kiya

const categories = [
  "Trending",
  "Rooms",
  "Mountains",
  "Castles",
  "Farms",
  "Domes",
  "Boats",
  "Iconic cities",
  "Camping",
  "Amazing pools",
  "Arctic",
];

const NewListing = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
        category: "Trending"
    });
    const [image, setImage] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image) {
            showNotification("Please upload an image", "error");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("location", formData.location);
        data.append("country", formData.country);
        data.append("category", formData.category);
        data.append("image", image);

        try {
            await axios.post(`${API_URL}/listings`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true // 🔥 YEH BOHOT ZAROORI THA (Owner save karne ke liye)
            });
            showNotification("Listing created successfully!", "success");
            navigate("/listings");
        } catch (error) {
             console.error(error);
             const errMsg = error.response?.data?.error || error.response?.data?.message || "Failed to create listing";
             showNotification(errMsg, "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                
                {/* 🔥 SMART BACK BUTTON (Top) */}
                <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <FaArrowLeft /> Go Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-6 border-b border-gray-100 bg-gray-900 text-white">
                        <h1 className="text-xl sm:text-2xl font-bold">Create a New Listing</h1>
                        <p className="mt-1 text-xs sm:text-sm text-gray-400">Share your space with guests from all over the world.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="Add a catchy title"
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4 border transition-colors outline-none"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    placeholder="Describe your place"
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4 border transition-colors resize-none outline-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Image</label>
                                <div 
                                    className="mt-1 flex justify-center px-4 sm:px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group relative bg-gray-50/50"
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    <div className="space-y-2 text-center">
                                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        <div className="flex flex-col sm:flex-row items-center text-sm text-gray-600 justify-center gap-1">
                                            <label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-semibold text-gray-900 underline hover:text-gray-700 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input 
                                                    id="image-upload" 
                                                    name="image" 
                                                    type="file" 
                                                    className="sr-only" 
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                            <p className="text-gray-500">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                        {image ? (
                                            <p className="text-sm font-semibold text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full text-center break-all border border-green-200">
                                                ✓ {image.name}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-400 mt-2">No file selected yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Price (per night)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-semibold sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        placeholder="0.00"
                                        className="block w-full pl-9 rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4 border transition-colors outline-none"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4 border transition-colors bg-white cursor-pointer outline-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Location (City)</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="e.g. Jaipur, Rajasthan"
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4 border transition-colors outline-none"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    placeholder="e.g. India"
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4 border transition-colors outline-none"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100 mt-8 mb-6" />

                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            {/* 🔥 SMART CANCEL BUTTON (Bottom) */}
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full sm:w-auto inline-flex justify-center py-3 px-8 border border-gray-900 shadow-sm text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-50 focus:outline-none transition-colors order-2 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-md text-sm font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 focus:outline-none transition-all active:scale-[0.98] order-1 sm:order-2"
                            >
                                Create Listing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewListing;