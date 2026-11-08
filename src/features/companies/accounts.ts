import {
  emailPattern,
  isPasswordLongEnough,
  loginCompanyMock,
  normalizeEmail,
  type AuthResult,
  type Credentials,
  type User,
} from '../auth/auth';
import type { RegisteredCompany } from './companies';

export type CompanyRegistration = Credentials & {
  companyName: string;
  responsibleName: string;
  confirmPassword: string;
};

type OperationResult = { ok: true } | { ok: false; message: string };
type CompanyAccount = { id: string; companyId: string; password: string };

// Demonstração local: credenciais ficam nesta closure, sem persistência.
// Uma autenticação de produção exige um backend.
export function createCompanyStore() {
  let companies: RegisteredCompany[] = [{
    id: 'nimbus-analytics',
    name: 'Nimbus Analytics',
    responsibleName: 'Equipe Nimbus Analytics',
    email: 'empresa@test.com',
    status: 'approved',
    requestedAt: '2026-01-01T00:00:00.000Z',
    approvedAt: '2026-01-01T00:00:00.000Z',
  }];
  const accounts = new Map<string, CompanyAccount>();
  const listeners = new Set<() => void>();
  let nextId = 1;

  function publish(nextCompanies: RegisteredCompany[]) {
    companies = nextCompanies;
    listeners.forEach((listener) => listener());
  }

  function request(data: CompanyRegistration): OperationResult {
    const name = data.companyName.trim();
    const responsibleName = data.responsibleName.trim();
    const email = normalizeEmail(data.email);
    if (!name || !responsibleName || !email || !data.password || !data.confirmPassword) {
      return { ok: false, message: 'Preencha todos os campos.' };
    }
    if (!emailPattern.test(email)) return { ok: false, message: 'Informe um e-mail válido.' };
    if (!isPasswordLongEnough(data.password)) {
      return { ok: false, message: 'Use uma senha com pelo menos 6 caracteres.' };
    }
    if (data.password !== data.confirmPassword) {
      return { ok: false, message: 'As senhas não coincidem.' };
    }
    if (companies.some((company) => company.email === email)) {
      return { ok: false, message: 'Já existe uma conta empresarial com este e-mail.' };
    }

    const companyId = `company-request-${nextId++}`;
    accounts.set(email, { id: `account:${companyId}`, companyId, password: data.password });
    publish([...companies, {
      id: companyId, name, responsibleName, email,
      status: 'pending', requestedAt: new Date().toISOString(),
    }]);
    return { ok: true };
  }

  function login(credentials: Credentials): AuthResult {
    const email = normalizeEmail(credentials.email);
    const account = accounts.get(email);
    // Mantém as mensagens de validação e o acesso da conta mockada existente.
    if (!account) return loginCompanyMock(credentials);
    if (credentials.password !== account.password) {
      return { ok: false, message: 'E-mail ou senha incorretos.' };
    }
    const company = companies.find((item) => item.id === account.companyId);
    if (!company) return { ok: false, message: 'E-mail ou senha incorretos.' };
    if (company.status !== 'approved') {
      return { ok: false, message: 'Seu cadastro está aguardando aprovação do TEIA.' };
    }
    return { ok: true, user: {
      id: account.id, name: company.responsibleName, email: company.email,
      role: 'empresa', companyId: company.id,
    } };
  }

  function approve(companyId: string, actor: User | null): OperationResult {
    if (actor?.role !== 'administrativo') {
      return { ok: false, message: 'Somente o administrativo TEIA pode aprovar empresas.' };
    }
    const company = companies.find((item) => item.id === companyId);
    if (!company || company.status !== 'pending') {
      return { ok: false, message: 'Esta solicitação não está mais pendente.' };
    }
    publish(companies.map((item) => item.id !== companyId ? item : {
      ...item, status: 'approved', approvedAt: new Date().toISOString(),
    }));
    return { ok: true };
  }

  return {
    request, login, approve,
    getSnapshot: (): readonly RegisteredCompany[] => companies,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}
