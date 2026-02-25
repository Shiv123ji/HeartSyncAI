import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut, Sparkles } from 'lucide-react';
import './App.css';

export default function Chat({ userId, user, onLogout }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const res = await fetch('http://localhost:4000/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, text: input })
    });
    const data = await res.json();
    setMessages(prev => [...prev, data.assistant]);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-slate-800">HEART Sync AI</span>
        </div>
        <button onClick={onLogout} className="text-slate-400 hover:text-rose-500 flex items-center gap-2 transition-colors">
          <span className="text-sm font-medium">{user.name}</span>
          <LogOut size={18} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <Sparkles className="text-rose-400 w-12 h-12" />
            <h2 className="text-xl font-semibold text-slate-700">How are you feeling, {user.name}?</h2>
            <p className="text-slate-400 max-w-xs">I'm here to listen and support you without judgment.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{m.text}</p>
              {m.emotion && (
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mt-2">
                  Mood: {m.emotion}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto relative">
          <input 
            className="w-full pl-6 pr-16 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all"
            placeholder="Tell me what's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="absolute right-3 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-rose-500 transition-all active:scale-90">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}