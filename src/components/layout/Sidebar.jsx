import React from 'react';
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
  Moon,
  Sun,
  Home,
  Gift
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/Button';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/branches', icon: <Building className="w-5 h-5" />, label: 'Branches' },
    { path: '/customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
    { path: '/services', icon: <Settings className="w-5 h-5" />, label: 'Services' },
    { path: '/employees', icon: <User className="w-5 h-5" />, label: 'Employees' },
    { path: '/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Bookings' },
    { path: '/awards', icon: <Award className="w-5 h-5" />, label: 'Awards' },
    { path: '/gift-cards', icon: <Gift className="w-5 h-5" />, label: 'Gift Cards' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Shalom Therapy</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-300 hover:text-white p-1 rounded-md hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-gray-700 text-white border-r-4 border-blue-500'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;