import { useState } from 'react';

export default function useAuth() {
  // Read from local storage "file" on initialization
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // Save user "file"
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Delete user "file"
    setUser(null);
  };

  return { user, login, logout };
}