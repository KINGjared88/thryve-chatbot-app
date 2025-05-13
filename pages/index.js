
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || limitReached) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.reply };
    const allMessages = [...newMessages, botMessage];
    setMessages(allMessages);
    setIsTyping(false);

    if (allMessages.length >= 20) {
      setLimitReached(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, textAlign: 'center' }}>Thryve AI Chatbot</h1>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 10,
        height: 400,
        overflowY: 'scroll',
        marginBottom: 10,
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <strong>{msg.role === "user" ? "You" : "Thryve"}:</strong> {msg.content}
          </div>
        ))}
        {isTyping && (
          <div><strong>Thryve:</strong> <span className="dots">...</span></div>
        )}
      </div>
      {limitReached ? (
        <div style={{ color: '#555', textAlign: 'center' }}>
          You’ve reached the message limit. <br />
          <a href="https://thryvecredit.com/consultation" style={{ color: '#0070f3' }} target="_blank">
            Book a free consultation
          </a> to continue.
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: 10,
              border: '1px solid #ccc',
              borderRadius: 4,
              marginRight: 8
            }}
          />
          <button onClick={sendMessage} style={{
            padding: '10px 16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}
