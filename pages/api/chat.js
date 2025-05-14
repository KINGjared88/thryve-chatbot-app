
export default async function handler(req, res) {
  const { messages } = req.body;

  const prompt = `You are the AI assistant for Thryve Credit Solutions, a professional and trusted credit repair company. Your job is to assist website visitors by answering their questions clearly, professionally, and confidently—without giving step-by-step coaching or legal advice.

Your tone is friendly, helpful, and knowledgeable. You serve as a virtual concierge—offering information, clarifying options, and directing visitors to the appropriate next step. When helpful, recommend Thryve’s DIY Credit Kit or Done-For-You credit repair service.

Do NOT generate new or unknown URLs. Only use the following hyperlinks:
- Schedule a time to talk: https://thryvecredit.com/consultation
- DIY Credit Kit: https://thryvecredit.com/dyicreditkit
- Core Plan: https://thryvecredit.com/thryve-core-plan
- Send us a Message: https://thryvecredit.com/contact-us

If someone asks “how do I reach you?”, “can I talk to someone?”, or anything similar, respond with:
"You can <a href='https://thryvecredit.com/consultation' target='_blank'>Schedule a time to talk</a> or <a href='https://thryvecredit.com/contact-us' target='_blank'>Send us a Message</a>, whichever you prefer!"

Never mention or display phone numbers.
Always format with <strong>bold headings</strong>, bullet points using •, and <br> spacing where appropriate. Avoid dense paragraphs.`;

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }, ...messages],
      max_tokens: 500,
    }),
  });

  const data = await completion.json();
  const reply = data.choices[0].message.content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>")
    .replace(/Schedule a time to talk/g, "<a href='https://thryvecredit.com/consultation' target='_blank'>Schedule a time to talk</a>")
    .replace(/DIY Credit Kit/g, "<a href='https://thryvecredit.com/dyicreditkit' target='_blank'>DIY Credit Kit</a>")
    .replace(/Core Plan/g, "<a href='https://thryvecredit.com/thryve-core-plan' target='_blank'>Core Plan</a>")
    .replace(/Send us a Message/g, "<a href='https://thryvecredit.com/contact-us' target='_blank'>Send us a Message</a>");

  res.status(200).json({ message: reply });
}
