export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nev, telefon, iroda_email, iroda_nev } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'IngatlanAI <onboarding@resend.dev>',
        to: iroda_email || 'lenard.csaba74@gmail.com',
        subject: `Új érdeklődő érkezett — ${iroda_nev || 'Demo Iroda'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #1C2B3A; padding: 24px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #C9963A; margin: 0; font-size: 20px;">🏠 Új érdeklődő érkezett!</h2>
              <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 14px;">${iroda_nev || 'Demo Iroda'} — IngatlanAI</p>
            </div>
            <div style="background: #f7f8fa; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e6ec;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #5a6b7a; font-size: 13px; width: 120px;">Név:</td>
                  <td style="padding: 10px 0; color: #1C2B3A; font-size: 15px; font-weight: 500;">${nev}</td>
                </tr>
                <tr style="border-top: 1px solid #e0e6ec;">
                  <td style="padding: 10px 0; color: #5a6b7a; font-size: 13px;">Telefon:</td>
                  <td style="padding: 10px 0; color: #1C2B3A; font-size: 15px; font-weight: 500;">${telefon}</td>
                </tr>
                <tr style="border-top: 1px solid #e0e6ec;">
                  <td style="padding: 10px 0; color: #5a6b7a; font-size: 13px;">Időpont:</td>
                  <td style="padding: 10px 0; color: #1C2B3A; font-size: 13px;">${new Date().toLocaleString('hu-HU', {timeZone: 'Europe/Budapest'})}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; background: #e8f5e9; border-radius: 8px; padding: 14px; border-left: 3px solid #66bb6a;">
                <p style="margin: 0; color: #2e7d32; font-size: 13px;">💡 Ez az érdeklődő az IngatlanAI chatboten keresztül adta meg elérhetőségét. Hívja vissza mielőbb!</p>
              </div>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Email hiba');
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
