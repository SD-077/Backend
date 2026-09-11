import { createContext, use } from 'react';
import AuthProvider from './AuthProvider';
const AuthContext = createContext<any | null>(null);

const useAuth = () => {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth must be used within authProvider');
  return context;
};

export { AuthContext, useAuth, AuthProvider };
