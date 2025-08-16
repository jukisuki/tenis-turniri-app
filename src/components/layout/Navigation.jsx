import React from 'react';
import { X, Trophy, Calendar, Users, Settings } from 'lucide-react';
import Button from '../common/Button';

const Navigation = ({ 
  isMenuOpen, 
  onMenuClose, 
  isAdmin, 
  onAdminToggle, 
  currentView, 
  onViewChange 
}) => {
  const handleViewChange = (view) => {
    onViewChange(view);
    onMenuClose();
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:static lg:inset-0 z-50`}>
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white lg:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onMenuClose}>
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="h-full bg-gray-800 text-white p-4 w-64">
        <div className="hidden lg:block mb-8">
          <h1 className="text-xl font-bold flex items-center">
            <Trophy className="mr-2" />
            Tennis Tournaments
          </h1>
        </div>
        
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
            <button
              onClick={() => handleViewChange('tournaments')}
              className={`w-full text-left p-3 rounded flex items-center ${currentView === 'tournaments' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Tournaments
            </button>
          </li>
          {isAdmin && (
            <>
              <li>
                <button
                  onClick={() => handleViewChange('registrations')}
                  className={`w-full text-left p-3 rounded flex items-center ${currentView === 'registrations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Manage Registrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewChange('admin')}
                  className={`w-full text-left p-3 rounded flex items-center ${currentView === 'admin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Admin Panel
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;