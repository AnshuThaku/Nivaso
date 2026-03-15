import { createContext, useContext, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg text-white transition-all duration-300 pointer-events-auto ${
              notification.type === "success"
                ? "bg-gray-900"
                : notification.type === "error"
                ? "bg-rose-600"
                : "bg-blue-600"
            }`}
          >
            <div className="flex items-center gap-3">
                {notification.type === "success" && <FaCheckCircle className="text-green-400" />}
                {notification.type === "error" && <FaExclamationCircle />}
                {notification.type === "info" && <FaInfoCircle />}
                <span className="font-medium text-sm">{notification.message}</span>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <IoClose />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
