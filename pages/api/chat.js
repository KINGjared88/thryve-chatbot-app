export default async function handler(req, res) {
  const messages = req.body.messages || [];
  const systemPrompt = `
You are Thryve, a friendly and knowledgeable assistant for Thryve Credit Solutions.
Your job is to help users understand credit repair, credit plans, budgeting, and timelines—without giving legal advice.

If someone asks how to contact support or how to reach someone, say:
"You can [Schedule a time to talk](https://thryvecredit.com/consultation) or [Send us a Message](https://thryvecredit.com/contact-us)."

When answering, always format your response using **Markdown-style formatting**:
• Use **bold** for headers
• Use bullet points (•) for lists
• Add **two line breaks (\n\n)** between each bullet or paragraph for clean spacing
• Keep answers skimmable like a real conversation
• Use emojis (🧾, 📦, 💳) where it helps with clarity
• Avoid dense paragraphs
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I had trouble responding.";
  res.status(200).json({ reply });
}
