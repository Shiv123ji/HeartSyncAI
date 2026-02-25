import React, { useState } from 'react';
import '../App.css'; 

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mode = isRegister ? 'register' : 'login';
    const res = await fetch(`http://localhost:4000/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.token) onLogin(data);
    else alert(data.error);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isRegister ? 'Join Us' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />}
          <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" className="btn-primary">Go</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} style={{background: 'none', border: 'none', color: 'blue', marginTop: '10px'}}>
            Switch to {isRegister ? 'Login' : 'Signup'}
        </button>
      </div>
    </div>
  );
}