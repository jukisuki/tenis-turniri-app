import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { api } from '../api/client';

function VijestDetalji({ id }) {
  const [vijest, setVijest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/vijesti/${id}`).then(setVijest).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;
  if (!vijest) return <div className="text-center py-20 text-gray-500">Vijest nije pronađena.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/vijesti" className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Natrag na vijesti
      </Link>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{vijest.naslov}</h2>
        <p className="text-sm text-gray-400 mb-6">
          Objavio {vijest.autor.ime} {vijest.autor.prezime} — {new Date(vijest.createdAt).toLocaleDateString('hr-HR')}
        </p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{vijest.sadrzaj}</div>
      </div>
    </div>
  );
}

export default function Vijesti() {
  const { id } = useParams();
  const [vijesti, setVijesti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) api.get('/vijesti').then(setVijesti).finally(() => setLoading(false));
  }, [id]);

  if (id) return <VijestDetalji id={id} />;
  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Newspaper className="h-7 w-7 text-blue-500" /> Vijesti kluba
      </h2>

      {vijesti.length === 0 && <p className="text-center py-20 text-gray-500">Nema objavljenih vijesti.</p>}

      <div className="space-y-4 max-w-2xl">
        {vijesti.map((v) => (
          <Link key={v.id} to={`/vijesti/${v.id}`} className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800 text-lg mb-1">{v.naslov}</h3>
            <p className="text-sm text-gray-400 mb-2">
              {v.autor.ime} {v.autor.prezime} — {new Date(v.createdAt).toLocaleDateString('hr-HR')}
            </p>
            <p className="text-gray-600 text-sm line-clamp-2">{v.sadrzaj}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
