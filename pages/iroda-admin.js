import { useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabase';

export default function IrodaAdmin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [irodaId, setIrodaId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [iroda, setIroda] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [ingatlanok, setIngatlanok] = useState([]);
  const [leadek, setLeadek] = useState([]);
  const [activeTab, setActiveTab] = useState('ingatlanok');

  async function login() {
    setLoginError('');
    if (!irodaId.trim() || !password.trim()) {
      setLoginError('Kérlek töltsd ki mindkét mezőt!');
      return;
    }

    const { data, error } = await supabase
      .from('irodak')
      .select('*')
      .eq('iroda_id', irodaId.trim())
      .eq('jelszo', password.trim())
      .single();

    if (error || !data) {
      setLoginError('Hibás azonosító vagy jelszó!');
      return;
    }

    setIroda(data);
    setLoggedIn(true);
    loadIngatlanok(irodaId.trim());
    loadLeadek(irodaId.trim());
  }

  async function loadIngatlanok(id) {
    const { data } = await supabase
      .from('ingatlanok')
      .select('*')
      .eq('iroda_id', id)
      .order('id');
    setIngatlanok(data || []);
  }

  async function loadLeadek(id) {
    const { data } = await supabase
      .from('leadek')
      .select('*')
      .eq('iroda_id', id)
      .order('datum', { ascending: false });
    setLeadek(data || []);
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
      rows.push(row);
    }
    return rows;
  }

  async function upload() {
    if (!file) { setResult({ error: 'Kérlek válassz egy CSV fájlt!' }); return; }
    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) throw new Error('A CSV fájl üres vagy nem olvasható.');

      await supabase.from('ingatlanok').delete().eq('iroda_id', irodaId);

      const ujIngatlanok = rows.map(row => ({
        iroda_id: irodaId,
        cim: row.cim || row['Cím'] || '',
        kerulet: row.kerulet || row['Kerület'] || row.helyszin || '',
        ar: row.ar || row['Ár'] || '',
        tipus: row.tipus || row['Típus'] || '',
        alapterulet: parseInt(row.alapterulet || row['Alapterület'] || '0') || null,
        szobak: parseInt(row.szobak || row['Szobák'] || '0') || null,
        leiras: row.leiras || row['Leírás'] || '',
        tags: row.tags ? row.tags.split(';').map(t => t.trim()) : [],
        aktiv: true
      }));

      const { error } = await supabase.from('ingatlanok').insert(ujIngatlanok);
      if (error) throw new Error(error.message);

      setResult({ success: true, count: ujIngatlanok.length });
      setFile(null);
      document.getElementById('csvInput').value = '';
      loadIngatlanok(irodaId);
    } catch (err) {
      setResult({ error: err.message });
    }
    setUploading(false);
  }

  // ── LOGIN ────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <>
        <Head><title>IngatlanAI — Iroda Belépés</title></Head>
        <div style={{ minHeight: '100vh', background: '#f0f3f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(28,43,58,0.12)', border: '0.5px solid rgba(28,43,58,0.12)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🏠</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1C2B3A', marginBottom: 4 }}>IngatlanAI</div>
              <div style={{ fontSize: 13, color: '#96a7b5' }}>Iroda admin felület</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5a6b7a', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Iroda azonosító</label>
              <input
                value={irodaId}
                onChange={e => setIrodaId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="pl. ingatlancorner"
                style={{ width: '100%', padding: '11px 14px', border: '0.5px solid rgba(28,43,58,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5a6b7a', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Jelszó</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="Jelszó"
                style={{ width: '100%', padding: '11px 14px', border: '0.5px solid rgba(28,43,58,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>

            {loginError && (
              <div style={{ background: '#fff3f3', border: '0.5px solid #ffcccc', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#c62828', marginBottom: 12 }}>
                {loginError}
              </div>
            )}

            <button onClick={login} style={{ width: '100%', padding: 13, background: '#1C2B3A', color: '#C9963A', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Belépés
            </button>

            <div style={{ marginTop: 16, fontSize: 12, color: '#96a7b5', textAlign: 'center', lineHeight: 1.6 }}>
              Ha elfelejtette a belépési adatait,<br />kérjük vegye fel a kapcsolatot velünk.
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── ADMIN FELÜLET ────────────────────────────────────────
  const usagePercent = Math.round((iroda.session_szam || 0) / (iroda.session_limit || 500) * 100);

  return (
    <>
      <Head><title>IngatlanAI — {iroda.nev || irodaId}</title></Head>
      <div style={{ minHeight: '100vh', background: '#f0f3f7', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ background: '#1C2B3A', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🏠</span>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#fff' }}>{iroda.nev || irodaId}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>IngatlanAI — {iroda.csomag} csomag</div>
            </div>
          </div>
          <button onClick={() => { setLoggedIn(false); setIroda(null); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            Kilépés
          </button>
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Feltöltött ingatlanok', value: ingatlanok.length, icon: '🏠' },
              { label: 'Beérkezett leadek', value: leadek.length, icon: '👤' },
              { label: 'Session felhasználás', value: `${iroda.session_szam || 0} / ${iroda.session_limit}`, icon: '💬' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '0.5px solid rgba(28,43,58,0.1)', boxShadow: '0 2px 10px rgba(28,43,58,0.06)' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 500, color: '#1C2B3A', fontFamily: 'Georgia, serif' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#96a7b5', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Session progress */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', border: '0.5px solid rgba(28,43,58,0.1)', boxShadow: '0 2px 10px rgba(28,43,58,0.06)', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5a6b7a', marginBottom: 8 }}>
              <span>Havi session felhasználás</span>
              <span style={{ fontWeight: 500, color: usagePercent >= 80 ? '#c62828' : '#2e7d32' }}>{usagePercent}%</span>
            </div>
            <div style={{ height: 8, background: '#f0f3f7', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(usagePercent, 100)}%`, background: usagePercent >= 80 ? '#ef5350' : '#66bb6a', borderRadius: 4, transition: 'width 0.3s' }}></div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {[
              { id: 'ingatlanok', label: `Ingatlanok (${ingatlanok.length})` },
              { id: 'leadek', label: `Leadek (${leadek.length})` },
              { id: 'feltoltes', label: 'CSV Feltöltés' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                background: activeTab === tab.id ? '#1C2B3A' : '#fff',
                color: activeTab === tab.id ? '#C9963A' : '#5a6b7a',
                fontWeight: activeTab === tab.id ? 500 : 400,
                boxShadow: '0 2px 8px rgba(28,43,58,0.06)'
              }}>{tab.label}</button>
            ))}
          </div>

          {/* INGATLANOK TAB */}
          {activeTab === 'ingatlanok' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(28,43,58,0.1)', boxShadow: '0 2px 10px rgba(28,43,58,0.06)', overflow: 'hidden' }}>
              {ingatlanok.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#96a7b5' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
                  <div style={{ fontSize: 14 }}>Még nincs feltöltött ingatlan</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>Menjen a CSV Feltöltés fülre az ingatlanok feltöltéséhez</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f7f8fa' }}>
                      {['Cím', 'Kerület', 'Ár', 'Típus', 'm²', 'Szoba'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#96a7b5', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '0.5px solid rgba(28,43,58,0.1)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ingatlanok.map((ing, i) => (
                      <tr key={ing.id} style={{ borderBottom: '0.5px solid rgba(28,43,58,0.07)', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#1C2B3A', fontWeight: 500 }}>{ing.cim}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#5a6b7a' }}>{ing.kerulet}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#C9963A', fontWeight: 500 }}>{ing.ar}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#5a6b7a' }}>{ing.tipus}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#5a6b7a' }}>{ing.alapterulet}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#5a6b7a' }}>{ing.szobak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* LEADEK TAB */}
          {activeTab === 'leadek' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(28,43,58,0.1)', boxShadow: '0 2px 10px rgba(28,43,58,0.06)', overflow: 'hidden' }}>
              {leadek.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#96a7b5' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>👤</div>
                  <div style={{ fontSize: 14 }}>Még nem érkezett lead</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>Az érdeklődők elérhetőségei itt fognak megjelenni</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f7f8fa' }}>
                      {['Név', 'Telefon', 'Időpont', 'Státusz'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#96a7b5', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '0.5px solid rgba(28,43,58,0.1)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leadek.map((lead, i) => (
                      <tr key={lead.id} style={{ borderBottom: '0.5px solid rgba(28,43,58,0.07)', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#1C2B3A', fontWeight: 500 }}>{lead.nev}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#1C2B3A' }}>{lead.telefon}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#5a6b7a' }}>{new Date(lead.datum).toLocaleString('hu-HU')}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: lead.kezelt ? '#e8f5e9' : '#fff3e0', color: lead.kezelt ? '#2e7d32' : '#e65100' }}>
                            {lead.kezelt ? 'Kezelt' : 'Új'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CSV FELTÖLTÉS TAB */}
          {activeTab === 'feltoltes' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '0.5px solid rgba(28,43,58,0.1)', boxShadow: '0 2px 10px rgba(28,43,58,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1C2B3A', marginBottom: 16 }}>CSV Feltöltés</div>

                <div
                  onClick={() => document.getElementById('csvInput').click()}
                  style={{ border: '1.5px dashed rgba(28,43,58,0.2)', borderRadius: 10, padding: 24, textAlign: 'center', cursor: 'pointer', background: file ? '#e8f5e9' : '#f7f8fa', marginBottom: 14 }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? '✅' : '📄'}</div>
                  <div style={{ fontSize: 13, color: file ? '#2e7d32' : '#5a6b7a' }}>
                    {file ? file.name : 'Kattints a CSV fájl kiválasztásához'}
                  </div>
                  <div style={{ fontSize: 11, color: '#96a7b5', marginTop: 4 }}>vagy húzd ide a fájlt</div>
                </div>
                <input id="csvInput" type="file" accept=".csv" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />

                <button onClick={upload} disabled={uploading} style={{ width: '100%', padding: 12, background: uploading ? '#96a7b5' : '#1C2B3A', color: '#C9963A', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {uploading ? 'Feltöltés folyamatban...' : 'Feltöltés és frissítés'}
                </button>

                {result && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: result.error ? '#fff3f3' : '#e8f5e9', border: `0.5px solid ${result.error ? '#ffcccc' : '#a5d6a7'}`, fontSize: 13, color: result.error ? '#c62828' : '#2e7d32' }}>
                    {result.error ? `❌ ${result.error}` : `✅ Sikeresen feltöltve ${result.count} ingatlan!`}
                  </div>
                )}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '0.5px solid rgba(28,43,58,0.1)', boxShadow: '0 2px 10px rgba(28,43,58,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1C2B3A', marginBottom: 12 }}>CSV Sablon</div>
                <p style={{ fontSize: 13, color: '#5a6b7a', marginBottom: 12, lineHeight: 1.6 }}>A CSV fájl első sora a fejléc kell legyen az alábbi oszlopnevekkel:</p>
                <div style={{ background: '#1C2B3A', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 12, color: '#C9963A', lineHeight: 1.8 }}>
                  cim,kerulet,ar,tipus,alapterulet,szobak,leiras,tags
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: '#5a6b7a', lineHeight: 1.7 }}>
                  <strong style={{ color: '#1C2B3A' }}>Példa sor:</strong><br />
                  Petőfi utca 12.,Budapest XIII.,45000000 Ft,lakás,68,3,Szép lakás a belvárosban...,kert;csendes;napfényes
                </div>
                <div style={{ marginTop: 12, background: '#FFF8E1', borderRadius: 8, padding: 12, fontSize: 12, color: '#7a5200', lineHeight: 1.6 }}>
                  ⚠️ A <strong>tags</strong> mezőben pontosvesszővel válassza el a jellemzőket: <code>kert;garázs;csendes</code>
                </div>
                <button
                  onClick={() => {
                    const csv = 'cim,kerulet,ar,tipus,alapterulet,szobak,leiras,tags\nPélda utca 1.,Budapest XIII.,45000000 Ft,lakás,68,3,Szép lakás leírása itt.,kert;csendes';
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'ingatlan_sablon.csv'; a.click();
                  }}
                  style={{ marginTop: 14, width: '100%', padding: 10, background: '#f0f3f7', border: '0.5px solid rgba(28,43,58,0.15)', borderRadius: 8, fontSize: 13, color: '#1C2B3A', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  📥 Sablon letöltése
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
