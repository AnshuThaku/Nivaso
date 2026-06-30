import { Pencil, Trash2, Eye } from "lucide-react";

const MyListings = () => {
  const listings = [
    { id: 1, title: "Sea View Villa", location: "Goa", price: "₹8,000/night", status: "Active" },
    { id: 2, title: "Mountain Cabin", location: "Manali", price: "₹5,500/night", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition">
          + Add New Listing
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Listing Title</th>
              <th className="p-4">Location</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-gray-600">{item.location}</td>
                <td className="p-4 text-gray-600">{item.price}</td>
                <td className="p-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{item.status}</span></td>
                <td className="p-4 flex justify-center gap-3 text-gray-500">
                  <button className="hover:text-rose-600"><Eye size={18} /></button>
                  <button className="hover:text-blue-600"><Pencil size={18} /></button>
                  <button className="hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyListings;