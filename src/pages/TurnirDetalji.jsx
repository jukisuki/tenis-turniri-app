import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const statusLabel = { OTVOREN: 'Otvoren', ZATVOREN: 'Zatvoren', ZAVRSEN: 'Završen', DRAFT: 'U pripremi' };

export default function TurnirDetalji() {
  const { id } = useParams();
  const { korisnik } = useAuth();
  const [turnir, setTurnir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poruka, setPoruka] = useState('');

  useEffect(() => {
    api.get(`/turniri/${id}`).then(setTurnir).finally(() => setLoading(false));
  }, [id]);

  const prijaviSe = async () => {
    try {
      await api.post('/prijave', { turnirId: Number(id) });
      setPoruka('Prijava uspješna! Čeka na potvrdu admina.');
      const azuriran = await api.get(`/turniri/${id}`);
      setTurnir(azuriran);
    } catch (err) {
      setPoruka(err.message);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Učitavanje...</div>;
  if (!turnir) return <div className="text-center py-20 text-gray-500">Turnir nije pronađen.</div>;

  const vecPrijavljen = turnir.prijave?.some((p) => p.igrac?.id === korisnik?.id);

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/turniri" className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Natrag na turnire
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{turnir.naziv}</h2>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{statusLabel[turnir.status]}</span>
        </div>

        {turnir.opis && <p className="text-gray-600 mb-4">{turnir.opis}</p>}

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div><span className="font-medium">Datum:</span> {new Date(turnir.datum).toLocaleDateString('hr-HR')}</div>
          <div><span className="font-medium">Rok prijave:</span> {new Date(turnir.rokPrijave).toLocaleDateString('hr-HR')}</div>
          <div><span className="font-medium">Kategorija:</span> {turnir.kategorija}</div>
          <div><span className="font-medium">Igrači:</span> {turnir.prijave?.length ?? 0} / {turnir.maxIgraca}</div>
        </div>

        {poruka && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${poruka.includes('uspješna') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
            {poruka}
          </div>
        )}

        {korisnik && !vecPrijavljen && turnir.status === 'OTVOREN' && new Date() <= new Date(turnir.rokPrijave) && (
          <button onClick={prijaviSe} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Prijavi se na turnir
          </button>
        )}
        {vecPrijavljen && <p className="text-green-700 font-medium">Prijavljeni ste na ovaj turnir.</p>}
      </div>

      {turnir.prijave?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Users className="h-5 w-5" /> Prijavljeni igrači</h3>
          <div className="space-y-2">
            {turnir.prijave.map((p) => (
              <div key={p.igrac.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <Link to={`/igraci/${p.igrac.id}`} className="text-blue-600 hover:underline">
                  {p.igrac.ime} {p.igrac.prezime}
                </Link>
                <span className="text-sm text-gray-500">{p.igrac.rejting} ELO</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {turnir.mecevi?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Mečevi</h3>
          <div className="space-y-3">
            {turnir.mecevi.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="text-sm">
                  <span className={m.pobjednikId === m.igrac1Id ? 'font-bold text-green-700' : 'text-gray-700'}>{m.igrac1.ime} {m.igrac1.prezime}</span>
                  <span className="mx-2 text-gray-400">vs</span>
                  <span className={m.pobjednikId === m.igrac2Id ? 'font-bold text-green-700' : 'text-gray-700'}>{m.igrac2.ime} {m.igrac2.prezime}</span>
                </div>
                <div className="text-sm text-right">
                  {m.rezultat && <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{m.rezultat}</span>}
                  {m.runda && <span className="ml-2 text-xs text-gray-500">{m.runda}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
