import type { ReactNode, useState } from 'react';
import { AuthContext } from '.';
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  return <AuthContext value={user}>{children}</AuthContext>;
};
export default AuthProvider;
