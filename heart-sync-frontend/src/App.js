import React from 'react';
import useAuth from './useAuth';
import Login from './components/Login';
import Chat from './Chat';
import './App.css';

function App() {
  const { user, login, logout } = useAuth();

  if (!user) return <Login onLogin={login} />;

  return <Chat user={user} onLogout={logout} />;
}

export default App;