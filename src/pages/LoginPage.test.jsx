import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as auth from '../utils/auth';
import * as storage from '../utils/storage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',
  ADMIN_USER: {
    userId: 'admin_1',
    username: 'admin',
    displayName: 'Administrator',
    role: 'admin',
  },
}));

vi.mock('../utils/storage', () => ({
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getPosts: vi.fn(),
  savePosts: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.getSession.mockReturnValue(null);
    storage.getUsers.mockReturnValue([]);
  });

  describe('rendering', () => {
    it('renders the sign in heading', () => {
      renderLoginPage();
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });

    it('renders username and password inputs', () => {
      renderLoginPage();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the sign in button', () => {
      renderLoginPage();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('renders a link to the register page', () => {
      renderLoginPage();
      const registerLink = screen.getByText('Register');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('redirect when already authenticated', () => {
    it('redirects admin user to /admin when already logged in', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin_1',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      renderLoginPage();
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('redirects regular user to /blogs when already logged in', () => {
      auth.getSession.mockReturnValue({
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      renderLoginPage();
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  describe('validation', () => {
    it('shows error when both fields are empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
      expect(auth.setSession).not.toHaveBeenCalled();
    });

    it('shows error when username is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'someuser');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('shows error when username is only whitespace', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });
  });

  describe('successful admin login', () => {
    it('logs in admin with correct credentials and navigates to /admin', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).toHaveBeenCalledWith({
        userId: 'admin_1',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('successful user login', () => {
    it('logs in a regular user with correct credentials and navigates to /blogs', async () => {
      const user = userEvent.setup();
      storage.getUsers.mockReturnValue([
        {
          id: 'user_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ]);
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).toHaveBeenCalledWith({
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('logs in a user with admin role and navigates to /admin', async () => {
      const user = userEvent.setup();
      storage.getUsers.mockReturnValue([
        {
          id: 'user_2',
          displayName: 'Bob Admin',
          username: 'bobadmin',
          password: 'pass456',
          role: 'admin',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ]);
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'bobadmin');
      await user.type(screen.getByLabelText('Password'), 'pass456');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).toHaveBeenCalledWith({
        userId: 'user_2',
        username: 'bobadmin',
        displayName: 'Bob Admin',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('failed login', () => {
    it('shows error message for invalid credentials', async () => {
      const user = userEvent.setup();
      storage.getUsers.mockReturnValue([]);
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'wronguser');
      await user.type(screen.getByLabelText('Password'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
      expect(auth.setSession).not.toHaveBeenCalled();
    });

    it('shows error for correct username but wrong password', async () => {
      const user = userEvent.setup();
      storage.getUsers.mockReturnValue([
        {
          id: 'user_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ]);
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
      expect(auth.setSession).not.toHaveBeenCalled();
    });

    it('shows error for admin username with wrong password', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
      expect(auth.setSession).not.toHaveBeenCalled();
    });
  });

  describe('error clearing', () => {
    it('clears previous error on new submission attempt', async () => {
      const user = userEvent.setup();
      storage.getUsers.mockReturnValue([
        {
          id: 'user_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
      ]);
      renderLoginPage();

      // First attempt with wrong credentials
      await user.type(screen.getByLabelText('Username'), 'wronguser');
      await user.type(screen.getByLabelText('Password'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));
      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();

      // Clear fields and try with correct credentials
      await user.clear(screen.getByLabelText('Username'));
      await user.clear(screen.getByLabelText('Password'));
      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.queryByText('Invalid username or password.')).not.toBeInTheDocument();
      expect(auth.setSession).toHaveBeenCalled();
    });
  });
});