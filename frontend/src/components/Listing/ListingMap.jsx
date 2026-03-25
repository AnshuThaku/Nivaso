import React from "react";

const ListingMap = ({ location }) => {
  // 🔥 FIX 1: '$' lagaya hai encodeURIComponent se pehle
  // 🔥 FIX 2: Standard Google Maps embed URL use kiya hai
  const mapURL = `https://maps.google.com/maps?q=${encodeURIComponent(
    location
  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="mt-10 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        📍 Where you'll be
      </h2>
      <p className="text-gray-600 mb-6">{location}</p>
      
      <div className="w-full rounded-xl overflow-hidden shadow-md">
        <iframe
          title="Listing Location Map"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapURL}
        ></iframe>
      </div>
    </div>
  );
};

export default ListingMap;