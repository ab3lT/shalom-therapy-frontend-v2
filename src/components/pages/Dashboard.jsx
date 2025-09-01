import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Settings, 
  Award, 
  Users, 
  Building, 
  CreditCard,
  BookOpen,
  LogOut,
  Menu,
  X,
  Clock,
  CheckCircle ,
  Home,
  Gift
} from 'lucide-react';
import Card from "../common/Card";
// import { Link } from "react-router-dom";
// import Link
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalBranches: 0,
    todayBookings: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load dashboard statistics
      const [customers, bookings, branches, todayBookings] = await Promise.all([
        api.getCustomers(),
        api.getAllBookings(),
        api.getBranches(),
        api.getTodayBookings()
      ]);

      setStats({
        totalCustomers: customers?.length || 0,
        totalBookings: bookings?.length || 0,
        totalBranches: branches?.length || 0,
        todayBookings: todayBookings?.length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const statsCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Branches',
      value: stats.totalBranches,
      icon: <Building className="w-8 h-8 text-purple-600" />,
      bgColor: 'bg-purple-50'
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">Here's what's happening at Shalom Therapy today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-l-4 border-l-blue-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/bookings"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600">New Booking</span>
            </Link>
            <Link
              to="/customers"
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-600">Add Customer</span>
            </Link>
            <Link
              to="/services"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Settings className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-600">Manage Services</span>
            </Link>
            <Link
              to="/gift-cards"
              className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Gift className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-600">Gift Cards</span>
            </Link>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Booking scheduled</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Gift className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Gift card purchased</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;