import { useState } from 'react';

export const useTournamentData = () => {
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

  const addRegistration = (newRegistration) => {
    const registration = {
      id: registrations.length + 1,
      ...newRegistration,
      status: 'pending'
    };
    setRegistrations([...registrations, registration]);
  };

  const approveRegistration = (id) => {
    setRegistrations(registrations.map(reg => 
      reg.id === id ? { ...reg, status: 'approved' } : reg
    ));
  };

  return {
    tournaments,
    registrations,
    addRegistration,
    approveRegistration
  };
};