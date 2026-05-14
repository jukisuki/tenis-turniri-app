import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Trophy, Calendar, Users, Settings, Newspaper, Swords, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navigation({ isMenuOpen, onMenuClose }) {
  const location = useLocation();
  const { korisnik, isAdmin, logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  const NavLink = ({ to, icon: Icon, label }) => (
    <li>
      <Link to={to} onClick={onMenuClose}
        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${isActive(to) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </Link>
    </li>
  );

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:static lg:inset-0 z-50`}>
      <div className="flex items-center justify-between p-4 bg-blue-700 text-white lg:hidden">
        <span className="font-semibold">Menu</span>
        <button onClick={onMenuClose}><X className="h-5 w-5" /></button>
      </div>

      <nav className="h-full bg-gray-800 text-white p-4 w-64 flex flex-col">
        <div className="hidden lg:flex items-center gap-2 mb-8 px-1">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <span className="text-lg font-bold">Tenis Klub</span>
        </div>

        {korisnik && (
          <div className="mb-4 px-3 py-2.5 bg-gray-700 rounded-lg">
            <div className="text-sm font-medium">{korisnik.ime} {korisnik.prezime}</div>
            <div className="text-xs text-gray-400">{korisnik.rejting} ELO · {isAdmin ? 'Admin' : 'Igrač'}</div>
          </div>
        )}

        <ul className="space-y-1 flex-1">
          <NavLink to="/turniri" icon={Calendar} label="Turniri" />
          <NavLink to="/rejting" icon={Trophy} label="Ljestvica" />
          <NavLink to="/mecevi" icon={Swords} label="Mečevi" />
          <NavLink to="/vijesti" icon={Newspaper} label="Vijesti" />

          {isAdmin && (
            <>
              <li className="pt-4 pb-1">
                <span className="text-xs uppercase text-gray-500 px-3 font-medium">Admin</span>
              </li>
              <NavLink to="/admin/prijave" icon={Users} label="Prijave" />
              <NavLink to="/admin/turniri" icon={Calendar} label="Turniri (admin)" />
              <NavLink to="/admin/mecevi" icon={Swords} label="Mečevi (admin)" />
              <NavLink to="/admin/igraci" icon={Users} label="Igrači" />
              <NavLink to="/admin/vijesti" icon={Newspaper} label="Vijesti (admin)" />
            </>
          )}
        </ul>

        <div className="pt-4 border-t border-gray-700">
          {korisnik ? (
            <button onClick={() => { logout(); onMenuClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" /> Odjava
            </button>
          ) : (
            <Link to="/login" onClick={onMenuClose}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              <LogIn className="h-4 w-4" /> Prijava
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
