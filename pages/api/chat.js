export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const body = await req.json();
  const message = body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "That's a great question. You can book a free consultation here: https://thryvecredit.com/consultation";
  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" },
  });
}
