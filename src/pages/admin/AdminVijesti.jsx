import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminVijesti() {
  const [vijesti, setVijesti] = useState([]);
  const [forma, setForma] = useState({ naslov: '', sadrzaj: '' });
  const [editId, setEditId] = useState(null);
  const [prikaziFormu, setPrikaziFormu] = useState(false);

  const ucitaj = () => api.get('/vijesti').then(setVijesti);
  useEffect(() => { ucitaj(); }, []);

  const spremi = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/vijesti/${editId}`, forma);
    else await api.post('/vijesti', forma);
    setForma({ naslov: '', sadrzaj: '' });
    setEditId(null);
    setPrikaziFormu(false);
    ucitaj();
  };

  const uredi = (v) => {
    setForma({ naslov: v.naslov, sadrzaj: v.sadrzaj });
    setEditId(v.id);
    setPrikaziFormu(true);
  };

  const obrisi = async (id) => {
    if (!confirm('Obrisati vijest?')) return;
    await api.delete(`/vijesti/${id}`);
    ucitaj();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upravljanje vijestima</h2>
        <button onClick={() => { setForma({ naslov: '', sadrzaj: '' }); setEditId(null); setPrikaziFormu(!prikaziFormu); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          {prikaziFormu ? 'Zatvori' : '+ Nova vijest'}
        </button>
      </div>

      {prikaziFormu && (
        <form onSubmit={spremi} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={forma.naslov} onChange={(e) => setForma({ ...forma, naslov: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sadržaj</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={forma.sadrzaj} onChange={(e) => setForma({ ...forma, sadrzaj: e.target.value })} required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">Spremi</button>
            <button type="button" onClick={() => setPrikaziFormu(false)} className="text-gray-500 px-5 py-2 text-sm hover:underline">Odustani</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {vijesti.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-start gap-4">
            <div>
              <div className="font-medium text-gray-800">{v.naslov}</div>
              <div className="text-sm text-gray-400">{new Date(v.createdAt).toLocaleDateString('hr-HR')}</div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{v.sadrzaj}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => uredi(v)} className="border border-blue-600 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50">Uredi</button>
              <button onClick={() => obrisi(v.id)} className="border border-red-500 text-red-500 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50">Obriši</button>
            </div>
          </div>
        ))}
        {vijesti.length === 0 && <p className="text-center py-10 text-gray-500">Nema vijesti.</p>}
      </div>
    </div>
  );
}
