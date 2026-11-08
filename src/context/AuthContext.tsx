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
import type { CompanyRegistration } from '../features/companies/accounts';
import { useCompanies } from './CompaniesContext';

type AuthContextData = {
  user: User | null;
  login: (credentials: Credentials) => AuthResult;
  loginAdmin: (credentials: Credentials) => AuthResult;
  loginCompany: (credentials: Credentials) => AuthResult;
  register: (data: Registration) => AuthResult;
  requestCompany: (data: CompanyRegistration) => { ok: true } | { ok: false; message: string };
  approveCompany: (companyId: string) => { ok: true } | { ok: false; message: string };
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
  const { store } = useCompanies();

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

  function loginCompany(credentials: Credentials): AuthResult {
    const result = store.login(credentials);

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
        loginCompany,
        register,
        requestCompany: store.request,
        approveCompany: (companyId) => store.approve(companyId, user),
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
