import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { iroda_id, feed_url } = req.body;
  if (!iroda_id || !feed_url) {
    return res.status(400).json({ error: 'Hiányzó adatok!' });
  }

  try {
    // Letöltjük az XML feedet
    const response = await fetch(feed_url);
    if (!response.ok) throw new Error('XML feed nem elérhető!');
    const xmlText = await response.text();

    // XML feldolgozás regex-szel
    const ingatlanok = [];
    const ingatlanMatches = xmlText.matchAll(/<ingatlan>([\s\S]*?)<\/ingatlan>/g);

    for (const match of ingatlanMatches) {
      const block = match[1];

      const get = (tag) => {
        const m = block.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`, 's'));
        return m ? m[1].trim() : '';
      };

      // Képek kinyerése
      const kepek = [];
      const kepMatches = block.matchAll(/<kep>(.*?)<\/kep>/g);
      for (const k of kepMatches) {
        kepek.push(k[1].trim());
      }

      ingatlanok.push({
        iroda_id,
        cim: get('cim'),
        kerulet: get('kerulet'),
        ar: get('ar') + ' Ft',
        tipus: get('tipus'),
        alapterulet: parseInt(get('alapterulet')) || null,
        szobak: parseInt(get('szobak')) || null,
        leiras: get('leiras'),
        tags: get('tags') ? get('tags').split(';').map(t => t.trim()) : [],
        kep_url: kepek[0] || null,
        kepek_json: JSON.stringify(kepek),
        adatlap_url: get('adatlap_url') || null,
        aktiv: true
      });
    }

    if (ingatlanok.length === 0) {
      return res.status(400).json({ error: 'Nem találtunk ingatlanokat az XML feedben!' });
    }

    // Töröljük a régi adatokat
    await supabase.from('ingatlanok').delete().eq('iroda_id', iroda_id);

    // Feltöltjük az újakat
    const { error } = await supabase.from('ingatlanok').insert(ingatlanok);
    if (error) throw new Error(error.message);

    // Frissítjük az iroda feed URL-jét
    await supabase.from('irodak')
      .update({ feed_url })
      .eq('iroda_id', iroda_id);

    return res.status(200).json({ ok: true, count: ingatlanok.length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
