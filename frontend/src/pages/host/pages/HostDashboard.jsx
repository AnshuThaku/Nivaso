import { LayoutDashboard, Users, Home, CalendarCheck, TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
        <Icon size={24} />
      </div>
      <span className="text-sm font-medium text-green-600">{trend}</span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const HostDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here is what's happening with your listings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" value="₹4,25,000" icon={TrendingUp} trend="+12.5%" />
        <StatCard title="Active Bookings" value="14" icon={CalendarCheck} trend="+3 this week" />
        <StatCard title="Total Listings" value="8" icon={Home} trend="0 new" />
        <StatCard title="Guest Reviews" value="128" icon={Users} trend="4.8/5 avg" />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-100">
                <th className="pb-3 font-medium">Guest</th>
                <th className="pb-3 font-medium">Listing</th>
                <th className="pb-3 font-medium">Dates</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-50">
                <td className="py-4 font-medium">Aarav Sharma</td>
                <td className="py-4 text-gray-600">Sea View Villa</td>
                <td className="py-4 text-gray-600">July 02 - July 05</td>
                <td className="py-4 text-green-600 font-medium">Confirmed</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 font-medium">Priya Singh</td>
                <td className="py-4 text-gray-600">Mountain Cabin</td>
                <td className="py-4 text-gray-600">July 10 - July 12</td>
                <td className="py-4 text-yellow-600 font-medium">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;