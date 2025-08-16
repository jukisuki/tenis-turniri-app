import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Trophy, Calendar, Users, Settings } from 'lucide-react';
import Button from '../common/Button';

const Navigation = ({ 
  isMenuOpen, 
  onMenuClose, 
  isAdmin, 
  onAdminToggle 
}) => {
  const location = useLocation(); // da znamo koja ruta je aktivna

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:static lg:inset-0 z-50`}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white lg:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onMenuClose}>
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="h-full bg-gray-800 text-white p-4 w-64">
        {/* Desktop Logo */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-xl font-bold flex items-center">
            <Trophy className="mr-2" />
            Tennis Tournaments
          </h1>
        </div>
        
        {/* Admin Toggle */}
        <div className="mb-6">
          <Button
            onClick={onAdminToggle}
            variant={isAdmin ? 'danger' : 'success'}
            className="w-full"
          >
            {isAdmin ? 'Switch to User View' : 'Admin Login'}
          </Button>
        </div>

        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              onClick={onMenuClose}
              className={`w-full text-left p-3 rounded flex items-center ${isActive('/') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Tournaments
            </Link>
          </li>

          {isAdmin && (
            <>
              <li>
                <Link
                  to="/registrations"
                  onClick={onMenuClose}
                  className={`w-full text-left p-3 rounded flex items-center ${isActive('/registrations') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Manage Registrations
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  onClick={onMenuClose}
                  className={`w-full text-left p-3 rounded flex items-center ${isActive('/admin') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Admin Panel
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
