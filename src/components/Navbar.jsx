import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import { getSession, clearSession } from '../utils/auth';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  if (!session) {
    return null;
  }

  const isAdmin = session.role === 'admin';

  const navLinks = [];

  if (isAdmin) {
    navLinks.push({ to: '/dashboard', label: 'Dashboard' });
    navLinks.push({ to: '/users', label: 'Users' });
  }

  navLinks.push({ to: '/blogs', label: 'Blogs' });
  navLinks.push({ to: '/write', label: 'Write' });

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link
              to="/blogs"
              className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
              onClick={closeMenu}
            >
              WriteSpace
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <Avatar role={session.role} />
                <span className="text-sm font-medium text-gray-700">
                  {session.displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 px-3 py-2">
                <Avatar role={session.role} />
                <span className="text-sm font-medium text-gray-700">
                  {session.displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="w-full mt-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {};

export default Navbar;