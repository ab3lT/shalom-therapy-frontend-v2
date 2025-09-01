import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Settings, 
  Award, 
  Users, 
  Building, 
  Clock,
  CheckCircle,
  Home,
  Gift,
  Sparkles
} from 'lucide-react';
import Card from "../common/Card";
import { api } from "../../services/api";

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
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'Total Branches',
      value: stats.totalBranches,
      icon: <Building className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500'
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500'
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-blue-700">Here's what's happening at Shalom Therapy today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-l-4 backdrop-blur-sm bg-white/70`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">{stat.title}</p>
                <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions" className="backdrop-blur-sm bg-white/70">
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/bookings"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600">New Booking</span>
            </Link>
            <Link
              to="/customers"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600">Add Customer</span>
            </Link>
            <Link
              to="/services"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Settings className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600">Manage Services</span>
            </Link>
            <Link
              to="/gift-cards"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Gift className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600">Gift Cards</span>
            </Link>
          </div>
        </Card>

        <Card title="Recent Activity" className="backdrop-blur-sm bg-white/70">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-900">New customer registered</p>
                <p className="text-xs text-blue-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-900">Booking scheduled</p>
                <p className="text-xs text-blue-600">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Gift className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-900">Gift card purchased</p>
                <p className="text-xs text-blue-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Welcome Message with Blue Theme */}
      <Card className="mt-8 backdrop-blur-sm bg-white/70 border border-blue-200">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-blue-900">Welcome to Shalom Therapy</h3>
            <p className="text-blue-700">
              Manage your therapy business efficiently with our comprehensive dashboard.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Dashboard;