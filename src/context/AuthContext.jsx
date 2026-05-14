import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [korisnik, setKorisnik] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(setKorisnik)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, lozinka) => {
    const { token, korisnik } = await api.post('/auth/login', { email, lozinka });
    localStorage.setItem('token', token);
    setKorisnik(korisnik);
    return korisnik;
  };

  const register = async (podaci) => {
    const { token, korisnik } = await api.post('/auth/register', podaci);
    localStorage.setItem('token', token);
    setKorisnik(korisnik);
    return korisnik;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setKorisnik(null);
  };

  return (
    <AuthContext.Provider value={{ korisnik, loading, login, register, logout, isAdmin: korisnik?.uloga === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
