import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Listings from "./pages/Listings";
import ShowListing from "./pages/ShowListing";
import NewListing from "./pages/NewListing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/error/NotFound";
import { AnimatePresence, motion } from "framer-motion";
import EditListing from "./pages/Editlisting";

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
                />  
                <Route
                    path="*"
                    element={
                         <PageTransition>
                            <NotFound />
                        </PageTransition>
                    }
                />
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
