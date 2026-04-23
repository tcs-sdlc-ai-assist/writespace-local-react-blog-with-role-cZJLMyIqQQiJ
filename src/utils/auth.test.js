import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSession,
  setSession,
  clearSession,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ADMIN_USER,
} from './auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('constants', () => {
    it('exports ADMIN_USERNAME as "admin"', () => {
      expect(ADMIN_USERNAME).toBe('admin');
    });

    it('exports ADMIN_PASSWORD as "admin123"', () => {
      expect(ADMIN_PASSWORD).toBe('admin123');
    });

    it('exports ADMIN_USER with correct shape', () => {
      expect(ADMIN_USER).toEqual({
        userId: 'admin_1',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns parsed session from localStorage', () => {
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('uses the correct localStorage key "writespace_session"', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getSession();
      expect(spy).toHaveBeenCalledWith('writespace_session');
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_session', '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getSession();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns null when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getSession();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read session from localStorage:',
        expect.any(Error)
      );
    });

    it('returns null when localStorage value is null', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns an admin session correctly', () => {
      localStorage.setItem('writespace_session', JSON.stringify(ADMIN_USER));

      const result = getSession();
      expect(result).toEqual(ADMIN_USER);
      expect(result.role).toBe('admin');
    });
  });

  describe('setSession', () => {
    it('saves session to localStorage with correct key', () => {
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };

      setSession(session);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBe(JSON.stringify(session));
    });

    it('uses the correct localStorage key "writespace_session"', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      setSession(session);
      expect(spy).toHaveBeenCalledWith('writespace_session', JSON.stringify(session));
    });

    it('serializes session as JSON', () => {
      const session = {
        userId: 'user_2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      };

      setSession(session);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('handles localStorage.setItem throwing without crashing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() =>
        setSession({ userId: 'user_1', username: 'alice', displayName: 'Alice', role: 'user' })
      ).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save session to localStorage:',
        expect.any(Error)
      );
    });

    it('overwrites existing session in localStorage', () => {
      const initialSession = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      const updatedSession = {
        userId: 'user_2',
        username: 'bob',
        displayName: 'Bob',
        role: 'admin',
      };

      setSession(initialSession);
      setSession(updatedSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(updatedSession);
    });

    it('saves admin session correctly', () => {
      setSession(ADMIN_USER);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(ADMIN_USER);
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('uses the correct localStorage key "writespace_session"', () => {
      const spy = vi.spyOn(Storage.prototype, 'removeItem');
      clearSession();
      expect(spy).toHaveBeenCalledWith('writespace_session');
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('handles localStorage.removeItem throwing without crashing', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => clearSession()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear session from localStorage:',
        expect.any(Error)
      );
    });

    it('only removes session key and does not affect other localStorage data', () => {
      localStorage.setItem('writespace_session', JSON.stringify({ userId: 'user_1' }));
      localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'post_1' }]));
      localStorage.setItem('writespace_users', JSON.stringify([{ id: 'user_1' }]));

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
      expect(localStorage.getItem('writespace_posts')).not.toBeNull();
      expect(localStorage.getItem('writespace_users')).not.toBeNull();
    });
  });

  describe('round-trip integration', () => {
    it('can save and retrieve a session correctly', () => {
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };

      setSession(session);
      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns null after clearing a session', () => {
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };

      setSession(session);
      clearSession();
      const result = getSession();
      expect(result).toBeNull();
    });

    it('can set, clear, and set a new session', () => {
      const session1 = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      const session2 = {
        userId: 'admin_1',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      };

      setSession(session1);
      expect(getSession()).toEqual(session1);

      clearSession();
      expect(getSession()).toBeNull();

      setSession(session2);
      expect(getSession()).toEqual(session2);
    });

    it('session does not interfere with posts or users storage', () => {
      const session = {
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      const posts = [{ id: 'post_1', title: 'Post' }];
      const users = [{ id: 'user_1', username: 'alice' }];

      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      localStorage.setItem('writespace_users', JSON.stringify(users));
      setSession(session);

      expect(getSession()).toEqual(session);
      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);
    });
  });
});