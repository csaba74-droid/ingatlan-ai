import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { iroda_id, ingatlanok } = req.body;

  if (!iroda_id || !ingatlanok?.length) {
    return res.status(400).json({ error: 'Hiányzó adatok!' });
  }

  // Töröljük a régi ingatlanokat
  await supabase.from('ingatlanok').delete().eq('iroda_id', iroda_id);

  // Feltöltjük az újakat
  const { error } = await supabase.from('ingatlanok').insert(
    ingatlanok.map(ing => ({ ...ing, iroda_id }))
  );

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true, count: ingatlanok.length });
}
