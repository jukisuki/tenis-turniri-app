import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, ChevronRight } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const statusBadge = { OTVOREN: 'bg-green-100 text-green-800', ZATVOREN: 'bg-yellow-100 text-yellow-800', ZAVRSEN: 'bg-gray-100 text-gray-600', DRAFT: 'bg-blue-100 text-blue-800' };
const statusLabel = { OTVOREN: 'Otvoren', ZATVOREN: 'Zatvoren', ZAVRSEN: 'Završen', DRAFT: 'U pripremi' };

export default function Turniri() {
  const { korisnik } = useAuth();
  const [turniri, setTurniri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prijavljujem, setPrijavljujem] = useState(null);
  const [poruka, setPoruka] = useState('');

  useEffect(() => {
    api.get('/turniri').then(setTurniri).finally(() => setLoading(false));
  }, []);

  const prijaviSe = async (turnirId) => {
    setPrijavljujem(turnirId);
    setPoruka('');
    try {
      await api.post('/prijave', { turnirId });
      setPoruka('Uspješno ste se prijavili! Admin će potvrditi vašu prijavu.');
    } catch (err) {
      setPoruka(err.message);
    } finally {
      setPrijavljujem(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Turniri</h2>

      {poruka && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${poruka.includes('Uspješno') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
          {poruka}
        </div>
      )}

      {turniri.length === 0 && <p className="text-center py-20 text-gray-500">Trenutno nema dostupnih turnira.</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {turniri.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg leading-tight">{t.naziv}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ml-2 shrink-0 ${statusBadge[t.status]}`}>
                {statusLabel[t.status]}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{new Date(t.datum).toLocaleDateString('hr-HR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Rok prijave: {new Date(t.rokPrijave).toLocaleDateString('hr-HR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>{t._count?.prijave ?? 0} / {t.maxIgraca} igrača</span>
              </div>
              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full inline-block">{t.kategorija}</div>
            </div>

            <div className="flex gap-2">
              <Link to={`/turniri/${t.id}`} className="flex-1 text-center text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
                Detalji <ChevronRight className="h-4 w-4" />
              </Link>
              {korisnik && t.status === 'OTVOREN' && new Date() <= new Date(t.rokPrijave) && (
                <button
                  onClick={() => prijaviSe(t.id)}
                  disabled={prijavljujem === t.id}
                  className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {prijavljujem === t.id ? 'Prijava...' : 'Prijavi se'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
