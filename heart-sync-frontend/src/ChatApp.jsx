import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Activity } from 'lucide-react';
import './ChatApp.css';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickReplies = ["How is my heart today?", "Give me a calm exercise", "Check my stress level"];

  async function send(textToSend = input) {
    if (!textToSend.trim()) return;
    
    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:4000/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-123', text: textToSend })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.assistant.text, 
        emotion: data.assistant.emotion 
      }]);
      setEmotion(data.assistant.emotion || 'neutral');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Server logic failed. Check connection." }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className={`chat-container theme-${emotion}`}>
      <header className="chat-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Heart fill={emotion === 'neutral' ? 'var(--primary)' : 'transparent'} color="var(--primary)" size={24} />
          <h2 style={{margin: 0, fontSize: '1.2rem'}}>HEART SYNC AI</h2>
        </div>
        <svg className="ecg-wave" viewBox="0 0 100 20">
          <path d="M0 10 L30 10 L35 0 L45 20 L50 10 L100 10" />
        </svg>
      </header>

      <div className="messages-area">
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.role}`}>
            <div className="bubble">{m.text}</div>
            {m.emotion && <div className="emotion-tag">STATUS: {m.emotion}</div>}
          </div>
        ))}
        
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="typing">
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="chips-row">
        {quickReplies.map(reply => (
          <button key={reply} className="chip" onClick={() => send(reply)}>{reply}</button>
        ))}
      </div>

      <footer className="input-area">
        <div className="input-pill">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Tell me how your heart feels..."
          />
          <button className="send-btn" onClick={() => send()}>
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}