import { 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  CalendarCheck, 
  Banknote, 
  Star, 
  Bell, 
  User, 
  LogOut,
  X
} from "lucide-react";
import SidebarItem from "./SidebarItem";

const HostSidebar = ({ isOpen, onClose }) => {
  const topMenu = [
    { to: "/host", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/host/listings", icon: Home, label: "My Listings" },
    { to: "/host/add-listing", icon: PlusCircle, label: "Add Listing" },
    { to: "/host/bookings", icon: CalendarCheck, label: "Bookings" },
    { to: "/host/revenue", icon: Banknote, label: "Revenue" },
    { to: "/host/reviews", icon: Star, label: "Reviews" },
    { to: "/host/notifications", icon: Bell, label: "Notifications" },
  ];

  const bottomMenu = [
    { to: "/host/profile", icon: User, label: "Profile" },
    { to: "/logout", icon: LogOut, label: "Logout" },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] rounded-r-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-bold text-gray-800 tracking-tight text-lg">Nivaso Host</span>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
          {topMenu.map((item) => (
            <SidebarItem 
              key={item.label} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              end={item.end}
              onClick={onClose} 
            />
          ))}
        </div>

        {/* Bottom Navigation Links */}
        <div className="p-4 border-t border-gray-100 space-y-1.5">
          {bottomMenu.map((item) => (
            <SidebarItem 
              key={item.label} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              onClick={onClose} 
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default HostSidebar;