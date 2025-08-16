import React, { useState } from 'react';
import Button from '../common/Button';

const RegistrationForm = ({ tournament, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: tournament?.category || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const registrationData = {
      playerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      tournament: tournament?.name || '',
      category: formData.category
    };

    onSubmit(registrationData);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      category: ''
    });
    
    alert('Registration submitted! You will receive email confirmation once approved.');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Tournament Registration</h2>
      {tournament && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="font-semibold">{tournament.name}</p>
          <p className="text-sm text-gray-600">Category: {tournament.category}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
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
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;