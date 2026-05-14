import React from 'react';
import { Menu, Trophy } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="lg:hidden bg-blue-700 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <span className="font-semibold">Tenis Klub</span>
      </div>
      <button onClick={onMenuClick} aria-label="Otvori menu" className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-white">
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
