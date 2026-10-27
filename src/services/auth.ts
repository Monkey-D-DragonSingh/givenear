import type { UserAccount, UserSession, UserRole } from '../types';

const USERS_KEY = 'givenear_users_v1';
const SESSION_KEY = 'givenear_user_session_v1';

export const DEMO_ACCOUNTS: Record<
  UserRole,
  { email: string; password: string; name: string; phone: string; regNumber?: string; representative?: string }
> = {
  donor: {
    email: 'donor@givenear.org',
    password: 'donor123',
    name: 'Rahul Sharma',
    phone: '+91 98111 22334'
  },
  ngo: {
    email: 'ngo@givenear.org',
    password: 'ngo123',
    name: 'Asha Kiran Shiksha Samiti',
    phone: '+91 94520 11223',
    representative: 'Ramesh Maurya'
  }
};

// Demo-grade password hash (cyrb53). Not for production backends, just avoids
// storing plain-text passwords in the browser demo database.
const hashPassword = (pw: string): string => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < pw.length; i++) {
    const ch = pw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
};

export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isValidPassword = (password: string): boolean => password.length >= 6;
export const isValidPhone = (phone: string): boolean => phone.replace(/[^0-9]/g, '').length >= 7;

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
};

const makeDemoAccount = (role: UserRole): UserAccount => {
  const demo = DEMO_ACCOUNTS[role];
  return {
    email: demo.email,
    passwordHash: hashPassword(demo.password),
    name: demo.name,
    phone: demo.phone,
    role,
    regNumber: demo.regNumber,
    representative: demo.representative,
    createdAt: new Date().toISOString()
  };
};

const getUsers = (): UserAccount[] => {
  const users = readJSON<UserAccount[]>(USERS_KEY, []);
  if (users.length === 0) {
    const seeded = [makeDemoAccount('donor'), makeDemoAccount('ngo')];
    writeJSON(USERS_KEY, seeded);
    return seeded;
  }
  return users;
};

export const getAccountByEmail = (email: string): UserAccount | undefined => {
  const normalized = email.trim().toLowerCase();
  return getUsers().find((u) => u.email === normalized);
};

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  regNumber?: string;
  representative?: string;
}

export const register = (input: RegisterInput): UserSession => {
  const email = input.email.trim().toLowerCase();
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error('An account with this email already exists. Please login instead.');
  }
  const account: UserAccount = {
    email,
    passwordHash: hashPassword(input.password),
    name: input.name.trim(),
    phone: input.phone.trim(),
    role: input.role,
    regNumber: input.regNumber?.trim() || undefined,
    representative: input.representative?.trim() || undefined,
    createdAt: new Date().toISOString()
  };
  writeJSON(USERS_KEY, [...users, account]);

  const session: UserSession = {
    email: account.email,
    name: account.name,
    phone: account.phone,
    role: account.role,
    loggedInAt: new Date().toISOString(),
    regNumber: account.regNumber,
    representative: account.representative
  };
  saveUser(session);
  return session;
};

export interface LoginInput {
  email: string;
  password: string;
  role?: UserRole;
}

export const login = (input: LoginInput): UserSession => {
  const account = getAccountByEmail(input.email);
  if (!account) {
    throw new Error('No account found for this email. Please register first.');
  }
  if (account.passwordHash !== hashPassword(input.password)) {
    throw new Error('Incorrect password. Please try again.');
  }
  if (input.role && account.role !== input.role) {
    throw new Error(
      `This account is registered as a ${account.role === 'donor' ? 'donor' : 'NGO'} account. Please login with the correct role.`
    );
  }

  const session: UserSession = {
    email: account.email,
    name: account.name,
    phone: account.phone,
    role: account.role,
    loggedInAt: new Date().toISOString(),
    regNumber: account.regNumber,
    representative: account.representative
  };
  saveUser(session);
  return session;
};

export const logout = (): void => {
  clearUser();
};

export const getSavedUser = (): UserSession | null => {
  const session = readJSON<UserSession | null>(SESSION_KEY, null);
  if (!session || !session.email || !session.name || !session.role) return null;
  return session;
};

export const saveUser = (session: UserSession): void => {
  writeJSON(SESSION_KEY, session);
};

export const clearUser = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable
  }
};
