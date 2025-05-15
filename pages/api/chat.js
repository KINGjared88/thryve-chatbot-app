// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid request: message is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are the AI assistant for Thryve Credit Solutions, a professional and trusted credit repair company...",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: `OpenAI Error: ${error}` });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn’t catch that. Can you try again?";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("API handler error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
