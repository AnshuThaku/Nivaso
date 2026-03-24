// 100 Unique Indian Locations Data
const rawListings = [
  // 🏕️ TRENDING (10)
  { title: "Sunset Point Villa", location: "Goa", category: "Trending", price: 6500 },
  { title: "Upper Lake View Homestay", location: "Bhopal, Madhya Pradesh", category: "Trending", price: 3500 },
  { title: "Marine Drive Penthouse", location: "Mumbai, Maharashtra", category: "Trending", price: 12000 },
  { title: "Ganga Ghat Retreat", location: "Varanasi, Uttar Pradesh", category: "Trending", price: 2500 },
  { title: "French Quarter Studio", location: "Pondicherry", category: "Trending", price: 4000 },
  { title: "Varkala Cliff House", location: "Varkala, Kerala", category: "Trending", price: 5500 },
  { title: "Hauz Khas Heritage", location: "New Delhi, Delhi", category: "Trending", price: 4500 },
  { title: "City Centre Loft", location: "Indore, Madhya Pradesh", category: "Trending", price: 3000 },
  { title: "Mahabodhi Zen Stay", location: "Bodh Gaya, Bihar", category: "Trending", price: 2000 },
  { title: "White Town Colonial Stay", location: "Pondicherry", category: "Trending", price: 4200 },

  // 🛏️ ROOMS (9)
  { title: "Cozy Room in Koregaon Park", location: "Pune, Maharashtra", category: "Rooms", price: 1800 },
  { title: "IT Hub Budget Stay", location: "Bangalore, Karnataka", category: "Rooms", price: 1500 },
  { title: "Cyber City Executive Room", location: "Gurgaon, Haryana", category: "Rooms", price: 2500 },
  { title: "Salt Lake Family Room", location: "Kolkata, West Bengal", category: "Rooms", price: 1700 },
  { title: "Sector 62 Corporate Stay", location: "Noida, Uttar Pradesh", category: "Rooms", price: 2200 },
  { title: "Banjara Hills Guest Room", location: "Hyderabad, Telangana", category: "Rooms", price: 2000 },
  { title: "Anna Nagar Private Room", location: "Chennai, Tamil Nadu", category: "Rooms", price: 1600 },
  { title: "Navrangpura Smart Room", location: "Ahmedabad, Gujarat", category: "Rooms", price: 1900 },
  { title: "Patliputra Cozy Room", location: "Patna, Bihar", category: "Rooms", price: 1200 },

  // 🏙️ ICONIC CITIES (9)
  { title: "Colaba Causeway Apartment", location: "Mumbai, Maharashtra", category: "Iconic cities", price: 8000 },
  { title: "Connaught Place Suite", location: "New Delhi, Delhi", category: "Iconic cities", price: 7500 },
  { title: "MG Road Luxury Flat", location: "Bangalore, Karnataka", category: "Iconic cities", price: 6000 },
  { title: "Park Street Vintage Home", location: "Kolkata, West Bengal", category: "Iconic cities", price: 5000 },
  { title: "Jubilee Hills Mansion", location: "Hyderabad, Telangana", category: "Iconic cities", price: 9000 },
  { title: "Pink City View Apartment", location: "Jaipur, Rajasthan", category: "Iconic cities", price: 4000 },
  { title: "Taj View Homestay", location: "Agra, Uttar Pradesh", category: "Iconic cities", price: 3500 },
  { title: "Palasia Premium Stay", location: "Indore, Madhya Pradesh", category: "Iconic cities", price: 3800 },
  { title: "Lake City Elite House", location: "Udaipur, Rajasthan", category: "Iconic cities", price: 5500 },

  // ⛰️ MOUNTAINS (9)
  { title: "Himalayan View Cottage", location: "Manali, Himachal Pradesh", category: "Mountains", price: 4000 },
  { title: "Mall Road Woodhouse", location: "Shimla, Himachal Pradesh", category: "Mountains", price: 4500 },
  { title: "Tea Estate Bungalow", location: "Darjeeling, West Bengal", category: "Mountains", price: 5000 },
  { title: "Nilgiri Hill Retreat", location: "Ooty, Tamil Nadu", category: "Mountains", price: 3800 },
  { title: "Naini Lake Cabin", location: "Nainital, Uttarakhand", category: "Mountains", price: 4200 },
  { title: "Kanchenjunga Viewpoint", location: "Pelling, Sikkim", category: "Mountains", price: 3500 },
  { title: "Meghalaya Cloud Stay", location: "Shillong, Meghalaya", category: "Mountains", price: 3200 },
  { title: "Spiti Valley Mud House", location: "Kaza, Himachal Pradesh", category: "Mountains", price: 2500 },
  { title: "Munnar Misty Villa", location: "Munnar, Kerala", category: "Mountains", price: 4800 },

  // 🏰 CASTLES & HERITAGE (9)
  { title: "Royal Rajputana Fort", location: "Jodhpur, Rajasthan", category: "Castles", price: 15000 },
  { title: "Pichola Palace Stay", location: "Udaipur, Rajasthan", category: "Castles", price: 18000 },
  { title: "Gwalior Heritage Fort", location: "Gwalior, Madhya Pradesh", category: "Castles", price: 12000 },
  { title: "Mysore Royal Villa", location: "Mysore, Karnataka", category: "Castles", price: 8000 },
  { title: "Chettinad Heritage Mansion", location: "Karaikudi, Tamil Nadu", category: "Castles", price: 7500 },
  { title: "Old Delhi Mughal Haveli", location: "New Delhi, Delhi", category: "Castles", price: 9000 },
  { title: "Nalanda Historic Stay", location: "Nalanda, Bihar", category: "Castles", price: 4000 },
  { title: "Bikaner Desert Palace", location: "Bikaner, Rajasthan", category: "Castles", price: 11000 },
  { title: "Kumbhalgarh Fort View", location: "Kumbhalgarh, Rajasthan", category: "Castles", price: 10000 },

  // 🏊 AMAZING POOLS (9)
  { title: "Lonavala Infinity Pool Villa", location: "Lonavala, Maharashtra", category: "Amazing pools", price: 12000 },
  { title: "Alibaug Private Pool Estate", location: "Alibaug, Maharashtra", category: "Amazing pools", price: 15000 },
  { title: "Calangute Beachfront Pool", location: "Goa", category: "Amazing pools", price: 9000 },
  { title: "Khandala Weekend Retreat", location: "Khandala, Maharashtra", category: "Amazing pools", price: 11000 },
  { title: "Mahabaleshwar Forest Pool", location: "Mahabaleshwar, Maharashtra", category: "Amazing pools", price: 8500 },
  { title: "Noida Expressway Condo", location: "Noida, Uttar Pradesh", category: "Amazing pools", price: 6000 },
  { title: "ECR Ocean View Pool", location: "Chennai, Tamil Nadu", category: "Amazing pools", price: 14000 },
  { title: "Andaman Luxury Dive Resort", location: "Havelock, Andaman", category: "Amazing pools", price: 16000 },
  { title: "Coorg Plantation Pool Villa", location: "Coorg, Karnataka", category: "Amazing pools", price: 9500 },

  // 🏕️ CAMPING (9)
  { title: "Rishikesh River Rafting Camp", location: "Rishikesh, Uttarakhand", category: "Camping", price: 2000 },
  { title: "Jaisalmer Desert Safari Camp", location: "Jaisalmer, Rajasthan", category: "Camping", price: 3500 },
  { title: "Pawna Lake Night Camp", location: "Pawna, Maharashtra", category: "Camping", price: 1800 },
  { title: "Pachmarhi Forest Camp", location: "Pachmarhi, Madhya Pradesh", category: "Camping", price: 2200 },
  { title: "Chopta Trekker's Camp", location: "Chopta, Uttarakhand", category: "Camping", price: 1500 },
  { title: "Kasol Riverside Tents", location: "Kasol, Himachal Pradesh", category: "Camping", price: 2500 },
  { title: "Wayanad Jungle Camp", location: "Wayanad, Kerala", category: "Camping", price: 3000 },
  { title: "Kerwa Dam Eco-Camp", location: "Bhopal, Madhya Pradesh", category: "Camping", price: 2000 },
  { title: "Gokarna Beach Camping", location: "Gokarna, Karnataka", category: "Camping", price: 1800 },

  // 🚜 FARMS (9)
  { title: "Punjab Mustard Farmstay", location: "Amritsar, Punjab", category: "Farms", price: 2800 },
  { title: "Super Corridor Organic Farm", location: "Indore, Madhya Pradesh", category: "Farms", price: 4000 },
  { title: "Kerala Spice Plantation", location: "Thekkady, Kerala", category: "Farms", price: 4500 },
  { title: "Nashik Vineyard Stay", location: "Nashik, Maharashtra", category: "Farms", price: 6000 },
  { title: "Aravalli Dairy Farm", location: "Pushkar, Rajasthan", category: "Farms", price: 3000 },
  { title: "Kumaon Apple Orchard", location: "Mukteshwar, Uttarakhand", category: "Farms", price: 3500 },
  { title: "Assam Tea Estate Resort", location: "Jorhat, Assam", category: "Farms", price: 5000 },
  { title: "Karjat Mango Farm", location: "Karjat, Maharashtra", category: "Farms", price: 3200 },
  { title: "Hoshiarpur Village Stay", location: "Hoshiarpur, Punjab", category: "Farms", price: 2000 },

  // ❄️ ARCTIC / SNOW (9)
  { title: "Gulmarg Ski Resort", location: "Gulmarg, Jammu & Kashmir", category: "Arctic", price: 8000 },
  { title: "Leh Ladakhi Homestay", location: "Leh, Ladakh", category: "Arctic", price: 3500 },
  { title: "Auli Snow Cabin", location: "Auli, Uttarakhand", category: "Arctic", price: 6000 },
  { title: "Sonamarg Glacier View", location: "Sonamarg, Jammu & Kashmir", category: "Arctic", price: 5500 },
  { title: "Rohtang Pass Igloo", location: "Manali, Himachal Pradesh", category: "Arctic", price: 7000 },
  { title: "Sela Pass Frozen Lake Stay", location: "Tawang, Arunachal Pradesh", category: "Arctic", price: 4000 },
  { title: "Nubra Valley Winter Camp", location: "Nubra Valley, Ladakh", category: "Arctic", price: 4500 },
  { title: "Pahalgam Snowy Retreat", location: "Pahalgam, Jammu & Kashmir", category: "Arctic", price: 5000 },
  { title: "Keylong High Altitude Stay", location: "Keylong, Himachal Pradesh", category: "Arctic", price: 3000 },

  // ⛵ BOATS (9)
  { title: "Alleppey Luxury Houseboat", location: "Alleppey, Kerala", category: "Boats", price: 7000 },
  { title: "Dal Lake Shikara Stay", location: "Srinagar, Jammu & Kashmir", category: "Boats", price: 4500 },
  { title: "Kumarakom Backwater Cruise", location: "Kumarakom, Kerala", category: "Boats", price: 8500 },
  { title: "Chilika Lake Floating House", location: "Chilika, Odisha", category: "Boats", price: 3500 },
  { title: "Goa Party Yacht", location: "Panaji, Goa", category: "Boats", price: 15000 },
  { title: "Sundarbans Safari Boat", location: "Sundarbans, West Bengal", category: "Boats", price: 6000 },
  { title: "Majuli Island Ferry Stay", location: "Majuli, Assam", category: "Boats", price: 2500 },
  { title: "Andaman Scuba Liveaboard", location: "Port Blair, Andaman", category: "Boats", price: 12000 },
  { title: "Narmada River Cruise", location: "Jabalpur, Madhya Pradesh", category: "Boats", price: 4000 },

  // 🏕️ DOMES (9)
  { title: "Manali Geodesic Glamping", location: "Manali, Himachal Pradesh", category: "Domes", price: 5500 },
  { title: "Pushkar Starry Dome", location: "Pushkar, Rajasthan", category: "Domes", price: 4000 },
  { title: "Munnar Tea Garden Dome", location: "Munnar, Kerala", category: "Domes", price: 6000 },
  { title: "Wayanad Forest Bubble", location: "Wayanad, Kerala", category: "Domes", price: 6500 },
  { title: "Jibhi Riverside Dome", location: "Jibhi, Himachal Pradesh", category: "Domes", price: 4500 },
  { title: "Rishikesh Yoga Dome", location: "Rishikesh, Uttarakhand", category: "Domes", price: 3500 },
  { title: "Coorg Jungle Dome", location: "Coorg, Karnataka", category: "Domes", price: 5000 },
  { title: "Ooty Hilltop Bubble", location: "Ooty, Tamil Nadu", category: "Domes", price: 5800 },
  { title: "Darjeeling Mountain Dome", location: "Darjeeling, West Bengal", category: "Domes", price: 4800 }
];

// 🔥 MAGIC LOGIC: Yahan hum automatically har item ko uski 100% Unique Image assign kar rahe hain
const sampleListings = rawListings.map((item, index) => ({
  title: item.title,
  description: `Experience the best of ${item.location} with top-notch amenities, beautiful views, and authentic Indian hospitality. Perfect for your next getaway!`,
 images: [
    {
      filename: `listing-${index}-1`,
      // Main Exterior/Hotel View
      url: `https://loremflickr.com/800/600/hotel,exterior?lock=${index * 3 + 1}`
    },
    {
      filename: `listing-${index}-2`,
      // Bedroom/Interior View
      url: `https://loremflickr.com/800/600/bedroom,interior?lock=${index * 3 + 2}`
    },
    {
      filename: `listing-${index}-3`,
      // Bathroom/Pool/View
      url: `https://loremflickr.com/800/600/bathroom,pool?lock=${index * 3 + 3}`
    }
  ],
  price: item.price,
  location: item.location,
  country: "India",
  category: item.category
}));

module.exports = { data: sampleListings };