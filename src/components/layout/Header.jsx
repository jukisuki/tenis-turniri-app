import React from 'react';
import { Menu, Trophy } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Logo / naziv aplikacije */}
      <h1 className="text-lg font-semibold flex items-center">
        <Trophy className="mr-2 h-5 w-5" />
        Tennis Tournaments
      </h1>

      {/* Hamburger / menu toggle */}
      <button
        onClick={onMenuClick}
        className="focus:outline-none focus:ring-2 focus:ring-white rounded"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;
