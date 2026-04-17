# 🎯 NIVASO PROJECT - INTERVIEW QUESTIONS & ANSWERS

## Complete Interview Preparation Guide

---

# 📌 SECTION 1: PROJECT OVERVIEW QUESTIONS

### Q1: Apna project briefly explain karo?
**Answer:**
"Nivaso ek full-stack vacation rental platform hai - basically Airbnb ka clone. Isme users properties browse kar sakte hain, book kar sakte hain with Razorpay payment integration, reviews de sakte hain, aur hosts apni properties list kar sakte hain.

**Key Features:**
- User authentication with JWT & HTTP-only cookies
- Property listing with Cloudinary image upload
- Razorpay payment integration with signature verification
- Review system with booking verification
- Personalized recommendation engine
- Geolocation-based nearby search
- Fuzzy/typo-tolerant search

**Tech Stack:**
- Frontend: React 19, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js, MongoDB
- External: Cloudinary, Razorpay, Nodemailer"

---

### Q2: Is project mein sabse challenging part kya tha?
**Answer:**
"Sabse challenging parts the:

1. **Razorpay Payment Security** - HMAC-SHA256 signature verification implement karna taaki koi fake payment inject na kar sake. order_id|payment_id ko secret key se sign karke verify karte hain.

2. **Recommendation Engine** - Guest users (bina login) ko bhi personalized recommendations dena. localStorage mein guestId store karke history track karna, fir MongoDB aggregation se top locations/categories nikalna.

3. **Infinite Scroll + Real-time Filters** - IntersectionObserver se last element observe karna, page state manage karna, aur search/category filters ke saath sync rakhna."

---

### Q3: Project architecture explain karo?
**Answer:**
"3-tier architecture hai:

**Frontend (Presentation Layer):**
- React with Context API for state management
- React Router for SPA navigation
- Axios with interceptors for API calls

**Backend (Business Logic Layer):**
- Express.js REST API
- Middleware chain: CORS → Cookie Parser → Auth → Validation
- Controllers handle business logic
- Services for email/external APIs

**Database Layer:**
- MongoDB Atlas (cloud)
- Mongoose ODM with schemas
- Indexes: 2dsphere for geolocation, compound for history

**External Services:**
- Cloudinary (images)
- Razorpay (payments)
- Gmail SMTP (emails)"

---

# 📌 SECTION 2: AUTHENTICATION & SECURITY

### Q4: Authentication flow explain karo?
**Answer:**
"JWT-based authentication use kiya hai:

1. **Signup/Login:**
   - Password hash with bcryptjs (12 rounds)
   - Generate JWT with userId (7-day expiry)
   - Store in HTTP-only cookie (XSS protection)
   - Also return token in response for mobile apps

2. **Protected Routes:**
   - Middleware extracts token from cookie OR Authorization header
   - jwt.verify() with secret key
   - Attach user to request object

3. **Logout:**
   - Clear cookie with same options
   - Frontend clears localStorage

```javascript
// Token generation
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

// Cookie options
{ httpOnly: true, secure: true, sameSite: 'none', expires: 7_DAYS }
```"

---

### Q5: HTTP-only cookie kyun use kiya? localStorage kyun nahi?
**Answer:**
"Security reasons:

**localStorage Problems:**
- JavaScript se accessible hai
- XSS attack mein attacker token chura sakta hai
- `document.cookie` ya `localStorage.getItem()` se access ho jayega

**HTTP-only Cookie Benefits:**
- JavaScript access nahi kar sakta (`document.cookie` mein nahi dikhta)
- Browser automatically send karta hai with credentials
- XSS attack se protected

**Trade-off:**
- CSRF attacks ke liye extra protection chahiye
- sameSite: 'none' use kiya for cross-origin
- secure: true ensures HTTPS only"

---

### Q6: Password reset flow explain karo?
**Answer:**
```
1. User clicks "Forgot Password"
2. POST /forgot-password { email }
3. Backend generates: crypto.randomBytes(20).toString('hex')
4. Save token + expiry (15 min) to user document
5. Send email with: {FRONTEND_URL}/reset-password/{token}
6. User clicks link → opens reset form
7. POST /reset-password/{token} { newPassword }
8. Backend: Find user where token matches AND expiry > now
9. Hash new password, clear token fields
10. Redirect to login
```

