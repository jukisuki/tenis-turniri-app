import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

const statusBadge = { NA_CEKANJU: 'bg-yellow-100 text-yellow-800', ODOBREN: 'bg-green-100 text-green-800', ODBIJEN: 'bg-red-100 text-red-700' };
const statusLabel = { NA_CEKANJU: 'Na čekanju', ODOBREN: 'Odobren', ODBIJEN: 'Odbijen' };

export default function AdminPrijave() {
  const [prijave, setPrijave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('NA_CEKANJU');

  const ucitaj = () => {
    setLoading(true);
    api.get(`/prijave${filter ? `?status=${filter}` : ''}`)
      .then(setPrijave)
      .finally(() => setLoading(false));
  };

  useEffect(() => { ucitaj(); }, [filter]);

  const odobri = async (id) => { await api.put(`/prijave/${id}/odobri`); ucitaj(); };
  const odbij = async (id) => { await api.put(`/prijave/${id}/odbij`); ucitaj(); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upravljanje prijavama</h2>

      <div className="flex gap-2 mb-6">
        {['NA_CEKANJU', 'ODOBREN', 'ODBIJEN', ''].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            {s ? statusLabel[s] : 'Sve'}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-10 text-gray-500">Učitavanje...</div>}

      <div className="space-y-3">
        {prijave.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-medium text-gray-800">{p.igrac.ime} {p.igrac.prezime}</div>
              <div className="text-sm text-gray-500">{p.igrac.email} · {p.igrac.rejting} ELO</div>
              <div className="text-sm text-gray-700 mt-1">{p.turnir.naziv}</div>
              <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('hr-HR')}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge[p.status]}`}>{statusLabel[p.status]}</span>
              {p.status === 'NA_CEKANJU' && (
                <>
                  <button onClick={() => odobri(p.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors">Odobri</button>
                  <button onClick={() => odbij(p.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors">Odbij</button>
                </>
              )}
            </div>
          </div>
        ))}
        {!loading && prijave.length === 0 && <p className="text-center py-10 text-gray-500">Nema prijava.</p>}
      </div>
    </div>
  );
}
