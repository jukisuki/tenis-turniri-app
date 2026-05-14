import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', lozinka: '' });
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska('');
    setLoading(true);
    try {
      await login(form.email, form.lozinka);
      navigate('/');
    } catch (err) {
      setGreska(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Trophy className="mx-auto h-12 w-12 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Tenis Klub</h1>
          <p className="text-gray-500 mt-1">Prijavite se na svoj račun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {greska && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{greska}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
            <input
              type="password" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.lozinka}
              onChange={(e) => setForm({ ...form, lozinka: e.target.value })}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Prijava...' : 'Prijavi se'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Nemate račun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">Registrirajte se</Link>
        </p>
      </div>
    </div>
  );
}
