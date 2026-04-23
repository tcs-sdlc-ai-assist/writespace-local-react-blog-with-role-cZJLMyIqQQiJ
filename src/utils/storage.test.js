import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts from localStorage', () => {
      const posts = [
        {
          id: 'post_1',
          title: 'Hello World',
          content: 'Welcome to WriteSpace!',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'user_1',
          authorName: 'Alice',
        },
        {
          id: 'post_2',
          title: 'Second Post',
          content: 'Another post.',
          createdAt: '2024-06-02T12:00:00Z',
          authorId: 'user_2',
          authorName: 'Bob',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('uses the correct localStorage key "writespace_posts"', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getPosts();
      expect(spy).toHaveBeenCalledWith('writespace_posts');
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read posts from localStorage:',
        expect.any(Error)
      );
    });

    it('returns an empty array when localStorage value is null', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts to localStorage with correct key', () => {
      const posts = [
        {
          id: 'post_1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'user_1',
          authorName: 'Alice',
        },
      ];

      savePosts(posts);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).toBe(JSON.stringify(posts));
    });

    it('uses the correct localStorage key "writespace_posts"', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      const posts = [];
      savePosts(posts);
      expect(spy).toHaveBeenCalledWith('writespace_posts', JSON.stringify(posts));
    });

    it('serializes posts as JSON', () => {
      const posts = [
        {
          id: 'post_1',
          title: 'Hello',
          content: 'World',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'user_1',
          authorName: 'Alice',
        },
      ];

      savePosts(posts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('handles localStorage.setItem throwing without crashing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => savePosts([{ id: 'post_1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save posts to localStorage:',
        expect.any(Error)
      );
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: 'post_1', title: 'First' }];
      const updatedPosts = [{ id: 'post_1', title: 'Updated' }, { id: 'post_2', title: 'New' }];

      savePosts(initialPosts);
      savePosts(updatedPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(updatedPosts);
    });

    it('saves an empty array', () => {
      savePosts([]);
      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users from localStorage', () => {
      const users = [
        {
          id: 'user_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
    });

    it('uses the correct localStorage key "writespace_users"', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getUsers();
      expect(spy).toHaveBeenCalledWith('writespace_users');
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', 'corrupted{{{data');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getUsers();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getUsers();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read users from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('saveUsers', () => {
    it('saves users to localStorage with correct key', () => {
      const users = [
        {
          id: 'user_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ];

      saveUsers(users);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).toBe(JSON.stringify(users));
    });

    it('uses the correct localStorage key "writespace_users"', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      const users = [];
      saveUsers(users);
      expect(spy).toHaveBeenCalledWith('writespace_users', JSON.stringify(users));
    });

    it('serializes users as JSON', () => {
      const users = [
        {
          id: 'user_1',
          displayName: 'Bob',
          username: 'bob',
          password: 'pass',
          role: 'admin',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ];

      saveUsers(users);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('handles localStorage.setItem throwing without crashing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => saveUsers([{ id: 'user_1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save users to localStorage:',
        expect.any(Error)
      );
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: 'user_1', username: 'alice' }];
      const updatedUsers = [{ id: 'user_1', username: 'alice_updated' }, { id: 'user_2', username: 'bob' }];

      saveUsers(initialUsers);
      saveUsers(updatedUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(updatedUsers);
    });

    it('saves an empty array', () => {
      saveUsers([]);
      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });
  });

  describe('round-trip integration', () => {
    it('can save and retrieve posts correctly', () => {
      const posts = [
        {
          id: 'post_1',
          title: 'Round Trip',
          content: 'Testing round trip',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'user_1',
          authorName: 'Alice',
        },
      ];

      savePosts(posts);
      const result = getPosts();
      expect(result).toEqual(posts);
    });

    it('can save and retrieve users correctly', () => {
      const users = [
        {
          id: 'user_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ];

      saveUsers(users);
      const result = getUsers();
      expect(result).toEqual(users);
    });

    it('posts and users do not interfere with each other', () => {
      const posts = [{ id: 'post_1', title: 'Post' }];
      const users = [{ id: 'user_1', username: 'alice' }];

      savePosts(posts);
      saveUsers(users);

      expect(getPosts()).toEqual(posts);
      expect(getUsers()).toEqual(users);
    });
  });
});