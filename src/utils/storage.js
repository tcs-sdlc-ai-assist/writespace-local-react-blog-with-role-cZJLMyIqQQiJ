const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieve all posts from localStorage.
 * @returns {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>}
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to read posts from localStorage:', e);
    return [];
  }
}

/**
 * Save posts array to localStorage.
 * @param {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>} posts
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to localStorage:', e);
  }
}

/**
 * Retrieve all users from localStorage.
 * @returns {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>}
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to read users from localStorage:', e);
    return [];
  }
}

/**
 * Save users array to localStorage.
 * @param {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>} users
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage:', e);
  }
}