import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login, me, logout, register, refresh } from '@/data';
import type { User, LoginData, RegisterData, AuthContextType } from '@/types';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkSession, setCheckSession] = useState(true);

  const refreshSession = async () => {
    const { accessToken } = await refresh();
    localStorage.setItem('accessToken', accessToken);
  };
  const loadUser = async () => {
    const data = await me();
    setUser(data);
    setSignedIn(true);
  };
  const clearSession = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setSignedIn(false);
  };
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // if there is no access token try to refresh and store and then get the profile otherwise if there is a token just fetch the profile
        if (!localStorage.getItem('accessToken')) {
          await refreshSession();
        }
        await loadUser();
      } catch (error) {
        console.error(error);
        // if the fetching fails that might be expired token so we try to refresh and fetch one more time
        try {
          await refreshSession();
          await loadUser();
        } catch (refreshError) {
          // if we didn't get the user then we remove the accessToken if any and set the user to null
          console.error(refreshError);
          clearSession();
        }
      } finally {
        setCheckSession(false);
      }
    };

    if (checkSession) initializeAuth();
  }, [checkSession]);

  const handleSignIn = async ({ email, password }: LoginData) => {
    const { accessToken } = await login({ email, password });
    localStorage.setItem('accessToken', accessToken);
    setCheckSession(true);
  };

  const handleRegister = async (formState: RegisterData) => {
    const { accessToken } = await register(formState);
    localStorage.setItem('accessToken', accessToken);
    setCheckSession(true);
  };

  const handleSignOut = async () => {
    await logout();
    clearSession();
  };

  const value: AuthContextType = {
    signedIn,
    user,
    handleSignIn,
    handleSignOut,
    handleRegister,
  };
  return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
