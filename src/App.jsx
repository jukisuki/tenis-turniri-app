import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import TournamentList from './components/tournaments/TournamentList';
import RegistrationForm from './components/tournaments/RegistrationForm';
import ManageRegistrations from './components/admin/ManageRegistrations';
import AdminPanel from './components/admin/AdminPanel';
import { useTournamentData } from './hooks/useTournamentData';

const TennisTournamentApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const {
    tournaments,
    registrations,
    addRegistration,
    approveRegistration
  } = useTournamentData();

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);
  const handleAdminToggle = () => setIsAdmin(!isAdmin);

  const handleTournamentRegister = (tournament, navigate) => {
    setSelectedTournament(tournament);
    navigate('/register'); // vodi na registration stranicu
  };

  const handleRegistrationSubmit = (registrationData, navigate) => {
    addRegistration(registrationData);
    setSelectedTournament(null);
    navigate('/'); // vraća na listu turnira
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header onMenuClick={handleMenuOpen} />

        <div className="flex">
          <Navigation
            isMenuOpen={isMenuOpen}
            onMenuClose={handleMenuClose}
            isAdmin={isAdmin}
            onAdminToggle={handleAdminToggle}
          />

          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={handleMenuClose}
            />
          )}

          <main className="flex-1 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <TournamentList 
                      tournaments={tournaments} 
                      isAdmin={isAdmin} 
                      onRegister={handleTournamentRegister} 
                    />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <RegistrationForm 
                      tournament={selectedTournament} 
                      onSubmit={handleRegistrationSubmit} 
                      onCancel={(navigate) => navigate('/')}
                    />
                  } 
                />
                <Route 
                  path="/registrations" 
                  element={<ManageRegistrations registrations={registrations} onApprove={approveRegistration} />} 
                />
                <Route 
                  path="/admin" 
                  element={<AdminPanel tournaments={tournaments} registrations={registrations} />} 
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};
<Routes>
  <Route 
    path="/" 
    element={<TournamentList tournaments={tournaments} isAdmin={isAdmin} setSelectedTournament={setSelectedTournament} />} 
  />
  <Route 
    path="/register" 
    element={<RegistrationForm tournament={selectedTournament} onSubmit={handleRegistrationSubmit} />} 
  />
  <Route path="/registrations" element={<ManageRegistrations registrations={registrations} onApprove={approveRegistration} />} />
  <Route path="/admin" element={<AdminPanel tournaments={tournaments} registrations={registrations} />} />
</Routes>


export default TennisTournamentApp;