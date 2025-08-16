import React from 'react';
import RegistrationCard from './RegistrationCard';

const ManageRegistrations = ({ registrations, onApprove }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Manage Registrations</h2>
      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No registrations yet.</p>
        </div>
      ) : (
        registrations.map(registration => (
          <RegistrationCard
            key={registration.id}
            registration={registration}
            onApprove={onApprove}
          />
        ))
      )}
    </div>
  );
};

export default ManageRegistrations;