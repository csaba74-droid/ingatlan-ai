import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { iroda_id, jelszo } = req.body;
  
  const { data, error } = await supabase
    .from('irodak')
    .select('*')
    .eq('iroda_id', iroda_id)
    .eq('jelszo', jelszo)
    .single();
    
  if (error || !data) {
    return res.status(401).json({ error: 'Hibás azonosító vagy jelszó!' });
  }
  
  return res.status(200).json({ iroda: data });
}

export const config = {
  api: {
    bodyParser: true,
  },
};
