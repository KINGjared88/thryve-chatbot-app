export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, userInfo, transcript } = req.body;

    if (userInfo && userInfo.email && userInfo.phone) {
      await fetch('https://hooks.zapier.com/hooks/catch/22909312/2nvugz2/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          transcript
        })
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}