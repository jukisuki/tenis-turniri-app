import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

const statusOpcije = ['DRAFT', 'OTVOREN', 'ZATVOREN', 'ZAVRSEN'];

const prazanForm = { naziv: '', datum: '', rokPrijave: '', kategorija: '', maxIgraca: 32, opis: '', status: 'OTVOREN' };

export default function AdminTurniri() {
  const [turniri, setTurniri] = useState([]);
  const [forma, setForma] = useState(prazanForm);
  const [editId, setEditId] = useState(null);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [loading, setLoading] = useState(true);

  const ucitaj = () => {
    setLoading(true);
    api.get('/turniri').then(setTurniri).finally(() => setLoading(false));
  };

  useEffect(() => { ucitaj(); }, []);

  const spremi = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/turniri/${editId}`, forma);
    else await api.post('/turniri', forma);
    setForma(prazanForm);
    setEditId(null);
    setPrikaziFormu(false);
    ucitaj();
  };

  const uredi = (t) => {
    setForma({
      naziv: t.naziv, datum: t.datum.slice(0, 10), rokPrijave: t.rokPrijave.slice(0, 10),
      kategorija: t.kategorija, maxIgraca: t.maxIgraca, opis: t.opis || '', status: t.status,
    });
    setEditId(t.id);
    setPrikaziFormu(true);
  };

  const obrisi = async (id) => {
    if (!confirm('Jeste li sigurni?')) return;
    await api.delete(`/turniri/${id}`);
    ucitaj();
  };

  const polje = (key, label, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={forma[key]} onChange={(e) => setForma({ ...forma, [key]: e.target.value })} required />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upravljanje turnirima</h2>
        <button onClick={() => { setForma(prazanForm); setEditId(null); setPrikaziFormu(!prikaziFormu); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          {prikaziFormu ? 'Zatvori' : '+ Novi turnir'}
        </button>
      </div>

      {prikaziFormu && (
        <form onSubmit={spremi} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">{editId ? 'Uredi turnir' : 'Novi turnir'}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">{polje('naziv', 'Naziv')}</div>
            {polje('datum', 'Datum turnira', 'date')}
            {polje('rokPrijave', 'Rok prijave', 'date')}
            {polje('kategorija', 'Kategorija')}
            {polje('maxIgraca', 'Maks. igrača', 'number')}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={forma.status} onChange={(e) => setForma({ ...forma, status: e.target.value })}>
                {statusOpcije.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                value={forma.opis} onChange={(e) => setForma({ ...forma, opis: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">Spremi</button>
            <button type="button" onClick={() => setPrikaziFormu(false)} className="text-gray-500 px-5 py-2 text-sm hover:underline">Odustani</button>
          </div>
        </form>
      )}

      {loading ? <div className="text-center py-10 text-gray-500">Učitavanje...</div> : (
        <div className="space-y-3">
          {turniri.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="font-medium text-gray-800">{t.naziv}</div>
                <div className="text-sm text-gray-500">{new Date(t.datum).toLocaleDateString('hr-HR')} · {t.kategorija} · {t.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => uredi(t)} className="border border-blue-600 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">Uredi</button>
                <button onClick={() => obrisi(t.id)} className="border border-red-500 text-red-500 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 transition-colors">Obriši</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
