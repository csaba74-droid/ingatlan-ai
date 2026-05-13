import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API kulcs nincs beállítva a szerveren.' });
  }

  const { iroda_id, lead, ...body } = req.body;

  try {
    // Ha lead adatok érkeznek, mentjük a Supabase-be
    if (lead && lead.nev && lead.telefon) {
      await supabase.from('leadek').insert({
        iroda_id: iroda_id || 'demo',
        nev: lead.nev,
        telefon: lead.telefon,
        ingatlan_id: lead.ingatlan_id || null
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Session log mentése
    await supabase.from('session_log').insert({
      iroda_id: iroda_id || 'demo',
      kerdes: body.messages?.[body.messages.length - 1]?.content || '',
      valasz: data.content?.[0]?.text || ''
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
