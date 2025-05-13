import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    const delay = Math.floor(Math.random() * 11000) + 5000;
    setTimeout(() => {
      const botMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMessage].slice(-20));
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: 20, position: 'fixed', bottom: 20, right: 20, width: 350, backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h3>Thryve Chatbot</h3>
      <div ref={chatRef} style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll', marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role === 'user' ? 'You' : 'Thryve'}:</strong> {msg.content}</div>
        ))}
        {isTyping && <div><em>Thryve is typing...</em></div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        style={{ padding: 10, width: '75%' }}
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 8 }}>Send</button>
    </div>
  );
}
