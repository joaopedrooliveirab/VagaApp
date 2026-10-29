export type Role = 'aluno' | 'administrativo';

export type User = {
  name: string;
  email: string;
  role: Role;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Registration = Credentials & {
  name: string;
  confirmPassword: string;
};

export type AuthResult =
  | {
      ok: true;
      user: User;
    }
  | {
      ok: false;
      message: string;
    };

const mockUser: User = {
  name: 'João',
  email: 'aluno@test.com',
  role: 'aluno',
};

const mockPassword = '123456';

const mockAdmin: User = {
  name: 'Equipe TEIA',
  email: 'admin@teia.com',
  role: 'administrativo',
};

const mockAdminPassword = 'teia123';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function loginMock({
  email,
  password,
}: Credentials): AuthResult {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return {
      ok: false,
      message: 'Preencha o e-mail e a senha.',
    };
  }

  if (!emailPattern.test(normalizedEmail)) {
    return {
      ok: false,
      message: 'Informe um e-mail válido.',
    };
  }

  const validEmail = normalizedEmail === mockUser.email;
  const validPassword = password === mockPassword;

  if (!validEmail || !validPassword) {
    return {
      ok: false,
      message: 'E-mail ou senha incorretos.',
    };
  }

  return {
    ok: true,
    user: { ...mockUser },
  };
}

export function loginAdminMock({
  email,
  password,
}: Credentials): AuthResult {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return {
      ok: false,
      message: 'Preencha o e-mail e a senha.',
    };
  }

  if (!emailPattern.test(normalizedEmail)) {
    return {
      ok: false,
      message: 'Informe um e-mail válido.',
    };
  }

  const validEmail = normalizedEmail === mockAdmin.email;
  const validPassword = password === mockAdminPassword;

  if (!validEmail || !validPassword) {
    return {
      ok: false,
      message: 'E-mail ou senha incorretos.',
    };
  }

  return {
    ok: true,
    user: { ...mockAdmin },
  };
}

export function registerMock({
  name,
  email,
  password,
  confirmPassword,
}: Registration): AuthResult {
  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  if (
    !normalizedName ||
    !normalizedEmail ||
    !password ||
    !confirmPassword
  ) {
    return {
      ok: false,
      message: 'Preencha todos os campos.',
    };
  }

  if (!emailPattern.test(normalizedEmail)) {
    return {
      ok: false,
      message: 'Informe um e-mail válido.',
    };
  }

  if (password.trim().length < 6) {
    return {
      ok: false,
      message: 'Use uma senha com pelo menos 6 caracteres.',
    };
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      message: 'As senhas não coincidem.',
    };
  }

  return {
    ok: true,
    user: {
      name: normalizedName,
      email: normalizedEmail,
      role: 'aluno',
    },
  };
}

// aluno: aluno@test.com e 123456
// administrativo (TEIA): admin@teia.com e teia123