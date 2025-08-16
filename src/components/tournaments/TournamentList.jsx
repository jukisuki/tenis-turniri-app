import React from 'react';
import TournamentCard from './TournamentCard';

const TournamentList = ({ tournaments = [], isAdmin = false, onRegister }) => {
  if (tournaments.length === 0) return <p className="text-center py-20 text-gray-500">No tournaments available</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Tournaments</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map(tournament => (
          <TournamentCard 
            key={tournament.id} 
            tournament={tournament} 
            isAdmin={isAdmin} 
            onRegister={onRegister} 
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentList;