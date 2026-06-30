import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react"; // Import Menu icon
import HostSidebar from "../components/HostSidebar";

const HostLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Mobile par ye drawer ki tarah kaam karega */}
      <HostSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Right side content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* MOBILE HEADER - Yahi toggle button hai */}
        <header className="lg:hidden flex items-center p-4 bg-white border-b border-gray-100">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-gray-800">Nivaso Host</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HostLayout;