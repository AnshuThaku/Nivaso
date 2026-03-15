const sampleListings = [
  {
    title: "Luxury Houseboat in Alleppey",
    description:
      "Experience the serene backwaters of Kerala in this premium houseboat. Includes traditional meals and sunset cruise.",
    image: {
      filename: "listingimage",
      url: "https://www.indigocruise.com/images/kerala-houseboat-images/4-beadroom-houseboat/4%20Bedroom%20Luxury%20Houseboat%20IND%2002/01.jpg",
    },
    price: 5000,
    location: "Alleppey, Kerala",
    country: "India",
    category: "Boats",
  },
  {
    title: "Heritage Haveli in Jaipur",
    description:
      "Stay like royalty in this 200-year-old restored Haveli in the Pink City. Close to Hawa Mahal and City Palace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4500,
    location: "Jaipur, Rajasthan",
    country: "India",
    category: "Castles",
  },
  {
    title: "Beachfront Villa in Goa",
    description:
      "Wake up to the sound of waves in this stunning beachfront villa. Private pool and direct beach access.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 8000,
    location: "Calangute, Goa",
    country: "India",
    category: "Amazing pools",
  },
  {
    title: "Cozy Cottage in Manali",
    description:
      "Nestled in the Himalayas, this wooden cottage offers breathtaking mountain views and a cozy fireplace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Manali, Himachal Pradesh",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Tea Estate Bungalow in Darjeeling",
    description:
      "Colonial-era bungalow surrounded by lush green tea gardens. Perfect for a peaceful retreat.",
    image: {
      filename: "listingimage",
      url: "https://q-xx.bstatic.com/xdata/images/hotel/max500/331778046.jpg?k=259f43429a143bbe2240feccd0f35005e94a3d321772b1a9d201d6edb1f871e1&o=",
    },
    price: 6000,
    location: "Darjeeling, West Bengal",
    country: "India",
    category: "Farms",
  },
  {
    title: "Modern Apartment in Mumbai",
    description:
      "Stylish apartment in Bandra West, close to trendy cafes and the sea link. Ideal for city lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Mumbai, Maharashtra",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Luxury Tent in Jaisalmer",
    description:
      "Glamping experience in the Thar Desert. Enjoy folk music, camel safari, and stargazing.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1534234828569-fa715eeee79b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4500,
    location: "Jaisalmer, Rajasthan",
    country: "India",
    category: "Camping",
  },
  {
    title: "Riverside Homestay in Rishikesh",
    description:
      "Find peace next to the Ganges. Yoga deck, organic food, and walking distance to Laxman Jhula.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518182170546-07661fd94144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Rishikesh, Uttarakhand",
    country: "India",
    category: "Rooms",
  },
  {
    title: "Eco-Resort in Wayanad",
    description:
      "Stay in a bamboo cottage inside a coffee plantation. Nature walks and bird watching included.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3800,
    location: "Wayanad, Kerala",
    country: "India",
    category: "Trending",
  },
  {
    title: "Historic French Villa in Pondicherry",
    description:
      "Yellow colonial villa in the White Town area. Walking distance to the Promenade Beach and cafes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 5500,
    location: "Pondicherry",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Lakeview Palace in Udaipur",
    description:
      "Experience the grandeur of Udaipur with stunning views of Lake Pichola and the City Palace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 7000,
    location: "Udaipur, Rajasthan",
    country: "India",
    category: "Castles",
  },
  {
    title: "Tea Garden Villa in Munnar",
    description:
      "Wake up to mist-covered tea gardens. A perfect getaway for nature lovers and trekkers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1516690553959-71a414d6b9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4200,
    location: "Munnar, Kerala",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Ghat-side Guest House in Varanasi",
    description:
      "Traditional guest house located right on the banks of the Ganges. Experience the spiritual essence of Kashi.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Varanasi, Uttar Pradesh",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "View of Taj Homestay in Agra",
    description:
      "Enjoy a clear view of the Taj Mahal from the rooftop terrace of this cozy homestay.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Agra, Uttar Pradesh",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Colonial Cottage in Ooty",
    description:
      "Charming colonial-style cottage nestled in the Nilgiri hills. Spacious garden and fireplace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3800,
    location: "Ooty, Tamil Nadu",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Ladakhi Homestay in Leh",
    description:
      "Experience the warmth of Ladakhi hospitality in this traditional mud-brick house. Stunning mountain views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Leh, Ladakh",
    country: "India",
    category: "Arctic",
  },
  {
    title: "Cloud's End Villa in Shillong",
    description:
      "Perched on a hill, this villa offers panoramic views of Shillong. Perfect for a peaceful retreat.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4500,
    location: "Shillong, Meghalaya",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Stone Cottage in Hampi",
    description:
      "Stay amidst the boulders of Hampi in this unique stone cottage. Close to the Virupaksha Temple.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1605627003429-231367a14777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Hampi, Karnataka",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Coffee Plantation Stay in Coorg",
    description:
      "Immerse yourself in nature at this homestay located within a sprawling coffee estate.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Coorg, Karnataka",
    country: "India",
    category: "Farms",
  },
  {
    title: "Himalayan Retreat in Gangtok",
    description:
      "Enjoy the view of Kanchenjunga from your balcony. Modern amenities with traditional Sikkimese decor.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1589041127168-9b191572d471?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Gangtok, Sikkim",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Royal Stay in Mysore",
    description:
      "Experience the heritage of Mysore in this elegant guesthouse. Close to Mysore Palace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3200,
    location: "Mysore, Karnataka",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Lakeside Cabin in Nainital",
    description:
      "Cozy cabin overlooking Naini Lake. Enjoy boating and mall road walks nearby.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3800,
    location: "Nainital, Uttarakhand",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Luxury Resort in Andaman",
    description:
      "Private beach resort in Havelock Island. Scuba diving and snorkeling facilities available.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 9000,
    location: "Havelock Island, Andaman",
    country: "India",
    category: "Amazing pools",
  },
  {
    title: "Weekend Villa in Lonavala",
    description:
      "Perfect weekend getaway from Mumbai/Pune. Private pool and lush green surroundings.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 5500,
    location: "Lonavala, Maharashtra",
    country: "India",
    category: "Amazing pools",
  },
  {
    title: "Blue City Homestay in Jodhpur",
    description:
      "Stay in the heart of the Blue City with a view of Mehrangarh Fort. Authentic Rajasthani food served.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2800,
    location: "Jodhpur, Rajasthan",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Farmstay in Punjab",
    description:
      "Experience rural Punjab life near Amritsar. Tractor rides, fresh milk, and sarson da saag.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Amritsar, Punjab",
    country: "India",
    category: "Farms",
  },
  {
    title: "Tech City Apartment in Hyderabad",
    description:
      "Modern apartment in Gachibowli. Close to IT hubs and IKEA. Gym and pool access included.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Hyderabad, Telangana",
    country: "India",
    category: "Iconic cities",
  },
  {
    title: "Garden City Villa in Bangalore",
    description:
      "Spacious villa in a quiet neighborhood of Whitefield. Large garden and pet-friendly.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 6500,
    location: "Bangalore, Karnataka",
    country: "India",
    category: "Iconic cities",
  },
    {
    title: "Pine Forest Cabin in Shimla",
    description:
      "Secluded cabin surrounded by pine forests. Perfect for a snowy winter vacation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Shimla, Himachal Pradesh",
    country: "India",
    category: "Mountains",
  },
  {
    title: "Mist Valley Resort in Kodaikanal",
    description:
      "Resort located in the misty valleys of Kodaikanal. Bonfire and trekking activities organized.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571407921200-d872b220be0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Kodaikanal, Tamil Nadu",
    country: "India",
    category: "Mountains",
  }
];

module.exports = { data: sampleListings };
