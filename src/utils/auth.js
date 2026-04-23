const SESSION_KEY = 'writespace_session';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin123';

export const ADMIN_USER = {
  userId: 'admin_1',
  username: 'admin',
  displayName: 'Administrator',
  role: 'admin',
};

/**
 * Retrieve the current session from localStorage.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null}
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    console.error('Failed to read session from localStorage:', e);
    return null;
  }
}

/**
 * Save a session object to localStorage.
 * @param {{ userId: string, username: string, displayName: string, role: string }} session
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session to localStorage:', e);
  }
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session from localStorage:', e);
  }
}