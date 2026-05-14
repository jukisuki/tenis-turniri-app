import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilIgraca() {
  const { id } = useParams();
  const { korisnik } = useAuth();
  const [igrac, setIgrac] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/igraci/${id}`).then(setIgrac).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;
  if (!igrac) return <div className="text-center py-20 text-gray-500">Igrač nije pronađen.</div>;

  const sviMecevi = [
    ...igrac.mecheviKaoIgrac1.map((m) => ({ ...m, protivnik: m.igrac2, pobjeda: m.pobjednikId === igrac.id })),
    ...igrac.mecheviKaoIgrac2.map((m) => ({ ...m, protivnik: m.igrac1, pobjeda: m.pobjednikId === igrac.id })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);

  const pobjede = sviMecevi.filter((m) => m.pobjeda).length;
  const porazi = sviMecevi.filter((m) => m.pobjednikId && !m.pobjeda).length;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/rejting" className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Natrag na ljestvicu
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{igrac.ime} {igrac.prezime}</h2>
            {korisnik?.id === igrac.id && <p className="text-sm text-gray-500 mt-0.5">{igrac.email}</p>}
            {igrac.telefon && korisnik?.id === igrac.id && <p className="text-sm text-gray-500">{igrac.telefon}</p>}
          </div>
          <div className="text-center bg-blue-50 px-5 py-3 rounded-xl">
            <div className="text-3xl font-bold text-blue-700">{igrac.rejting}</div>
            <div className="text-xs text-gray-500">ELO rejting</div>
          </div>
        </div>

        <div className="mt-4 flex gap-6 text-sm">
          <div className="text-center"><div className="text-xl font-bold text-green-600">{pobjede}</div><div className="text-gray-500">Pobjede</div></div>
          <div className="text-center"><div className="text-xl font-bold text-red-500">{porazi}</div><div className="text-gray-500">Porazi</div></div>
          <div className="text-center"><div className="text-xl font-bold text-gray-800">{sviMecevi.filter(m => m.pobjednikId).length}</div><div className="text-gray-500">Ukupno</div></div>
        </div>
      </div>

      {sviMecevi.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Zadnji mečevi</h3>
          <div className="space-y-3">
            {sviMecevi.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3 text-sm">
                  {m.pobjednikId ? (
                    m.pobjeda
                      ? <TrendingUp className="h-4 w-4 text-green-600 shrink-0" />
                      : <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                  ) : <div className="w-4" />}
                  <span>vs </span>
                  <Link to={`/igraci/${m.protivnik.id}`} className="text-blue-600 hover:underline font-medium">
                    {m.protivnik.ime} {m.protivnik.prezime}
                  </Link>
                </div>
                <div className="text-sm text-right">
                  {m.rezultat && <span className="font-mono bg-gray-100 px-2 py-0.5 rounded mr-2">{m.rezultat}</span>}
                  {m.turnir && <Link to={`/turniri/${m.turnir.id}`} className="text-xs text-gray-500 hover:underline">{m.turnir.naziv}</Link>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {igrac.historijaRejtinga?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Trophy className="h-5 w-5" /> Historija rejtinga</h3>
          <div className="space-y-2">
            {igrac.historijaRejtinga.map((h) => (
              <div key={h.id} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                <span className={`font-medium ${h.promjena > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {h.promjena > 0 ? '+' : ''}{h.promjena}
                </span>
                <span className="text-gray-700 font-bold">{h.noviRejting} ELO</span>
                <span className="text-gray-400">{new Date(h.createdAt).toLocaleDateString('hr-HR')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
