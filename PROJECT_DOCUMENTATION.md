# 🏠 NIVASO (AirbnbClone) - Complete Project Documentation

---

## 📊 SECTION 1: SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              NIVASO ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────────┐
                              │    FRONTEND (React)  │
                              │   localhost:5173     │
                              │                      │
                              │  ┌────────────────┐  │
                              │  │   App.jsx      │  │
                              │  │  (Router)      │  │
                              │  └───────┬────────┘  │
                              │          │           │
                              │  ┌───────┴────────┐  │
                              │  │    PAGES       │  │
                              │  │ ┌────────────┐ │  │
                              │  │ │ Home       │ │  │
                              │  │ │ Listings   │ │  │
                              │  │ │ ShowListing│ │  │
                              │  │ │ Profile    │ │  │
                              │  │ │ Auth Pages │ │  │
                              │  │ └────────────┘ │  │
                              │  └───────┬────────┘  │
                              │          │           │
                              │  ┌───────┴────────┐  │
                              │  │   CONTEXT      │  │
                              │  │ • AuthContext  │  │
                              │  │ • Notification │  │
                              │  │ • historyServ  │  │
                              │  └───────┬────────┘  │
                              └──────────┼──────────┘
                                         │
                                         │ HTTPS/REST API
                                         │ (Axios + Cookies)
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Node.js + Express)                         │
│                                  localhost:5000                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           MIDDLEWARE LAYER                                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐  ┌────────────────────┐ │   │
│  │  │ CORS       │  │ Cookie     │  │ isloggedin  │  │ validateListing    │ │   │
│  │  │ (Frontend) │  │ Parser     │  │ (JWT Auth)  │  │ (Joi Validation)   │ │   │
│  │  └────────────┘  └────────────┘  └─────────────┘  └────────────────────┘ │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐                         │   │
│  │  │ isOwner    │  │ isReview   │  │ Multer      │                         │   │
│  │  │ (Ownership)│  │ Author     │  │ (Upload)    │                         │   │
│  │  └────────────┘  └────────────┘  └─────────────┘                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                              ROUTES                                       │   │
│  │  /listings  →  ListingRouter  (CRUD + Search + Nearby)                   │   │
│  │  /listings/:id/reviews  →  ReviewRouter  (CRUD)                          │   │
│  │  /listings/:id/bookings  →  BookingRouter  (Create + Verify)             │   │
│  │  /history  →  HistoryRouter  (Track + Recommendations)                   │   │
│  │  /  →  UserRouter  (Auth: signup, login, forgot, reset, profile)         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           CONTROLLERS                                     │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │   │
│  │  │ authCtrl     │ │ listingCtrl  │ │ bookingCtrl  │ │ historyCtrl  │     │   │
│  │  │ • signup     │ │ • index      │ │ • create     │ │ • track      │     │   │
│  │  │ • login      │ │ • show       │ │ • confirm    │ │ • recommend  │     │   │
│  │  │ • logout     │ │ • create     │ │   Payment    │ │ • searches   │     │   │
│  │  │ • forgot     │ │ • update     │ └──────────────┘ └──────────────┘     │   │
│  │  │ • reset      │ │ • delete     │ ┌──────────────┐ ┌──────────────┐     │   │
│  │  └──────────────┘ │ • search     │ │ reviewCtrl   │ │ profileCtrl  │     │   │
│  │                   │ • nearby     │ │ • create     │ │ • getProfile │     │   │
│  │                   │ • filter     │ │ • update     │ │ • bookings   │     │   │
│  │                   └──────────────┘ │ • delete     │ └──────────────┘     │   │
│  │                                    └──────────────┘                       │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                              MODELS                                       │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │   │
│  │  │   User    │  │  Listing  │  │  Booking  │  │  Review   │  │ History │ │   │
│  │  │ • email   │  │ • title   │  │ • listing │  │ • rating  │  │ • user  │ │   │
│  │  │ • pass    │  │ • price   │  │ • user    │  │ • comment │  │ • guest │ │   │
│  │  │ • role    │  │ • coords  │  │ • dates   │  │ • author  │  │ • action│ │   │
│  │  │ • token   │  │ • owner   │  │ • payment │  └───────────┘  │ • data  │ │   │
│  │  └───────────┘  │ • reviews │  └───────────┘                 └─────────┘ │   │
│  │                 └───────────┘                                             │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┬────────────────────┘
                   │                                          │
                   ▼                                          ▼
┌──────────────────────────────┐                ┌──────────────────────────────┐
│        MONGODB ATLAS         │                │      EXTERNAL SERVICES       │
│                              │                │                              │
│  ┌────────────────────────┐  │                │  ┌────────────────────────┐  │
│  │     Collections        │  │                │  │     CLOUDINARY         │  │
│  │  • users               │  │                │  │  (Image Storage)       │  │
│  │  • listings            │  │                │  └────────────────────────┘  │
│  │  • bookings            │  │                │  ┌────────────────────────┐  │
│  │  • reviews             │  │                │  │     RAZORPAY           │  │
│  │  • histories           │  │                │  │  (Payment Gateway)     │  │
│  │                        │  │                │  └────────────────────────┘  │
│  │  Indexes:              │  │                │  ┌────────────────────────┐  │
│  │  • 2dsphere (coords)   │  │                │  │     NODEMAILER         │  │
│  │  • Compound (history)  │  │                │  │  (Email via Gmail)     │  │
│  └────────────────────────┘  │                │  └────────────────────────┘  │
└──────────────────────────────┘                └──────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAMS

### Authentication Flow
```
┌──────────┐    POST /signup      ┌──────────┐    bcrypt hash     ┌──────────┐
│  User    │ ──────────────────▶  │  Backend │ ─────────────────▶ │ MongoDB  │
│ (React)  │    {email,pass}      │ (Express)│   save user        │  (User)  │
└──────────┘                      └──────────┘                    └──────────┘
     ▲                                  │
     │                                  │ Generate JWT (7 days)
     │                                  │ Set HTTP-only Cookie
     │      { user, token }             │ Send Welcome Email (async)
     └──────────────────────────────────┘
```

### Booking & Payment Flow
```
┌──────────┐  POST /bookings   ┌──────────┐  Create Order    ┌──────────┐
│  User    │ ────────────────▶ │  Backend │ ───────────────▶ │ Razorpay │
│ (React)  │  {dates,guests}   │          │                  │   API    │
└──────────┘                   └──────────┘                  └──────────┘
     │                              │                             │
     │                              │ ◀─── order_id, amount ──────┘
     │                              │
     │ ◀──── { bookingId, order } ──┘
     │
     │  Open Razorpay Payment Modal
     ▼
┌──────────┐  User Pays    ┌──────────┐
│ Razorpay │ ────────────▶ │  User    │
│  Modal   │  Success      │  (React) │
└──────────┘               └──────────┘
     │                          │
     │                          │ POST /confirm-payment
     │                          │ {orderId, paymentId, signature}
     │                          ▼
     │                    ┌──────────┐  HMAC-SHA256     ┌──────────┐
     │                    │  Backend │ ──────────────▶  │ Verify   │
     │                    │          │  Signature       │ Success  │
     │                    └──────────┘                  └──────────┘
     │                          │                            │
     │                          │ Update booking: "paid"     │
     │                          ▼                            │
     │                    ┌──────────┐                       │
     └───────────────────▶│ MongoDB  │◀──────────────────────┘
                          │ (Booking)│
                          └──────────┘
```

### Recommendation Engine Flow
```
┌──────────────────────────────────────────────────────────────────────────┐
│                     PERSONALIZATION ENGINE                                │
└──────────────────────────────────────────────────────────────────────────┘

User Actions:
┌──────────┐                    ┌──────────┐                 ┌──────────┐
│  Search  │  POST /track       │  Backend │   Save Entry    │ MongoDB  │
│ "Mumbai" │ ─────────────────▶ │          │ ──────────────▶ │ History  │
└──────────┘  {SEARCH, query}   └──────────┘                 └──────────┘

┌──────────┐                    ┌──────────┐                 ┌──────────┐
│  View    │  POST /track       │  Backend │   Save Entry    │ MongoDB  │
│ Listing  │ ─────────────────▶ │          │ ──────────────▶ │ History  │
└──────────┘  {VIEW, listing}   └──────────┘                 └──────────┘

Recommendation Generation:
┌──────────┐  GET /recommend   ┌──────────┐  Fetch last 15   ┌──────────┐
│  Home    │ ────────────────▶ │  Backend │ ───────────────▶ │ History  │
│  Page    │                   │          │                  └──────────┘
└──────────┘                   └──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │     ALGORITHM                 │
                    │  1. Extract top locations     │
                    │  2. Extract top categories    │
                    │  3. Calculate avg price ±20%  │
                    │  4. Exclude viewed listings   │
                    │  5. Query matching listings   │
                    │  6. Fill gaps with trending   │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │  { recommendations: [...],   │
                    │    source: "personalized",   │
                    │    preferences: {...} }      │
                    └──────────────────────────────┘
```

