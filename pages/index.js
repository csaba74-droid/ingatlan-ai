import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const PROPERTIES = [
  {
    id: 1,
    cim: "Pozsonyi út 14., V. emelet",
    kerulet: "XIII. kerület, Újlipótváros",
    ar: "96 500 000 Ft",
    tipus: "lakás",
    alapterulet: 74,
    szobak: 3,
    emelet: "5/7",
    tajolas: "dél-nyugat",
    allapot: "felújított",
    leiras: "Tágas, világos háromszobás lakás a Pozsonyi úton. Déli tájolásnak köszönhetően egész nap süt be a nap. A Duna-part és a Margit-sziget gyalogosan elérhető. Teljesen felújított, új konyhabútor, parketta, klíma. Csendes belső utca, mégis minden közel: piac, iskola, bolt. Kisállat hozható. Parkolási lehetőség a környéken. Kiváló közlekedés: villamos, busz, metró közelben.",
    tags: ["napfényes","csendes","kisállat ok","felújított","Duna-közel"],
  },
  {
    id: 2,
    cim: "Ráday utca 8., II. emelet",
    kerulet: "IX. kerület, Ferencváros",
    ar: "78 900 000 Ft",
    tipus: "lakás",
    alapterulet: 62,
    szobak: 2,
    emelet: "2/4",
    tajolas: "észak-kelet",
    allapot: "jó állapotú",
    leiras: "Hangulatos kétszobás lakás a Ráday utcában, a város legsűrűbben teli kávézós-éttermes negyedében. Belmagasság 3,2 méter, eredeti stukkók. Home office-hoz ideális: gyors net, elkülönített dolgozószoba. Tömegközlekedés előtt az ajtó. Erkély az udvarra néz. Bolt, gyógyszertár, könyvtár sétatávolságra.",
    tags: ["home office","belváros","magas belmagasság","erkély","étterem-negyed"],
  },
  {
    id: 3,
    cim: "Budai alsórakpart 2., 1. emelet",
    kerulet: "I. kerület, Vár",
    ar: "345 000 000 Ft",
    tipus: "lakás",
    alapterulet: 128,
    szobak: 4,
    emelet: "1/3",
    tajolas: "kelet",
    allapot: "luxus felújítás",
    leiras: "Páratlan Duna-panoráma a Budai Alsórakparton. Négy szobás luxuslakás prémium anyaghasználattal: olasz burkolat, Miele konyha, okosotthon rendszer. Nagy terasz, ahonnan látszik a Parlament, a hidak és a Margitsziget. Portaszolgálat, mélygarázs. Befektetésként is kitűnő, airbnb engedély van rá.",
    tags: ["Duna-panoráma","terasz","luxus","parkoló","portaszolgálat","befektetés","airbnb"],
  },
  {
    id: 4,
    cim: "Thököly út 67., fsz.",
    kerulet: "XIV. kerület, Zugló",
    ar: "54 200 000 Ft",
    tipus: "lakás",
    alapterulet: 68,
    szobak: 2,
    emelet: "fsz./4",
    tajolas: "dél",
    allapot: "felújítandó",
    leiras: "Kertes, földszinti lakás Zuglóban — ritka lehetőség! Az 50 m²-es, kizárólagos használatú kert gyerekeknek és állatoknak ideális. Déli tájolású, sok fény. Felújítandó állapot, de a szerkezet kiváló. A Városliget gyalogosan 12 percre. Iskola, óvoda, bolt mind 500 méteren belül. Kisgyermekes vagy állatos egyéneknek ajánljuk.",
    tags: ["kert","gyerekbarát","kisállat ok","csendes","felújítandó","déli tájolás"],
  },
  {
    id: 5,
    cim: "Hajós utca 22., IV. emelet",
    kerulet: "VI. kerület, Terézváros",
    ar: "119 000 000 Ft",
    tipus: "lakás",
    alapterulet: 88,
    szobak: 3,
    emelet: "4/5",
    tajolas: "dél-kelet",
    allapot: "felújított",
    leiras: "Tágas háromszobás lakás a belvárosi Hajós utcában. Teljesen felújítva 2022-ben: új villany, gép, klíma, parketta. Két fürdőszoba, nagy nappali, különálló dolgozószoba. Az Andrássy út és az Opera sétatávolságra. Kulturális élet, éttermek, coworking helyek mind közvetlen közelben.",
    tags: ["belváros","befektetés","opera-negyed","felújított","két fürdő","coworking-közel"],
  },
  {
    id: 6,
    cim: "Gyár utca 17., III. emelet",
    kerulet: "VIII. kerület, Józsefváros",
    ar: "39 800 000 Ft",
    tipus: "lakás",
    alapterulet: 55,
    szobak: 2,
    emelet: "3/4",
    tajolas: "nyugat",
    allapot: "közepes",
    leiras: "Ára alapján az egyik legjobb ajánlat Budapest belső kerületeiben. Kétszobás, közepes állapotú lakás a fejlődő Józsefvárosban. Nem igényel azonnali felújítást, belköltözhető. Befektetőknek is érdemes megvizsgálni: a kerület értéke folyamatosan nő. Tömegközlekedés előtt.",
    tags: ["olcsó","belső kerület","befektetés","közel tömegközlekedés"],
  }
];

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function PropCard({ prop, match, isTop }) {
  return (
    <div style={{
      background: '#fff',
      border: isTop ? '1.5px solid rgba(201,150,58,0.5)' : '0.5px solid rgba(28,43,58,0.12)',
      borderRadius: 12,
      padding: '12px 14px',
      marginTop: 6,
      position: 'relative'
    }}>
      {isTop && (
        <div style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 10, fontWeight: 500,
          background: '#f5ead8', color: '#7a4e10',
          padding: '2px 8px', borderRadius: 20,
          border: '0.5px solid rgba(201,150,58,0.3)'
        }}>Legjobb találat</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1C2B3A' }}>{prop.cim}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#C9963A', whiteSpace: 'nowrap' }}>{prop.ar}</div>
      </div>
      <div style={{ fontSize: 11.5, color: '#5a6b7a', marginBottom: 6 }}>
        {prop.kerulet} · {prop.alapterulet} m² · {prop.szobak} szoba · {prop.emelet}. em. · {prop.tajolas}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
        {(match.egyezesek || []).map((e, i) => (
          <span key={i} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: '#e8f5e9', color: '#2e7d32', border: '0.5px solid #a5d6a7' }}>✓ {e}</span>
        ))}
        {(match.elteresek || []).map((e, i) => (
          <span key={i} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: '#fff8e1', color: '#e65100', border: '0.5px solid #ffcc80' }}>⚠ {e}</span>
        ))}
      </div>
      {match.ai_megjegyzes && (
        <div style={{ fontSize: 12, color: '#2e4a63', background: '#e8eff6', borderRadius: 7, padding: '7px 10px', lineHeight: 1.5, borderLeft: '2px solid #2e4a63' }}>
          {match.ai_megjegyzes}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const dbJson = JSON.stringify(PROPERTIES.map(p => ({
    id: p.id, cim: p.cim, kerulet: p.kerulet, ar: p.ar,
    alapterulet: p.alapterulet + ' m²', szobak: p.szobak,
    emelet: p.emelet, tajolas: p.tajolas, allapot: p.allapot,
    leiras: p.leiras, tags: p.tags.join(', ')
  })), null, 2);

  const systemPrompt = `Te egy tapasztalt, empatikus magyar ingatlanközvetítő AI asszisztens vagy.
Az alábbi ingatlan-adatbázissal dolgozol:

${dbJson}

FELADATOD:
1. Értsd meg a felhasználó szándékát természetes, szabadszavas leírásból.
2. Keresd végig az összes ingatlan LEÍRÁSÁBAN, TAGJEIN és ADATAIN.
3. Adj vissza 1–3 legjobban illeszkedő ingatlant, magyarázd el MIÉRT illenek.
4. Ha valamit a felhasználó tévesen feltételez, finoman javítsd ki.
5. Ha nincs tökéletes találat, ajánlj alternatívát.
6. Vedd figyelembe az élethelyzetet (gyerek, állat, home office, befektetés stb.).

VÁLASZ FORMÁTUM (csak JSON, semmi más, nincs markdown keret):
{
  "bevezeto": "rövid, empatikus bevezető (1-2 mondat)",
  "talalatok": [
    {
      "id": 1,
      "egyezesek": ["miben illik"],
      "elteresek": ["miben tér el"],
      "ai_megjegyzes": "személyes megjegyzés"
    }
  ],
  "alternativa": "alternatíva szöveg vagy null",
  "zaro": "rövid záró üzenet"
}

Csak a fenti ID-kat használd. Légy természetes és segítőkész.`;

  async function send(text) {
    if (!text.trim() || busy) return;
    setShowSuggestions(false);
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    const newHistory = [...history, { role: 'user', content: text }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1500,
          system: systemPrompt,
          messages: newHistory
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'API hiba');

      const rawText = (data.content || []).map(c => c.text || '').join('');
      const clean = rawText.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);

      setHistory([...newHistory, { role: 'assistant', content: rawText }]);
      setMessages(prev => [...prev, { role: 'ai', result }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', error: err.message }]);
    }
    setBusy(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  const suggestions = [
    'Kisgyermekes család vagyunk, kert kellene',
    'Home office-hoz keresek lakást',
    'Befektetésnek keresek olcsóbbat',
    'Dunára néző, teraszos lakás'
  ];

  return (
    <>
      <Head>
        <title>IngatlanAI – Szabadszavas Kereső</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#f0f3f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ width: '100%', maxWidth: 680 }}>

          {/* Header label */}
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#96a7b5', marginBottom: 12, paddingLeft: 4 }}>
            Beágyazható widget — ingatlaniroda honlapjára
          </div>

          {/* Chat widget */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 40px rgba(28,43,58,0.12), 0 2px 8px rgba(28,43,58,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: 680,
            border: '0.5px solid rgba(28,43,58,0.18)'
          }}>

            {/* Header */}
            <div style={{ background: '#1C2B3A', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(201,150,58,0.18)', border: '0.5px solid rgba(201,150,58,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#fff', letterSpacing: -0.3 }}>IngatlanAI</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Írja le szabadon, mit keres — mindent megértünk</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 2px rgba(74,222,128,0.25)' }}></div>
                Online
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Welcome */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1C2B3A', color: '#C9963A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: "'DM Serif Display', serif", flexShrink: 0 }}>AI</div>
                <div style={{ maxWidth: '80%' }}>
                  <div style={{ background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.10)', borderRadius: '4px 18px 18px 18px', padding: '11px 15px', fontSize: 14, lineHeight: 1.6, color: '#1C2B3A' }}>
                    Üdvözlöm! Írja le szabadon, milyen ingatlant keres. Nem kell formanyomtatvány — meséljen az igényeiről természetesen.
                  </div>
                </div>
              </div>

              {/* Messages */}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'user' ? '#C9963A' : '#1C2B3A',
                    color: msg.role === 'user' ? '#fff' : '#C9963A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: msg.role === 'user' ? 12 : 13,
                    fontFamily: msg.role === 'ai' ? "'DM Serif Display', serif" : 'inherit'
                  }}>
                    {msg.role === 'user' ? '👤' : 'AI'}
                  </div>
                  <div style={{ maxWidth: '82%' }}>
                    {msg.role === 'user' ? (
                      <div style={{ background: '#1C2B3A', color: '#fff', borderRadius: '18px 4px 18px 18px', padding: '11px 15px', fontSize: 14, lineHeight: 1.6 }}>
                        {msg.text}
                      </div>
                    ) : msg.error ? (
                      <div style={{ background: '#fff3f3', border: '0.5px solid #ffcccc', borderRadius: '4px 18px 18px 18px', padding: '11px 15px', fontSize: 13, color: '#c0392b' }}>
                        Hiba: {msg.error}
                      </div>
                    ) : (
                      <div style={{ background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.10)', borderRadius: '4px 18px 18px 18px', padding: '12px 15px', fontSize: 14, lineHeight: 1.6, color: '#1C2B3A' }}>
                        {msg.result.bevezeto && <p style={{ marginBottom: 8 }}>{msg.result.bevezeto}</p>}
                        {(msg.result.talalatok || []).map((t, ti) => {
                          const prop = PROPERTIES.find(p => p.id === t.id);
                          if (!prop) return null;
                          return <PropCard key={ti} prop={prop} match={t} isTop={ti === 0} />;
                        })}
                        {msg.result.alternativa && (
                          <div style={{ marginTop: 10, background: '#e8eff6', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#2e4a63', lineHeight: 1.5 }}>
                            💡 {msg.result.alternativa}
                          </div>
                        )}
                        {msg.result.zaro && (
                          <p style={{ marginTop: 10, fontSize: 12.5, color: '#5a6b7a' }}>{msg.result.zaro}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {busy && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1C2B3A', color: '#C9963A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: "'DM Serif Display', serif", flexShrink: 0 }}>AI</div>
                  <div style={{ background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.10)', borderRadius: '4px 18px 18px 18px', padding: '13px 16px', display: 'flex', gap: 5 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#96a7b5', animation: `blink 1.3s ${i * 0.18}s infinite` }}></div>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div style={{ padding: '8px 20px 0', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)} style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 20,
                    border: '0.5px solid rgba(28,43,58,0.18)', background: '#fff',
                    color: '#5a6b7a', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all .15s'
                  }}>{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '0.5px solid rgba(28,43,58,0.10)', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
              <div style={{ flex: 1, background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.18)', borderRadius: 24, padding: '10px 16px', display: 'flex', alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'; }}
                  onKeyDown={handleKey}
                  placeholder="Pl. csendes utca, 2 gyereknek is elférünk, kutyánk van..."
                  rows={1}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1C2B3A',
                    resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 96
                  }}
                />
              </div>
              <button onClick={() => send(input)} disabled={busy || !input.trim()} style={{
                width: 38, height: 38, borderRadius: '50%', background: busy || !input.trim() ? '#96a7b5' : '#1C2B3A',
                border: 'none', color: '#C9963A', cursor: busy || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, transition: 'background .15s'
              }}>↑</button>
            </div>
            <div style={{ fontSize: 11, color: '#96a7b5', textAlign: 'center', padding: '0 16px 10px', flexShrink: 0 }}>
              Az AI az ingatlanok teljes leírásában keres — próbálja természetes mondatokkal
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,70%,100%{transform:scale(0.7);opacity:0.4} 35%{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder { color: #96a7b5; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(28,43,58,0.18); border-radius: 2px; }
      `}</style>
    </>
  );
}