**Security measures:**
- Token expires in 15 minutes
- Token cleared after use (single-use)
- Generic error message (doesn't reveal if email exists)"

---

### Q7: Razorpay payment security kaise handle ki?
**Answer:**
"HMAC-SHA256 signature verification:

```javascript
// Backend verification
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  booking.paymentStatus = 'failed';
  throw new Error('Fraud detected!');
}
```

**Flow:**
1. Create order on backend (amount in paise)
2. Frontend opens Razorpay modal with order_id
3. User pays → Razorpay sends signature
4. Backend verifies signature with secret
5. Only valid signature → mark booking 'paid'

**Why signature?**
- Prevents tampering of payment_id
- Ensures payment actually happened
- Secret key never exposed to frontend"

---

### Q8: Authorization vs Authentication difference?
**Answer:**
"**Authentication:** WHO are you?
- Login/signup
- JWT token verification
- `isloggedin` middleware

**Authorization:** WHAT can you do?
- Role-based access
- Resource ownership
- `isOwner`, `isreviewAuthor` middleware

```javascript
// Authentication - verify identity
const isloggedin = async (req, res, next) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};

// Authorization - verify permission
const isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  next();
};
```"

---

# 📌 SECTION 3: DATABASE & MONGODB

### Q9: Database schema design explain karo?
**Answer:**
"5 main collections:

1. **Users** - Authentication data
2. **Listings** - Property details with geolocation
3. **Bookings** - Reservations with payment status
4. **Reviews** - Ratings linked to listings
5. **History** - User actions for recommendations

**Relationships:**
- User 1:N Listings (owner)
- User 1:N Reviews (author)
- User 1:N Bookings
- Listing 1:N Reviews
- Listing 1:N Bookings

**Special Features:**
- GeoJSON coordinates with 2dsphere index
- Compound indexes on history for fast queries
- Cascade delete: Listing → Reviews"

---

### Q10: MongoDB mein geolocation search kaise kaam karta hai?
**Answer:**
"**Step 1: Schema with GeoJSON**
```javascript
coordinates: {
  type: { type: String, default: 'Point' },
  coordinates: [Number]  // [longitude, latitude]
}
```

**Step 2: Create 2dsphere Index**
```javascript
listingSchema.index({ 'coordinates': '2dsphere' });
```

**Step 3: Query with $near**
```javascript
await Listing.find({
  'coordinates.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat]  // Order matters!
      },
      $maxDistance: 5000  // meters
    }
  }
});
```

**Important:**
- MongoDB uses [longitude, latitude] order (opposite of Google Maps)
- 2dsphere index required for $near queries
- $maxDistance in meters"

---

### Q11: Mongoose populate kya hai? Kaise use kiya?
**Answer:**
"Populate = SQL JOIN ka MongoDB equivalent

```javascript
// Without populate
const listing = await Listing.findById(id);
// listing.owner = ObjectId('...')
// listing.reviews = [ObjectId, ObjectId, ...]

// With populate
const listing = await Listing.findById(id)
  .populate('owner')           // User document
  .populate({
    path: 'reviews',
    populate: { path: 'author' }  // Nested populate
  });

// Now:
// listing.owner = { _id, username, email, ... }
// listing.reviews = [{ rating, comment, author: { username } }, ...]
```

**Benefits:**
- Single query instead of multiple
- Automatic ObjectId resolution
- Nested population support"

---

### Q12: Mongoose middleware (hooks) kaise use kiya?
**Answer:**
"Post-delete middleware for cascade delete:

```javascript
// When listing is deleted, delete all its reviews
listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
```

**Types of Middleware:**
1. **Document middleware:** save, validate, remove
2. **Query middleware:** find, findOne, update, delete
3. **Aggregate middleware:** aggregate

**Use cases:**
- Password hashing before save
- Cascade delete on remove
- Logging on find
- Validation before save"

---

### Q13: Indexing kyun important hai? Kaise implement kiya?
**Answer:**
"**Without Index:**
- MongoDB scans ALL documents (Collection Scan)
- O(n) time complexity
- Slow for large datasets

**With Index:**
- Direct lookup like book index
- O(log n) time complexity
- Much faster queries

**Indexes in Nivaso:**
```javascript
// 2dsphere for geolocation queries
listingSchema.index({ 'coordinates': '2dsphere' });

// Compound index for history queries
historySchema.index({ user: 1, guestId: 1, actionType: 1, createdAt: -1 });
```

**Trade-offs:**
- Faster reads, slower writes
- Extra storage space
- Should index frequently queried fields"

---

# 📌 SECTION 4: REACT & FRONTEND

### Q14: React Context API kyun use kiya? Redux kyun nahi?
**Answer:**
"**Context API Benefits:**
- Built-in React feature (no extra library)
- Simple state management
- Good for authentication, notifications
- Less boilerplate than Redux

**Redux Better When:**
- Complex state with many reducers
- Time-travel debugging needed
- Large team with strict patterns
- Middleware requirements (saga, thunk)

**My Implementation:**
```javascript
// AuthContext - user state globally accessible
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```"

---

### Q15: useCallback aur useMemo mein difference?
**Answer:**
"**useMemo:** Memoize VALUE
```javascript
// Expensive calculation cached
const totalPrice = useMemo(() => {
  return nights * price * 1.19;  // Only recalculates when nights/price change
}, [nights, price]);
```

**useCallback:** Memoize FUNCTION
```javascript
// Function reference stays same
const handleSearch = useCallback(() => {
  navigate(`/listings?search=${query}`);
}, [query, navigate]);

// Useful when passing to child components (prevents re-render)
<SearchBar onSearch={handleSearch} />
```

**Key Difference:**
- useMemo returns computed value
- useCallback returns function reference
- Both prevent unnecessary recalculations/re-renders"

---

### Q16: Infinite scroll kaise implement kiya?
**Answer:**
```javascript
const [page, setPage] = useState(1);
const [listings, setListings] = useState([]);
const [hasMore, setHasMore] = useState(true);
const lastListingRef = useRef();

// IntersectionObserver watches last element
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    },
    { threshold: 1.0 }
  );
  
  if (lastListingRef.current) {
    observer.observe(lastListingRef.current);
  }
  
  return () => observer.disconnect();
}, [hasMore, loading]);

// Fetch more when page changes
useEffect(() => {
  const fetchMore = async () => {
    const res = await axios.get(`/listings?page=${page}`);
    setListings(prev => [...prev, ...res.data.listings]);
    setHasMore(page < res.data.totalPages);
  };
  fetchMore();
}, [page]);

// Attach ref to last item
{listings.map((listing, i) => (
  <ListingCard 
    ref={i === listings.length - 1 ? lastListingRef : null}
    key={listing._id} 
  />
))}
```"

---

### Q17: useEffect dependencies array kyun important hai?
**Answer:**
"**Empty Array []:** Run once on mount
```javascript
useEffect(() => {
  fetchUser();  // Only on initial render
}, []);
```

**With Dependencies:** Run when deps change
```javascript
useEffect(() => {
  fetchListing(id);  // Runs when id changes
}, [id]);
```

**No Array:** Run on EVERY render (usually wrong!)
```javascript
useEffect(() => {
  // This runs infinitely if it causes re-render!
});
```

**Common Mistakes:**
1. Missing dependencies → stale closure
2. Object/array in deps → infinite loop (use useMemo)
3. Function in deps → infinite loop (use useCallback)

```javascript
// Wrong - id changes but not in deps
useEffect(() => {
  fetch(`/api/${id}`);  // Uses stale id!
}, []);

// Correct
useEffect(() => {
  fetch(`/api/${id}`);
}, [id]);
```"

---

### Q18: React Router mein protected routes kaise banaye?
**Answer:**
```javascript
// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage in routes
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/listings/new" 
  element={
    <ProtectedRoute>
      <NewListing />
    </ProtectedRoute>
  } 
/>
```

**Key Points:**
- Check auth state before rendering
- Redirect to login if not authenticated
- Show loader while checking auth
- `replace` prevents back button issues"

---

# 📌 SECTION 5: NODE.JS & EXPRESS

### Q19: Middleware chain kaise kaam karta hai?
**Answer:**
"Express middleware = functions that run in sequence

```
Request → CORS → CookieParser → Routes → Controller → Response
              ↓                    ↓
           isloggedin          isOwner
              ↓                    ↓
          validateListing      Business Logic
```

**Order Matters:**
```javascript
// This order is important!
app.use(cors());              // 1. Handle CORS
app.use(cookieParser());      // 2. Parse cookies
app.use(express.json());      // 3. Parse JSON body
app.use('/listings', routes); // 4. Routes
app.use(errorHandler);        // 5. Error handler LAST

// Route-level middleware
router.post('/', 
  isloggedin,        // 1. Check auth
  upload.single(),   // 2. Handle file
  validateListing,   // 3. Validate data
  createListing      // 4. Controller
);
```

**next() function:**
- Calls next middleware in chain
- Without next(), request hangs
- next(error) jumps to error handler"

---

### Q20: Error handling pattern explain karo?
**Answer:**
"**Custom Error Class:**
```javascript
class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

**Async Wrapper (eliminates try-catch):**
```javascript
const WrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Usage - no try-catch needed!
router.get('/:id', WrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, 'Not found');
  res.json(listing);
}));
```

**Global Error Handler:**
```javascript
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Server Error' } = err;
  console.error(`[ERROR] ${statusCode}:`, message);
  res.status(statusCode).json({ message });
});
```"

---

### Q21: Environment variables kyun important hain?
**Answer:**
"**Security:**
- Secrets (API keys, DB password) code mein nahi hone chahiye
- Git mein push nahi hote (.gitignore)
- Different values for dev/prod

**Implementation:**
```javascript
// .env file (NEVER commit!)
JWT_SECRET=my_super_secret_key
MONGO_URI=mongodb+srv://...
RAZORPAY_KEY_SECRET=...

// Load with dotenv
require('dotenv').config();

// Access
const secret = process.env.JWT_SECRET;
```

**Best Practices:**
1. Use `.env.example` with dummy values
2. Add `.env` to `.gitignore`
3. Different `.env` for dev/staging/prod
4. Validate env vars on startup"

---

# 📌 SECTION 6: PERFORMANCE & OPTIMIZATION

### Q22: Lazy loading video kaise implement ki?
**Answer:**
```javascript
const [isVideoPlaying, setIsVideoPlaying] = useState(false);
const videoRef = useRef(null);
const heroRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Hero visible - play video
          videoRef.current?.play()
            .then(() => setIsVideoPlaying(true))
            .catch(() => setIsVideoPlaying(false));
        } else {
          // Hero not visible - pause video
          videoRef.current?.pause();
          setIsVideoPlaying(false);
        }
      });
    },
    { threshold: 0.3 }  // 30% visible
  );

  if (heroRef.current) {
    observer.observe(heroRef.current);
  }

  return () => observer.disconnect();
}, []);
```

**Benefits:**
- Video doesn't load/play until needed
- Saves bandwidth and battery
- Better performance score"

---

### Q23: Image optimization kaise ki?
**Answer:**
"**Cloudinary Transformation:**
```javascript
// Upload with optimization
const result = await cloudinary.uploader.upload(file.path, {
  folder: 'Nivasso_development',
  transformation: [
    { width: 800, height: 600, crop: 'fill' },
    { quality: 'auto:good' },
    { format: 'webp' }
  ]
});
```

**Frontend Lazy Loading:**
```jsx
<img 
  src={listing.image.url}
  loading="lazy"  // Native lazy loading
  alt={listing.title}
