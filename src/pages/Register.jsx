import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ime: '', prezime: '', email: '', telefon: '', lozinka: '', lozinka2: '' });
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska('');
    if (form.lozinka !== form.lozinka2) return setGreska('Lozinke se ne podudaraju');
    setLoading(true);
    try {
      await register({ ime: form.ime, prezime: form.prezime, email: form.email, telefon: form.telefon, lozinka: form.lozinka });
      navigate('/');
    } catch (err) {
      setGreska(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required={key !== 'telefon'}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Trophy className="mx-auto h-12 w-12 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Registracija</h1>
          <p className="text-gray-500 mt-1">Kreirajte račun i prijavite se na turnire</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {greska && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{greska}</div>}

          <div className="grid grid-cols-2 gap-4">
            {field('ime', 'Ime')}
            {field('prezime', 'Prezime')}
          </div>
          {field('email', 'Email', 'email')}
          {field('telefon', 'Telefon (opcijsko)', 'tel')}
          {field('lozinka', 'Lozinka', 'password')}
          {field('lozinka2', 'Ponovi lozinku', 'password')}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Registracija...' : 'Registriraj se'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Već imate račun?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Prijavite se</Link>
        </p>
      </div>
    </div>
  );
}
