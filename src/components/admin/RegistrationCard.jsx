import React from 'react';
import { Mail, Phone, Check, Clock, X } from 'lucide-react';
import Button from '../common/Button';

const RegistrationCard = ({ registration, onApprove, onDeny }) => {
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
      case 'denied':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <X className="inline h-4 w-4 mr-1" />
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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{registration.playerName}</h3>
          <p className="text-gray-600">Tournament: {registration.tournament}</p>
          <p className="text-gray-600">Category: {registration.category}</p>
          <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} self-start sm:self-center`}>
            {statusConfig.icon}
            {registration.status}
          </span>
          {registration.status === 'pending' && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button
                variant="success"
                size="md"
                onClick={() => onApprove(registration.id)}
                className="w-full sm:w-auto"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => onDeny(registration.id)}
                className="w-full sm:w-auto"
              >
                Deny
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationCard;