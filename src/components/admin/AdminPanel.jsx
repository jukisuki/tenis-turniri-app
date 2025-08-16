import React from 'react';
import { Plus, User, Check, Edit2 } from 'lucide-react';
import Button from '../common/Button';

const AdminPanel = ({ tournaments, registrations }) => {
  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
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
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
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
};

export default AdminPanel;