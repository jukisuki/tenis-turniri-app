import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Mecevi() {
  const [mecevi, setMecevi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/mecevi').then(setMecevi).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Povijest mečeva</h2>

      {mecevi.length === 0 && <p className="text-center py-20 text-gray-500">Nema odigranih mečeva.</p>}

      <div className="space-y-3">
        {mecevi.map((m) => (
          <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 text-sm">
                <Link to={`/igraci/${m.igrac1.id}`} className={`font-medium hover:underline ${m.pobjednikId === m.igrac1.id ? 'text-green-700' : 'text-gray-700'}`}>
                  {m.igrac1.ime} {m.igrac1.prezime}
                  <span className="ml-1 text-xs text-gray-400">({m.igrac1.rejting})</span>
                </Link>
                <span className="text-gray-400 font-bold">vs</span>
                <Link to={`/igraci/${m.igrac2.id}`} className={`font-medium hover:underline ${m.pobjednikId === m.igrac2.id ? 'text-green-700' : 'text-gray-700'}`}>
                  {m.igrac2.ime} {m.igrac2.prezime}
                  <span className="ml-1 text-xs text-gray-400">({m.igrac2.rejting})</span>
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm">
                {m.rezultat && <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{m.rezultat}</span>}
                {m.turnir && (
                  <Link to={`/turniri/${m.turnir.id}`} className="text-xs text-blue-600 hover:underline">{m.turnir.naziv}</Link>
                )}
                {m.datum && <span className="text-xs text-gray-400">{new Date(m.datum).toLocaleDateString('hr-HR')}</span>}
              </div>
            </div>

            {m.pobjednik && (
              <div className="mt-2 text-xs text-green-700 font-medium">
                Pobjednik: {m.pobjednik.ime} {m.pobjednik.prezime}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
