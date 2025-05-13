import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.reply };
    setMessages((prev) => [...prev, userMessage, botMessage]);
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: 20 }}>
      <h1>Thryve AI Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 400, overflowY: 'scroll', marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role === "user" ? "You" : "Thryve"}:</strong> {msg.content}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ padding: 10, width: '80%' }}
      />
      <button onClick={sendMessage} style={{ padding: 10 }}>Send</button>
    </div>
  );
}
