import React from 'react';
import { Menu, User, Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-blue-600 shadow-sm border-b border-blue-500">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-blue-100 hover:text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="ml-4 text-xl font-semibold text-white lg:ml-0">
              Therapy Management System
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search bar - optional addition */}
            <div className="hidden md:flex items-center px-3 py-1 rounded-md bg-blue-500 text-blue-100">
              <Search className="w-4 h-4 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent focus:outline-none placeholder-blue-200 text-sm w-40"
              />
            </div>

            {/* Notifications - optional addition */}
            <button className="relative p-1 text-blue-100 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-white">
                {user?.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;