import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [favIds, setFavIds] = useState([]);

  // load the saved property ids whenever the user changes
  useEffect(() => {
    if (!user) {
      setFavIds([]);
      return;
    }
    api.get('/favourites/ids').then(setFavIds).catch(() => {});
  }, [user]);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) => saveSession(await api.post('/auth/login', { email, password }));
  const register = async (form) => saveSession(await api.post('/auth/register', form));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleFavourite = async (propertyId) => {
    const data = await api.post(`/favourites/${propertyId}`);
    setFavIds(data.ids);
  };

  return (
    <AuthContext.Provider value={{ user, favIds, login, register, logout, toggleFavourite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
