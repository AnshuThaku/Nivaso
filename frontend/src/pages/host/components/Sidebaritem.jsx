import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, icon: Icon, label, onClick, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-rose-600 text-white shadow-md shadow-rose-200"
            : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
        }`
      }
    >
      <Icon
        className={`w-5 h-5 transition-colors duration-200 ${
          // If you want the icon to adopt the text color automatically, 
          // currentColor handles it. We just ensure it's sized correctly.
          "" 
        }`}
      />
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </NavLink>
  );
};

export default SidebarItem;