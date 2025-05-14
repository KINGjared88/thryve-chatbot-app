import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "**Hello! How can I assist you today?**\n\n😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      <div style={{
        width: 350,
        height: 500,
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <div style={{ padding: "10px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>
          Thryve Chatbot
        </div>
        <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                margin: "8px 0",
                whiteSpace: "pre-wrap",
                backgroundColor: msg.role === "user" ? "#e0f7fa" : "#f1f8e9",
                padding: "10px",
                borderRadius: 8,
                fontSize: 14,
              }}
              dangerouslySetInnerHTML={{ __html: marked.parse(msg.role === "assistant" ? msg.content : `**You:** ${msg.content}`) }}
            />
          ))}
          {loading && <div>Typing<span className="dots">...</span></div>}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding: 10, display: "flex", borderTop: "1px solid #eee" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={sendMessage} style={{ marginLeft: 8, padding: "8px 12px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
