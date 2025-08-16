import React from 'react';
import { Menu, Trophy } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <div className="lg:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold flex items-center">
        <Trophy className="mr-2 h-5 w-5" />
        Tennis Tournaments
      </h1>
      <button onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Header;