import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import {
  loginAdminMock,
  loginMock,
  registerMock,
  type AuthResult,
  type Credentials,
  type Registration,
  type User,
} from '../features/auth/auth';

type AuthContextData = {
  user: User | null;
  login: (credentials: Credentials) => AuthResult;
  loginAdmin: (credentials: Credentials) => AuthResult;
  register: (data: Registration) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  function login(credentials: Credentials): AuthResult {
    const result = loginMock(credentials);

    if (result.ok) {
      setUser(result.user);
    }

    return result;
  }

  function loginAdmin(credentials: Credentials): AuthResult {
    const result = loginAdminMock(credentials);

    if (result.ok) {
      setUser(result.user);
    }

    return result;
  }

  function register(data: Registration): AuthResult {
    const result = registerMock(data);

    if (result.ok) {
      setUser(result.user);
    }

    return result;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginAdmin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser utilizado dentro de AuthProvider.',
    );
  }

  return context;
}