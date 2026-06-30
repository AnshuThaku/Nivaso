import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Context
import { SearchProvider } from "./context/SearchContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import HostLayout from "./pages/host/pages/HostLayout";

// Public Pages
import Home from "./pages/Home/Home";
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

// Host Pages
import HostDashboard from "./pages/host/pages/HostDashboard";
import MyListing from "./pages/host/pages/MyListing";
import AddListing from "./pages/host/pages/AddListing";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* 1. Public Routes (With Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/listings" element={<PageTransition><Listings /></PageTransition>} />
          <Route path="/listings/new" element={<PageTransition><NewListing /></PageTransition>} />
          <Route path="/listings/:id" element={<PageTransition><ShowListing /></PageTransition>} />
          <Route path="/bookings" element={<PageTransition><BookingCard /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/listings/:id/edit" element={<PageTransition><EditListing /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/mytrips" element={<PageTransition><MyTrips /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Route>

        {/* 2. Host Routes (Clean, No Navbar/Footer) */}
        <Route path="/host" element={<HostLayout />}>
          <Route index element={<PageTransition><HostDashboard /></PageTransition>} />
          <Route path="listings" element={<PageTransition><MyListing /></PageTransition>} />
          <Route path="add-listing" element={<PageTransition><AddListing /></PageTransition>} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <SearchProvider>
      <AnimatedRoutes />
    </SearchProvider>
  );
}

export default App;