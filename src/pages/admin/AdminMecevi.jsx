import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminMecevi() {
  const [mecevi, setMecevi] = useState([]);
  const [turniri, setTurniri] = useState([]);
  const [igraci, setIgraci] = useState([]);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [prikaziRezultat, setPrikaziRezultat] = useState(null);
  const [forma, setForma] = useState({ turnirId: '', igrac1Id: '', igrac2Id: '', datum: '', runda: '' });
  const [rezForma, setRezForma] = useState({ pobjednikId: '', rezultat: '' });
  const [loading, setLoading] = useState(true);

  const ucitaj = () => {
    setLoading(true);
    Promise.all([api.get('/mecevi'), api.get('/turniri'), api.get('/igraci')])
      .then(([m, t, i]) => { setMecevi(m); setTurniri(t); setIgraci(i); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { ucitaj(); }, []);

  const kreirajMec = async (e) => {
    e.preventDefault();
    await api.post('/mecevi', forma);
    setForma({ turnirId: '', igrac1Id: '', igrac2Id: '', datum: '', runda: '' });
    setPrikaziFormu(false);
    ucitaj();
  };

  const spremiRezultat = async (id) => {
    await api.put(`/mecevi/${id}/rezultat`, rezForma);
    setPrikaziRezultat(null);
    setRezForma({ pobjednikId: '', rezultat: '' });
    ucitaj();
  };

  const select = (key, label, opcije, prikazFn) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={forma[key]} onChange={(e) => setForma({ ...forma, [key]: e.target.value })} required>
        <option value="">-- Odaberi --</option>
        {opcije.map((o) => <option key={o.id} value={o.id}>{prikazFn(o)}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upravljanje mečevima</h2>
        <button onClick={() => setPrikaziFormu(!prikaziFormu)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          {prikaziFormu ? 'Zatvori' : '+ Novi meč'}
        </button>
      </div>

      {prikaziFormu && (
        <form onSubmit={kreirajMec} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Novi meč</h3>
          <div className="grid grid-cols-2 gap-4">
            {select('turnirId', 'Turnir', turniri, (t) => t.naziv)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Runda</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="npr. Finale" value={forma.runda} onChange={(e) => setForma({ ...forma, runda: e.target.value })} />
            </div>
            {select('igrac1Id', 'Igrač 1', igraci, (i) => `${i.ime} ${i.prezime} (${i.rejting})`)}
            {select('igrac2Id', 'Igrač 2', igraci, (i) => `${i.ime} ${i.prezime} (${i.rejting})`)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={forma.datum} onChange={(e) => setForma({ ...forma, datum: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">Kreiraj</button>
            <button type="button" onClick={() => setPrikaziFormu(false)} className="text-gray-500 px-5 py-2 text-sm hover:underline">Odustani</button>
          </div>
        </form>
      )}

      {loading ? <div className="text-center py-10 text-gray-500">Učitavanje...</div> : (
        <div className="space-y-3">
          {mecevi.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="font-medium text-gray-800">
                    {m.igrac1.ime} {m.igrac1.prezime} vs {m.igrac2.ime} {m.igrac2.prezime}
                  </div>
                  <div className="text-sm text-gray-500">{m.turnir.naziv} {m.runda && `· ${m.runda}`}</div>
                  {m.rezultat && <div className="mt-1 text-sm font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">{m.rezultat}</div>}
                  {m.pobjednik && <div className="text-sm text-green-700 mt-1">Pobjednik: {m.pobjednik.ime} {m.pobjednik.prezime}</div>}
                </div>
                {!m.pobjednikId && (
                  <button onClick={() => { setPrikaziRezultat(m.id); setRezForma({ pobjednikId: '', rezultat: '' }); }}
                    className="border border-blue-600 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                    Unesi rezultat
                  </button>
                )}
              </div>

              {prikaziRezultat === m.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pobjednik</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={rezForma.pobjednikId} onChange={(e) => setRezForma({ ...rezForma, pobjednikId: e.target.value })}>
                        <option value="">-- Odaberi --</option>
                        <option value={m.igrac1.id}>{m.igrac1.ime} {m.igrac1.prezime}</option>
                        <option value={m.igrac2.id}>{m.igrac2.ime} {m.igrac2.prezime}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rezultat (npr. 6:3 7:5)</label>
                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="6:3 7:5" value={rezForma.rezultat} onChange={(e) => setRezForma({ ...rezForma, rezultat: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => spremiRezultat(m.id)} disabled={!rezForma.pobjednikId} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors">Spremi</button>
                    <button onClick={() => setPrikaziRezultat(null)} className="text-gray-500 text-sm hover:underline">Odustani</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {mecevi.length === 0 && <p className="text-center py-10 text-gray-500">Nema mečeva.</p>}
        </div>
      )}
    </div>
  );
}
