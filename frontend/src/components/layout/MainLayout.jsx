import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;