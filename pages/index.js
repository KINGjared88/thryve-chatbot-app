import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const sendMessage = async () => {
    if (!input.trim() || messageCount >= 10) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.reply };
    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
    setMessageCount(prev => prev + 1);
  };

  return (
    <div style={{
      fontFamily: "Arial",
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#fff",
      padding: "16px",
      width: "320px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      zIndex: 9999
    }}>
      <h3>Thryve Chatbot</h3>
      <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.role === "user" ? "You" : "Thryve"}:</strong> {msg.content}</div>
        ))}
        {loading && <div><em>Thryve is typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></em></div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask me anything..."
        style={{ width: "70%", padding: "6px" }}
      />
      <button onClick={sendMessage} style={{ padding: "6px", marginLeft: "5px" }}>Send</button>
    </div>
  );
}
