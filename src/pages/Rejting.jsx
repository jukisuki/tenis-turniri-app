import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp } from 'lucide-react';
import { api } from '../api/client';

const medalja = (i) => {
  if (i === 0) return '🥇';
  if (i === 1) return '🥈';
  if (i === 2) return '🥉';
  return `${i + 1}.`;
};

export default function Rejting() {
  const [igraci, setIgraci] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/igraci').then(setIgraci).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Trophy className="h-7 w-7 text-yellow-500" /> Ljestvica igrača
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 border-b">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Igrač</div>
          <div className="col-span-4 text-right">ELO rejting</div>
        </div>

        {igraci.map((igrac, i) => (
          <div key={igrac.id} className={`grid grid-cols-12 px-6 py-4 border-b last:border-0 items-center hover:bg-gray-50 ${i < 3 ? 'bg-yellow-50/30' : ''}`}>
            <div className="col-span-1 text-lg">{medalja(i)}</div>
            <div className="col-span-7">
              <Link to={`/igraci/${igrac.id}`} className="font-medium text-gray-800 hover:text-blue-600">
                {igrac.ime} {igrac.prezime}
              </Link>
            </div>
            <div className="col-span-4 text-right">
              <span className="font-bold text-blue-700 text-lg">{igrac.rejting}</span>
              <TrendingUp className="inline ml-1 h-4 w-4 text-green-500" />
            </div>
          </div>
        ))}

        {igraci.length === 0 && (
          <div className="text-center py-12 text-gray-500">Nema registriranih igrača.</div>
        )}
      </div>
    </div>
  );
}