---

## 📁 DATABASE SCHEMA RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    USER     │         │   LISTING   │         │   REVIEW    │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ _id         │◀────────│ owner       │    ┌───▶│ _id         │
│ username    │         │ _id         │    │    │ rating      │
│ email       │         │ title       │────┘    │ comment     │
│ password    │         │ description │         │ author      │──────┐
│ role        │         │ images[]    │         │ createdAt   │      │
│ resetToken  │         │ price       │         └─────────────┘      │
│ resetExpiry │         │ location    │                              │
└─────────────┘         │ country     │                              │
      │                 │ coordinates │                              │
      │                 │ category    │                              │
      │                 │ reviews[]   │◀─────────────────────────────┘
      │                 └─────────────┘
      │                       │
      │                       │
      ▼                       ▼
┌─────────────┐         ┌─────────────┐
│   BOOKING   │         │   HISTORY   │
├─────────────┤         ├─────────────┤
│ _id         │         │ _id         │
│ listing     │◀────────│ listing     │
│ user        │◀────────│ user        │
│ checkIn     │         │ guestId     │
│ checkOut    │         │ actionType  │
│ totalPrice  │         │ searchQuery │
│ paymentStat │         │ location    │
│ razorpayId  │         │ category    │
│ razorpayPay │         │ price       │
│ createdAt   │         │ createdAt   │
└─────────────┘         └─────────────┘

RELATIONSHIPS:
• User 1:N Listing (owner)
• User 1:N Review (author)
• User 1:N Booking
• User 1:N History
• Listing 1:N Review
• Listing 1:N Booking
• Listing 1:N History (VIEW actions)

CASCADE DELETE:
• Listing deleted → All reviews deleted (post middleware)
```

---

## 🔐 SECURITY IMPLEMENTATION

### Authentication Security
```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PASSWORD HASHING                                         │
│     └── bcryptjs with 12 salt rounds                         │
│         (computationally expensive for brute-force)          │
│                                                              │
│  2. JWT TOKEN                                                │
│     └── Signed with JWT_SECRET                               │
│     └── 7-day expiration                                     │
│     └── Contains: { userId }                                 │
│                                                              │
│  3. HTTP-ONLY COOKIE                                         │
│     └── Cannot be accessed by JavaScript (XSS protection)    │
│     └── secure: true (HTTPS only)                            │
│     └── sameSite: 'none' (cross-origin)                      │
│                                                              │
│  4. PAYMENT VERIFICATION                                     │
│     └── HMAC-SHA256 signature verification                   │
│     └── order_id|payment_id signed with secret               │
│     └── Prevents payment tampering                           │
│                                                              │
│  5. AUTHORIZATION MIDDLEWARE                                 │
│     └── isloggedin: JWT verification                         │
│     └── isOwner: Resource ownership check                    │
│     └── isreviewAuthor: Review permission                    │
│                                                              │
│  6. INPUT VALIDATION                                         │
│     └── Joi schemas for all inputs                           │
│     └── Sanitization before database                         │
│                                                              │
│  7. PASSWORD RESET                                           │
│     └── crypto.randomBytes(20) for tokens                    │
│     └── 15-minute expiration                                 │
│     └── Token cleared after use                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 FEATURE IMPLEMENTATION DETAILS

### 1. Infinite Scroll Pagination
```javascript
// Frontend - IntersectionObserver Pattern
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && hasMore) {
    setPage(prev => prev + 1);  // Trigger next page fetch
  }
}, { threshold: 1.0 });

// Backend - Skip/Limit Pattern
const limit = 6;
const skip = (page - 1) * limit;
const listings = await Listing.find(query).skip(skip).limit(limit);
const total = await Listing.countDocuments(query);
return { listings, totalPages: Math.ceil(total / limit) };
```

