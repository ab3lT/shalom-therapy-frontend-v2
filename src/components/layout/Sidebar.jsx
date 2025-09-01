import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Settings, 
  Award, 
  Users, 
  Building, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Home,
  Gift,
  Sparkles
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
          className="fixed inset-0 bg-blue-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-blue-900 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold">Shalom Therapy</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-blue-100 hover:text-white p-1 rounded-md hover:bg-blue-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-0">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-600'
                  : 'text-blue-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">{user?.username}</p>
                <p className="text-xs text-blue-600 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-100"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700"
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