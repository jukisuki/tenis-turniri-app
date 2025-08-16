import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';

const TournamentCard = ({ tournament, isAdmin, setSelectedTournament }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    setSelectedTournament(tournament); // spremi turnir u parent state
    navigate('/register'); // vodi na registration stranicu
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{tournament.name}</h3>
          <p className="text-gray-600">Category: {tournament.category}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            tournament.status === 'open'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {tournament.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
        <div>
          <strong>Date:</strong> {formatDate(tournament.date)}
        </div>
        <div>
          <strong>Registration Deadline:</strong> {formatDate(tournament.registrationDeadline)}
        </div>
        <div>
          <strong>Players:</strong> {tournament.currentPlayers}/{tournament.maxPlayers}
        </div>
      </div>

      {!isAdmin && tournament.status === 'open' && (
        <Button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Register for Tournament
        </Button>
      )}
    </div>
  );
};

export default TournamentCard;