/>
```

**Best Practices:**
1. Use WebP format (smaller than JPEG)
2. Resize on upload (don't serve 4K for thumbnails)
3. Native loading='lazy' attribute
4. Placeholder/skeleton while loading"

---

### Q24: Debouncing aur Throttling mein difference?
**Answer:**
"**Debouncing:** Wait for pause in events
```javascript
// Search after user stops typing for 300ms
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);
```

**Throttling:** Limit event frequency
```javascript
// Scroll handler max once per 100ms
const throttle = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};
```

**Use Cases:**
- Debounce: Search input, form validation
- Throttle: Scroll events, resize events"

---

# 📌 SECTION 7: SYSTEM DESIGN

### Q25: Recommendation engine ka algorithm explain karo?
**Answer:**
"**Content-Based Filtering:**

```javascript
async function getRecommendations(userId, guestId) {
  // 1. Fetch last 15 actions
  const history = await History.find({ $or: [{ user: userId }, { guestId }] })
    .sort({ createdAt: -1 })
    .limit(15);
  
  // 2. Extract preferences
  const locations = history.map(h => h.location).filter(Boolean);
  const categories = history.map(h => h.category).filter(Boolean);
  const prices = history.map(h => h.price).filter(Boolean);
  
  // 3. Get top 3 frequent items
  const topLocations = getTopItems(locations, 3);
  const topCategories = getTopItems(categories, 3);
  const avgPrice = prices.reduce((a,b) => a+b, 0) / prices.length;
  
  // 4. Build query
  const query = {
    $or: [
      { location: { $in: topLocations } },
      { category: { $in: topCategories } }
    ],
    price: { $gte: avgPrice * 0.8, $lte: avgPrice * 1.2 },
    _id: { $nin: viewedListingIds }  // Exclude seen
  };
  
  // 5. Fetch recommendations
  let results = await Listing.find(query).limit(8);
  
  // 6. Fill with trending if not enough
  if (results.length < 4) {
    const trending = await Listing.find({ category: 'Trending' }).limit(4);
    results = [...results, ...trending];
  }
  
  return results;
}
```"

---

### Q26: Scalability ke liye kya improvements kar sakte ho?
**Answer:**
"**Current Limitations:**
- Single server
- No caching
- All images on single CDN

**Improvements:**

1. **Caching with Redis:**
```javascript
// Cache popular listings
const cached = await redis.get(`listing:${id}`);
if (cached) return JSON.parse(cached);

