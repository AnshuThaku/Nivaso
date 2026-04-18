import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// 👇 1. Import SearchProvider for Global Search Context
import { SearchProvider } from "./context/SearchContext"; 

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home/Home"; // 🔥 FIXED: Home page imported
import Listings from "./pages/Listing/Listings";
import ShowListing from "./pages/Listing/ShowListing";
import NewListing from "./pages/Listing/NewListing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/error/NotFound";
import EditListing from "./pages/Listing/Editlisting";
import ProfilePage from "./pages/Profile/ProfilePage";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import BookingCard from "./components/Listing/BookingCard";
import MyTrips from "./pages/Mytrip";
import { Scroll } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <ScrollToTop /> {/* 🚀 Scroll to top on route change */}
            <Routes location={location} key={location.pathname}>
                {/* 🔥 FIXED: Home page mapped to "/" */}
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                
                <Route path="/listings" element={<PageTransition><Listings /></PageTransition>} />
                <Route path="/listings/new" element={<PageTransition><NewListing /></PageTransition>} />
                <Route path="/listings/:id" element={<PageTransition><ShowListing /></PageTransition>} />
                <Route path="/bookings" element={<PageTransition><BookingCard /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                <Route path="/listings/:id/edit" element={<PageTransition><EditListing /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><ProfilePage/></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/reset-password/:token" element={<PageTransition><ResetPassword/></PageTransition>} />
                <Route path="/my-trips" element={<PageTransition><MyTrips /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

function App() {
  return (
      // 👇 2. Wrapped the entire layout inside SearchProvider
      <SearchProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
      </SearchProvider>
  );
}

export default App;