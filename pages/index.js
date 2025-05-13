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

    const delay = Math.floor(Math.random() * 5000) + 5000;
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
    <div style={{
      fontFamily: 'Arial',
      padding: 10,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Thryve Chatbot</h3>
      <div ref={chatRef} style={{
        flex: 1,
        border: '1px solid #ccc',
        padding: 10,
        overflowY: 'scroll',
        marginBottom: 10
      }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role === 'user' ? 'You' : 'Thryve'}:</strong> {msg.content}</div>
        ))}
        {isTyping && <div><em>Thryve is typing...</em></div>}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 16px', marginLeft: 8 }}>Send</button>
      </div>
    </div>
  );
}