const listing = await Listing.findById(id);
await redis.setex(`listing:${id}`, 3600, JSON.stringify(listing));
```

2. **Load Balancing:**
- Multiple Node.js instances
- Nginx or AWS ALB
- Sticky sessions for WebSocket

3. **Database Optimization:**
- Read replicas for queries
- Sharding for large datasets
- Connection pooling

4. **CDN for Static Assets:**
- Cloudinary already does this
- Add CDN for JS/CSS bundles

5. **Microservices (future):**
- Separate auth service
- Separate booking service
- Message queue for emails"

---

### Q27: Rate limiting implement kaise karoge?
**Answer:**
```javascript
// Using express-rate-limit
const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests, please try again later'
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,                     // 5 attempts
  message: 'Too many login attempts'
});

app.use('/api', apiLimiter);
app.use('/login', authLimiter);
app.use('/signup', authLimiter);
```

**Advanced: Redis-based for distributed:**
```javascript
const RedisStore = require('rate-limit-redis');
const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000,
  max: 100
});
```"

---

# 📌 SECTION 8: BEHAVIORAL & SITUATIONAL

### Q28: Production mein bug aaya to kaise debug karoge?
**Answer:**
"**Step 1: Identify**
- Check error logs (console.error, monitoring tools)
- Reproduce the issue
- Check recent deployments

**Step 2: Isolate**
- Which endpoint/component failing?
- Specific user or all users?
- Time-based pattern?

**Step 3: Debug**
```javascript
// Add detailed logging
console.log('[DEBUG] Request body:', req.body);
console.log('[DEBUG] User:', req.user);
console.log('[DEBUG] DB Query:', query);
```

**Step 4: Fix & Test**
- Write failing test first
- Apply fix
- Verify test passes

**Step 5: Deploy & Monitor**
- Deploy to staging first
- Monitor logs post-deployment
- Rollback if needed"

---

### Q29: Code review mein kya check karte ho?
**Answer:**
"**Security:**
- SQL/NoSQL injection
- XSS vulnerabilities
- Sensitive data exposure
- Authentication/authorization

**Code Quality:**
- DRY principle
- Single responsibility
- Meaningful variable names
- Proper error handling

**Performance:**
- N+1 query problems
- Unnecessary re-renders (React)
- Missing indexes
- Memory leaks

**Best Practices:**
- Input validation
- Proper async/await usage
- Edge case handling
- Documentation/comments"

---

### Q30: Git workflow kya follow karte ho?
**Answer:**
"**Feature Branch Workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/payment-integration

# 2. Make changes, commit frequently
git add .
git commit -m "feat: add Razorpay order creation"

# 3. Push and create PR
git push origin feature/payment-integration

# 4. Code review + merge to main
# 5. Delete feature branch

# Commit message convention:
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructure
test: adding tests
chore: maintenance
```"

---

# 📌 QUICK REVISION POINTS

## Must-Know Concepts:
1. **JWT** - stateless authentication token
2. **bcrypt** - password hashing algorithm
3. **HTTP-only cookie** - XSS protection
4. **CORS** - cross-origin resource sharing
5. **2dsphere index** - MongoDB geolocation
6. **IntersectionObserver** - lazy loading
7. **HMAC-SHA256** - payment signature
8. **Mongoose populate** - SQL JOIN equivalent
9. **Express middleware** - request processing chain
10. **React Context** - global state management

## Common Follow-up Questions:
- "Why not use X instead?" → Know trade-offs
- "What would you improve?" → Caching, microservices
- "How would you scale?" → Load balancing, read replicas
- "Security concerns?" → Input validation, rate limiting

---

*Good luck with your interview! 🚀*
