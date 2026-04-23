import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import * as auth from '../utils/auth';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',
  ADMIN_USER: {
    userId: 'admin_1',
    username: 'admin',
    displayName: 'Administrator',
    role: 'admin',
  },
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

const basePost = {
  id: 'post_1',
  title: 'Hello World',
  content: 'Welcome to WriteSpace! This is a sample blog post with some content.',
  createdAt: '2024-06-01T12:00:00Z',
  authorId: 'user_1',
  authorName: 'Alice',
};

function renderBlogCard(post = basePost) {
  return render(
    <MemoryRouter>
      <BlogCard post={post} />
    </MemoryRouter>
  );
}

describe('BlogCard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReturnValue(null);
  });

  describe('rendering post content', () => {
    it('renders the post title', () => {
      renderBlogCard();
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders the post excerpt from content', () => {
      renderBlogCard();
      expect(
        screen.getByText('Welcome to WriteSpace! This is a sample blog post with some content.')
      ).toBeInTheDocument();
    });

    it('truncates long content to 150 characters with ellipsis', () => {
      const longContent = 'A'.repeat(200);
      const post = { ...basePost, content: longContent };
      renderBlogCard(post);
      const expectedText = 'A'.repeat(150) + '…';
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it('renders the author name', () => {
      renderBlogCard();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('renders the formatted date', () => {
      renderBlogCard();
      expect(screen.getByText('Jun 1, 2024')).toBeInTheDocument();
    });

    it('truncates long titles to 80 characters with ellipsis', () => {
      const longTitle = 'B'.repeat(100);
      const post = { ...basePost, title: longTitle };
      renderBlogCard(post);
      const expectedTitle = 'B'.repeat(80) + '…';
      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
    });
  });

  describe('links', () => {
    it('renders a "Read more" link pointing to the correct blog post URL', () => {
      renderBlogCard();
      const readMoreLink = screen.getByText('Read more →');
      expect(readMoreLink).toBeInTheDocument();
      expect(readMoreLink.closest('a')).toHaveAttribute('href', '/blog/post_1');
    });

    it('renders the title as a link to the correct blog post URL', () => {
      renderBlogCard();
      const titleElement = screen.getByText('Hello World');
      const linkAncestor = titleElement.closest('a');
      expect(linkAncestor).toHaveAttribute('href', '/blog/post_1');
    });
  });

  describe('edit icon visibility', () => {
    it('does not show edit icon when user is not logged in', () => {
      auth.getSession.mockReturnValue(null);
      renderBlogCard();
      const editLink = screen.queryByTitle('Edit post');
      expect(editLink).not.toBeInTheDocument();
    });

    it('does not show edit icon when logged-in user is not the author', () => {
      auth.getSession.mockReturnValue({
        userId: 'user_2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      });
      renderBlogCard();
      const editLink = screen.queryByTitle('Edit post');
      expect(editLink).not.toBeInTheDocument();
    });

    it('shows edit icon when logged-in user is the post author', () => {
      auth.getSession.mockReturnValue({
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      renderBlogCard();
      const editLink = screen.getByTitle('Edit post');
      expect(editLink).toBeInTheDocument();
      expect(editLink.closest('a')).toHaveAttribute('href', '/blog/post_1/edit');
    });

    it('shows edit icon when logged-in user is an admin regardless of ownership', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin_1',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      renderBlogCard();
      const editLink = screen.getByTitle('Edit post');
      expect(editLink).toBeInTheDocument();
      expect(editLink.closest('a')).toHaveAttribute('href', '/blog/post_1/edit');
    });

    it('shows edit icon for admin even when post belongs to another user', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin_1',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      const post = { ...basePost, authorId: 'user_99', authorName: 'Charlie' };
      renderBlogCard(post);
      const editLink = screen.getByTitle('Edit post');
      expect(editLink).toBeInTheDocument();
    });
  });

  describe('avatar rendering', () => {
    it('renders admin avatar emoji when authorId is "admin"', () => {
      const post = { ...basePost, authorId: 'admin', authorName: 'Administrator' };
      renderBlogCard(post);
      expect(screen.getByText('👑')).toBeInTheDocument();
    });

    it('renders user avatar emoji when authorId is not "admin"', () => {
      renderBlogCard();
      expect(screen.getByText('📖')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders correctly with empty content', () => {
      const post = { ...basePost, content: '' };
      renderBlogCard(post);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders correctly with content exactly 150 characters', () => {
      const exactContent = 'C'.repeat(150);
      const post = { ...basePost, content: exactContent };
      renderBlogCard(post);
      expect(screen.getByText(exactContent)).toBeInTheDocument();
    });

    it('renders correctly with title exactly 80 characters', () => {
      const exactTitle = 'D'.repeat(80);
      const post = { ...basePost, title: exactTitle };
      renderBlogCard(post);
      expect(screen.getByText(exactTitle)).toBeInTheDocument();
    });
  });
});