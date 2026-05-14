import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/layout/Navigation';
import Header from './components/layout/Header';
import { useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Turniri from './pages/Turniri';
import TurnirDetalji from './pages/TurnirDetalji';
import Rejting from './pages/Rejting';
import Mecevi from './pages/Mecevi';
import ProfilIgraca from './pages/ProfilIgraca';
import Vijesti from './pages/Vijesti';
import AdminPrijave from './pages/admin/AdminPrijave';
import AdminTurniri from './pages/admin/AdminTurniri';
import AdminMecevi from './pages/admin/AdminMecevi';
import AdminVijesti from './pages/admin/AdminVijesti';
import AdminIgraci from './pages/admin/AdminIgraci';

function AdminRoute({ children }) {
  const { korisnik, loading } = useAuth();
  if (loading) return null;
  if (!korisnik || korisnik.uloga !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { korisnik, loading } = useAuth();
  if (loading) return null;
  if (!korisnik) return <Navigate to="/login" replace />;
  return children;
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <div className="flex">
        <Navigation isMenuOpen={menuOpen} onMenuClose={() => setMenuOpen(false)} />
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
        )}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/turniri" replace />} />
              <Route path="/turniri" element={<Turniri />} />
              <Route path="/turniri/:id" element={<TurnirDetalji />} />
              <Route path="/rejting" element={<Rejting />} />
              <Route path="/mecevi" element={<Mecevi />} />
              <Route path="/igraci/:id" element={<ProfilIgraca />} />
              <Route path="/vijesti" element={<Vijesti />} />
              <Route path="/vijesti/:id" element={<Vijesti />} />

              <Route path="/admin/prijave" element={<AdminRoute><AdminPrijave /></AdminRoute>} />
              <Route path="/admin/turniri" element={<AdminRoute><AdminTurniri /></AdminRoute>} />
              <Route path="/admin/mecevi" element={<AdminRoute><AdminMecevi /></AdminRoute>} />
              <Route path="/admin/vijesti" element={<AdminRoute><AdminVijesti /></AdminRoute>} />
              <Route path="/admin/igraci" element={<AdminRoute><AdminIgraci /></AdminRoute>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </AuthProvider>
  );
}
