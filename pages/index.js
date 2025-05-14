import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      const delay = Math.floor(Math.random() * 2000) + 2000;
      setTimeout(() => {
        const botMessage = { role: 'assistant', content: data.reply };
        setMessages(prev => [...prev, botMessage].slice(-20));
        setIsTyping(false);
      }, delay);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong. Try again later.' }]);
      setIsTyping(false);
    }
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

  const closeChat = () => {
    window.parent.postMessage({ action: 'closeThryveChat' }, '*');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      maxWidth: 400,
      maxHeight: 600,
      margin: '0 auto',
      padding: 10,
      fontFamily: 'Arial',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <button onClick={closeChat} style={{
        position: 'absolute',
        top: 5,
        right: 5,
        background: 'transparent',
        border: 'none',
        fontSize: 18,
        cursor: 'pointer'
      }}>×</button>

      <h3 style={{ margin: '0 0 10px 0' }}>Thryve Chatbot</h3>
      <div ref={chatRef} style={{
        flex: 1,
        border: '1px solid #ccc',
        padding: 10,
        overflowY: 'auto',
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: 12,
            backgroundColor: msg.role === 'user' ? '#e0f7fa' : '#ffffff',
            padding: '10px 14px',
            borderRadius: 12,
            maxWidth: '100%',
            wordWrap: 'break-word',
            lineHeight: 1.5
          }}>
            <strong>{msg.role === 'user' ? 'You' : 'Thryve'}:</strong> {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{
            backgroundColor: '#ffffff',
            padding: '10px 14px',
            borderRadius: '12px',
            maxWidth: '60px',
            marginBottom: 12,
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: 20
          }}>
            ...
          </div>
        )}
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