### 2. Fuzzy Search Algorithm
```javascript
// Pattern Generation for Typo Tolerance
function createFuzzyPattern(term) {
  const substitutions = {
    'a': '[ae]', 'e': '[ei]', 'i': '[iy]',
    'o': '[ou]', 'c': '[ck]', 's': '[sz]'
  };
  
  return term.split('').map(char => 
    substitutions[char.toLowerCase()] || char
  ).join('.?');  // Allow optional chars between
}

// "mumbai" → "m.?[uo].?m.?b.?[ae].?[iy]"
// Matches: mumbai, mumabi, mombai, etc.
```

### 3. Geolocation Nearby Search
```javascript
// MongoDB $near Query with 2dsphere Index
const nearbyListings = await Listing.find({
  "coordinates.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude]  // [lng, lat] order!
      },
      $maxDistance: 5000  // 5km in meters
    }
  }
}).limit(10);
```

### 4. Guest User Tracking (No Login Required)
```javascript
// Frontend - UUID Generation
const generateGuestId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

// Stored in localStorage, sent via x-guest-id header
// Backend accepts either user._id OR guestId
```

### 5. Video Lazy Loading (Intersection Observer)
```javascript
// Hero Video - Play only when visible
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    },
    { threshold: 0.3 }  // 30% visible
  );
  
  observer.observe(heroRef.current);
  return () => observer.disconnect();
}, []);
```

### 6. Razorpay Payment Integration
```javascript
// Step 1: Create Order (Backend)
const order = await razorpay.orders.create({
  amount: totalPrice * 100,  // Paise (₹1 = 100 paise)
  currency: 'INR',
  receipt: `booking_${bookingId}`
});

// Step 2: Verify Signature (Backend)
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  booking.paymentStatus = 'failed';
  throw new Error('Payment verification failed');
}
```

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /signup | ❌ | User registration |
| POST | /login | ❌ | User login |
| GET | /logout | ❌ | Clear session |
| POST | /forgot-password | ❌ | Send reset email |
| POST | /reset-password/:token | ❌ | Reset password |
| GET | /profile | ✅ | User profile + bookings |
| GET | /listings | ❌ | List all (paginated, filterable) |
| POST | /listings | ✅ | Create listing |
| GET | /listings/:id | ❌ | Single listing details |
| PUT | /listings/:id | ✅👤 | Update listing (owner) |
| DELETE | /listings/:id | ✅👤 | Delete listing (owner) |
| GET | /listings/search | ❌ | Fuzzy search |
| GET | /listings/nearby | ❌ | Geolocation search |
| GET | /listings/filter/:cat | ❌ | Category filter |
| POST | /listings/:id/reviews | ✅ | Add review |
| PUT | /listings/:id/reviews/:rid | ✅👤 | Edit review |
| DELETE | /listings/:id/reviews/:rid | ✅👤 | Delete review |
| POST | /listings/:id/bookings | ✅ | Create booking |
| POST | /listings/:id/bookings/confirm-payment | ❌ | Verify payment |
| POST | /history/track | ⚪ | Track action |
| GET | /history/recommendations | ⚪ | Get recommendations |
| GET | /history/searches | ⚪ | Recent searches |

Legend: ✅ = Required, ❌ = Not required, ⚪ = Optional, 👤 = Owner only

---

## 🛠️ TECHNOLOGY STACK

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Web framework |
| MongoDB | 6+ | Database |
| Mongoose | 8.x | ODM |
| bcryptjs | 2.4 | Password hashing |
| jsonwebtoken | 9.x | JWT auth |
| multer | 1.4 | File uploads |
| cloudinary | 2.x | Image storage |
| razorpay | 2.x | Payments |
| nodemailer | 6.x | Email |
| joi | 17.x | Validation |
| cors | 2.8 | Cross-origin |
| cookie-parser | 1.4 | Cookies |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI library |
| Vite | 6.2 | Build tool |
| React Router | 7.14 | Routing |
| Axios | 1.14 | HTTP client |
| Tailwind CSS | 4.2 | Styling |
| Framer Motion | 11.18 | Animations |
| react-icons | 5.6 | Icons |
| Swiper | 11.x | Carousels |

---

*Documentation Generated: April 2026*
*Project: Nivaso (AirbnbClone)*
*Developer: Anshu Thakur*
