import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as auth from '../utils/auth';

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

function renderWithRouter(initialRoute, role) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute role={role}>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReturnValue(null);
  });

  describe('unauthenticated users', () => {
    it('redirects to /login when no session exists', () => {
      auth.getSession.mockReturnValue(null);
      renderWithRouter('/protected');
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login when no session exists and admin role is required', () => {
      auth.getSession.mockReturnValue(null);
      renderWithRouter('/protected', 'admin');
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated regular users', () => {
    const userSession = {
      userId: 'user_1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };

    it('renders protected content when user is authenticated and no role is required', () => {
      auth.getSession.mockReturnValue(userSession);
      renderWithRouter('/protected');
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to /blogs when non-admin user accesses admin-only route', () => {
      auth.getSession.mockReturnValue(userSession);
      renderWithRouter('/protected', 'admin');
      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('does not redirect when role prop is undefined', () => {
      auth.getSession.mockReturnValue(userSession);
      renderWithRouter('/protected', undefined);
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('authenticated admin users', () => {
    const adminSession = {
      userId: 'admin_1',
      username: 'admin',
      displayName: 'Administrator',
      role: 'admin',
    };

    it('renders protected content when admin accesses a route with no role requirement', () => {
      auth.getSession.mockReturnValue(adminSession);
      renderWithRouter('/protected');
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders protected content when admin accesses an admin-only route', () => {
      auth.getSession.mockReturnValue(adminSession);
      renderWithRouter('/protected', 'admin');
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('does not redirect admin users from admin routes', () => {
      auth.getSession.mockReturnValue(adminSession);
      renderWithRouter('/protected', 'admin');
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('children rendering', () => {
    it('renders children when authorized', () => {
      auth.getSession.mockReturnValue({
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      renderWithRouter('/protected');
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders complex children when authorized', () => {
      auth.getSession.mockReturnValue({
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });
  });

  describe('getSession integration', () => {
    it('calls getSession to check authentication', () => {
      auth.getSession.mockReturnValue(null);
      renderWithRouter('/protected');
      expect(auth.getSession).toHaveBeenCalled();
    });

    it('calls getSession on each render', () => {
      auth.getSession.mockReturnValue({
        userId: 'user_1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      renderWithRouter('/protected');
      expect(auth.getSession).toHaveBeenCalledTimes(1);
    });
  });
});