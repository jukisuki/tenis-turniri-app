import React from 'react';
import { Mail, Phone, Check, Clock } from 'lucide-react';
import Button from '../common/Button';

const RegistrationCard = ({ registration, onApprove }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <Check className="inline h-4 w-4 mr-1" />
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <Clock className="inline h-4 w-4 mr-1" />
        };
      default:
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig(registration.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
            {statusConfig.icon}
            {registration.status}
          </span>
          {registration.status === 'pending' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(registration.id)}
            >
              Approve
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationCard;