import { useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = 'ingatlanai2026';

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [irodaId, setIrodaId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [irodak, setIrodak] = useState([]);
  const [loadingIrodak, setLoadingIrodak] = useState(false);

  async function login() {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadIrodak();
    } else {
      setPasswordError('Helytelen jelszó');
    }
  }

  async function loadIrodak() {
    setLoadingIrodak(true);
    const { data } = await supabase.from('irodak').select('*').order('nev');
    setIrodak(data || []);
    setLoadingIrodak(false);
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
    if (!irodaId.trim()) { setResult({ error: 'Kérlek add meg az iroda azonosítóját!' }); return; }
    if (!file) { setResult({ error: 'Kérlek válassz egy CSV fájlt!' }); return; }

    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) throw new Error('A CSV fájl üres vagy nem olvasható.');

      // Delete existing properties for this iroda
      await supabase.from('ingatlanok').delete().eq('iroda_id', irodaId);

      // Insert new properties
      const ingatlanok = rows.map(row => ({
        iroda_id: irodaId,
        cim: row.cim || row.Cím || row.cím || '',
        kerulet: row.kerulet || row.Kerület || row.helyszin || '',
        ar: row.ar || row.Ár || row.ar_ft || '',
        tipus: row.tipus || row.Típus || row.tipus || '',
        alapterulet: parseInt(row.alapterulet || row.Alapterület || '0') || null,
        szobak: parseInt(row.szobak || row.Szobák || row.szobaszam || '0') || null,
        leiras: row.leiras || row.Leírás || row.leiras || '',
        tags: row.tags ? row.tags.split(';').map(t => t.trim()) : [],
        aktiv: true
      }));

      const { error } = await supabase.from('ingatlanok').insert(ingatlanok);
      if (error) throw new Error(error.message);

      // Update session count
      await supabase.from('irodak').upsert({
        iroda_id: irodaId,
        nev: irodaId,
        csomag: 'starter',
        session_limit: 500
      }, { onConflict: 'iroda_id' });

      setResult({ success: true, count: ingatlanok.length });
      loadIrodak();

    } catch (err) {
      setResult({ error: err.message });
    }
    setUploading(false);
  }

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <>
        <Head><title>IngatlanAI Admin</title></Head>
        <div style={{ minHeight: '100vh', background: '#f0f3f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 360, boxShadow: '0 8px 40px rgba(28,43,58,0.12)', border: '0.5px solid rgba(28,43,58,0.12)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏠</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1C2B3A', marginBottom: 4 }}>IngatlanAI Admin</div>
              <div style={{ fontSize: 13, color: '#96a7b5' }}>Belépés szükséges</div>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Jelszó"
              style={{ width: '100%', padding: '11px 14px', border: '0.5px solid rgba(28,43,58,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 10 }}
            />
            {passwordError && <div style={{ color: '#c62828', fontSize: 12, marginBottom: 8 }}>{passwordError}</div>}
            <button onClick={login} style={{ width: '100%', padding: 12, background: '#1C2B3A', color: '#C9963A', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Belépés
            </button>
          </div>
        </div>
      </>
    );
  }

  // ADMIN SCREEN
  return (
    <>
      <Head><title>IngatlanAI Admin</title></Head>
      <div style={{ minHeight: '100vh', background: '#f0f3f7', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ background: '#1C2B3A', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🏠</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff' }}>IngatlanAI Admin</span>
          </div>
          <button onClick={() => setLoggedIn(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            Kilépés
          </button>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* CSV FELTÖLTŐ */}
          <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(28,43,58,0.12)', boxShadow: '0 4px 20px rgba(28,43,58,0.07)', overflow: 'hidden' }}>
            <div style={{ background: '#1C2B3A', padding: '14px 20px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#fff' }}>CSV Feltöltés</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Ingatlanok feltöltése irodánként</div>
            </div>
            <div style={{ padding: 20 }}>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#5a6b7a', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Iroda azonosító</label>
                <input
                  value={irodaId}
                  onChange={e => setIrodaId(e.target.value)}
                  placeholder="pl. ingatlancorner"
                  style={{ width: '100%', padding: '10px 12px', border: '0.5px solid rgba(28,43,58,0.2)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#5a6b7a', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>CSV Fájl</label>
                <div
                  onClick={() => document.getElementById('csvInput').click()}
                  style={{ border: '1.5px dashed rgba(28,43,58,0.2)', borderRadius: 8, padding: '20px', textAlign: 'center', cursor: 'pointer', background: file ? '#e8f5e9' : '#f7f8fa' }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{file ? '✅' : '📄'}</div>
                  <div style={{ fontSize: 13, color: file ? '#2e7d32' : '#5a6b7a' }}>
                    {file ? file.name : 'Kattints a fájl kiválasztásához'}
                  </div>
                  <div style={{ fontSize: 11, color: '#96a7b5', marginTop: 4 }}>CSV formátum</div>
                </div>
                <input id="csvInput" type="file" accept=".csv" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              </div>

              <button
                onClick={upload}
                disabled={uploading}
                style={{ width: '100%', padding: 12, background: uploading ? '#96a7b5' : '#1C2B3A', color: '#C9963A', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                {uploading ? 'Feltöltés folyamatban...' : 'Feltöltés'}
              </button>

              {result && (
                <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: result.error ? '#fff3f3' : '#e8f5e9', border: `0.5px solid ${result.error ? '#ffcccc' : '#a5d6a7'}`, fontSize: 13, color: result.error ? '#c62828' : '#2e7d32' }}>
                  {result.error ? `❌ ${result.error}` : `✅ Sikeresen feltöltve ${result.count} ingatlan!`}
                </div>
              )}

              {/* CSV sablon */}
              <div style={{ marginTop: 16, padding: 12, background: '#f7f8fa', borderRadius: 8, border: '0.5px solid rgba(28,43,58,0.1)' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#5a6b7a', marginBottom: 6 }}>CSV oszlopok (fejléc):</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#1C2B3A', lineHeight: 1.8 }}>
                  cim, kerulet, ar, tipus, alapterulet, szobak, leiras, tags
                </div>
                <div style={{ fontSize: 11, color: '#96a7b5', marginTop: 6 }}>A tags mezőben pontosvesszővel elválasztva: kert;garázs;csendes</div>
              </div>
            </div>
          </div>

          {/* IRODÁK LISTÁJA */}
          <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(28,43,58,0.12)', boxShadow: '0 4px 20px rgba(28,43,58,0.07)', overflow: 'hidden' }}>
            <div style={{ background: '#1C2B3A', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#fff' }}>Irodák</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{irodak.length} iroda a rendszerben</div>
              </div>
              <button onClick={loadIrodak} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
                Frissítés
              </button>
            </div>
            <div style={{ padding: 20 }}>
              {loadingIrodak ? (
                <div style={{ textAlign: 'center', color: '#96a7b5', fontSize: 13, padding: 20 }}>Betöltés...</div>
              ) : irodak.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#96a7b5', fontSize: 13, padding: 20 }}>Még nincs iroda a rendszerben</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {irodak.map(iroda => (
                    <div key={iroda.id} style={{ padding: '10px 14px', border: '0.5px solid rgba(28,43,58,0.1)', borderRadius: 8, background: '#f7f8fa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1C2B3A' }}>{iroda.nev || iroda.iroda_id}</div>
                          <div style={{ fontSize: 11, color: '#96a7b5', marginTop: 2 }}>{iroda.iroda_id} · {iroda.csomag}</div>
                        </div>
                        <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: iroda.aktiv ? '#e8f5e9' : '#fff3f3', color: iroda.aktiv ? '#2e7d32' : '#c62828' }}>
                          {iroda.aktiv ? 'Aktív' : 'Inaktív'}
                        </div>
                      </div>
                      <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 11, color: '#5a6b7a' }}>
                        <span>Session: {iroda.session_szam || 0} / {iroda.session_limit}</span>
                        <span>Csomag: {iroda.csomag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
