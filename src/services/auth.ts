import type { UserSession } from '../types';

const AUTH_KEY = 'givenear_user_session';

export const getSavedUser = (): UserSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') return parsed as UserSession;
    return null;
  } catch {
    return null;
  }
};

export const saveUser = (user: UserSession): void => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {
    // storage unavailable
  }
};

export const clearUser = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // storage unavailable
  }
};
