import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export default function AdminIgraci() {
  const [igraci, setIgraci] = useState([]);
  const [loading, setLoading] = useState(true);

  const ucitaj = () => {
    setLoading(true);
    api.get('/igraci').then(setIgraci).finally(() => setLoading(false));
  };

  useEffect(() => { ucitaj(); }, []);

  const obrisi = async (id, ime) => {
    if (!confirm(`Obrisati igrača ${ime}? Ova akcija će obrisati sve podatke vezane uz igrača.`)) return;
    await api.delete(`/igraci/${id}`);
    ucitaj();
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Učitavanje...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Igrači ({igraci.length})</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 border-b">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Igrač</div>
          <div className="col-span-3 text-center">ELO</div>
          <div className="col-span-3 text-right">Akcije</div>
        </div>

        {igraci.map((igrac, i) => (
          <div key={igrac.id} className="grid grid-cols-12 px-4 py-3 border-b last:border-0 items-center hover:bg-gray-50">
            <div className="col-span-1 text-gray-500 text-sm">{i + 1}</div>
            <div className="col-span-5">
              <Link to={`/igraci/${igrac.id}`} className="font-medium text-gray-800 hover:text-blue-600">
                {igrac.ime} {igrac.prezime}
              </Link>
            </div>
            <div className="col-span-3 text-center font-bold text-blue-700">{igrac.rejting}</div>
            <div className="col-span-3 text-right">
              <button onClick={() => obrisi(igrac.id, `${igrac.ime} ${igrac.prezime}`)}
                className="text-red-500 text-sm hover:underline">Obriši</button>
            </div>
          </div>
        ))}

        {igraci.length === 0 && <div className="text-center py-10 text-gray-500">Nema registriranih igrača.</div>}
      </div>
    </div>
  );
}
