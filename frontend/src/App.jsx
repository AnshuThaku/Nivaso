import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import Listings from "./pages/Listing/Listings";
import ShowListing from "./pages/Listing/ShowListing";
import NewListing from "./pages/Listing/NewListing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/error/NotFound";
import { AnimatePresence, motion } from "framer-motion";
import EditListing from "./pages/Listing/Editlisting";
import ProfilePage from "./pages/Profile/ProfilePage";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <PageTransition>
                            <Listings />
                        </PageTransition>
                    }
                />
                <Route
                    path="/listings"
                    element={
                        <PageTransition>
                            <Listings />
                        </PageTransition>
                    }
                />
                <Route
                    path="/listings/new"
                    element={
                        <PageTransition>
                            <NewListing />
                        </PageTransition>
                    }
                />
                <Route
                    path="/listings/:id"
                    element={
                        <PageTransition>
                            <ShowListing />
                        </PageTransition>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PageTransition>
                            <Login />
                        </PageTransition>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PageTransition>
                            <Signup />
                        </PageTransition>
                    }
                />
                <Route
                    path="/listings/:id/edit"
                    element={
                        <PageTransition>
                            <EditListing />
                        </PageTransition>
                    }
                />   <Route path="/profile" element={
                    <PageTransition>
                        <ProfilePage/>
                    </PageTransition>
                } />
                <Route
                    path="*"
                    element={
                         <PageTransition>
                            <NotFound />
                        </PageTransition>
                    }
                />
                <Route path="/forgot-password" element={
                    <PageTransition>
                        <ForgotPassword />
                    </PageTransition>
                } />
                <Route path="/reset-password/:token" element={
                    <PageTransition>
                       <ResetPassword/>
                    </PageTransition>
                } />
               
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
  );
}

export default App;
