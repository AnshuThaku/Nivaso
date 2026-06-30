import { useState } from "react";

const AddListing = () => {
  const [formData, setFormData] = useState({ title: "", price: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Listing...", formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Listing Title</label>
          <input 
            type="text" 
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="e.g. Luxury Beach House"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price per Night</label>
            <input type="number" className="w-full p-3 border border-gray-200 rounded-xl outline-none" placeholder="₹" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select className="w-full p-3 border border-gray-200 rounded-xl outline-none">
              <option>Apartment</option>
              <option>Villa</option>
              <option>Cabin</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea 
            className="w-full p-3 border border-gray-200 rounded-xl outline-none h-32"
            placeholder="Describe your property..."
          />
        </div>

        <button className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition">
          Publish Listing
        </button>
      </form>
    </div>
  );
};

export default AddListing;