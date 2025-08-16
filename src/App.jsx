import React, { useState, useEffect } from 'react';
import { Menu, X, Trophy, Users, Calendar, Settings, Mail, Phone, User, Plus, Check, Clock, Edit2 } from 'lucide-react';

const TennisTournamentApp = () => {
  const [currentView, setCurrentView] = useState('tournaments');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Mock data
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: 'Spring Championship 2025',
      date: '2025-04-15',
      registrationDeadline: '2025-04-10',
      category: 'Open',
      maxPlayers: 32,
      currentPlayers: 18,
      status: 'open'
    },
    {
      id: 2,
      name: 'Summer Cup',
      date: '2025-06-20',
      registrationDeadline: '2025-06-15',
      category: 'Amateur',
      maxPlayers: 16,
      currentPlayers: 12,
      status: 'open'
    }
  ]);

  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      playerName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      tournament: 'Spring Championship 2025',
      category: 'Open',
      status: 'pending'
    },
    {
      id: 2,
      playerName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      tournament: 'Spring Championship 2025',
      category: 'Open',
      status: 'approved'
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    tournamentId: ''
  });

  const handleRegistration = (e) => {
    e.preventDefault();
    const newRegistration = {
      id: registrations.length + 1,
      playerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      tournament: tournaments.find(t => t.id === parseInt(formData.tournamentId))?.name || '',
      category: formData.category,
      status: 'pending'
    };
    setRegistrations([...registrations, newRegistration]);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', category: '', tournamentId: '' });
    alert('Registration submitted! You will receive email confirmation once approved.');
  };

  const approveRegistration = (id) => {
    setRegistrations(registrations.map(reg => 
      reg.id === id ? { ...reg, status: 'approved' } : reg
    ));
  };

  const Navigation = () => (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:static lg:inset-0 z-50`}>
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white lg:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={() => setIsMenuOpen(false)}>
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
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`w-full p-2 rounded ${isAdmin ? 'bg-red-600' : 'bg-green-600'} hover:opacity-90 transition-opacity`}
          >
            {isAdmin ? 'Switch to User View' : 'Admin Login'}
          </button>
        </div>

        <ul className="space-y-2">
          <li>
            <button
              onClick={() => { setCurrentView('tournaments'); setIsMenuOpen(false); }}
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
                  onClick={() => { setCurrentView('registrations'); setIsMenuOpen(false); }}
                  className={`w-full text-left p-3 rounded flex items-center ${currentView === 'registrations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Manage Registrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('admin'); setIsMenuOpen(false); }}
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

  const TournamentCard = ({ tournament }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{tournament.name}</h3>
          <p className="text-gray-600">Category: {tournament.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          tournament.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {tournament.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <strong>Date:</strong> {new Date(tournament.date).toLocaleDateString()}
        </div>
        <div>
          <strong>Registration Deadline:</strong> {new Date(tournament.registrationDeadline).toLocaleDateString()}
        </div>
        <div>
          <strong>Players:</strong> {tournament.currentPlayers}/{tournament.maxPlayers}
        </div>
      </div>

      {!isAdmin && tournament.status === 'open' && (
        <button
          onClick={() => {
            setFormData({ ...formData, tournamentId: tournament.id.toString(), category: tournament.category });
            setCurrentView('register');
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Register for Tournament
        </button>
      )}
    </div>
  );

  const RegistrationForm = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Tournament Registration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            <option value="Open">Open</option>
            <option value="Amateur">Amateur</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setCurrentView('tournaments')}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRegistration}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );

  const ManageRegistrations = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Manage Registrations</h2>
      {registrations.map(registration => (
        <div key={registration.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{registration.playerName}</h3>
              <p className="text-gray-600">Tournament: {registration.tournament}</p>
              <p className="text-gray-600">Category: {registration.category}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-1" />
                  {registration.email}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  {registration.phone}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                registration.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : registration.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {registration.status === 'approved' && <Check className="inline h-4 w-4 mr-1" />}
                {registration.status === 'pending' && <Clock className="inline h-4 w-4 mr-1" />}
                {registration.status}
              </span>
              {registration.status === 'pending' && (
                <button
                  onClick={() => approveRegistration(registration.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AdminPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Tournaments</h3>
          <p className="text-3xl font-bold text-blue-600">{tournaments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold text-green-600">{registrations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {registrations.filter(r => r.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            New registration from John Doe for Spring Championship 2025
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Check className="h-4 w-4 mr-2 text-green-600" />
            Jane Smith registration approved
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Edit2 className="h-4 w-4 mr-2 text-blue-600" />
            Summer Cup tournament updated
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'tournaments':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Tournaments</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        );
      case 'register':
        return <RegistrationForm />;
      case 'registrations':
        return <ManageRegistrations />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Tennis Tournaments
        </h1>
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex">
        <Navigation />
        
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TennisTournamentApp;