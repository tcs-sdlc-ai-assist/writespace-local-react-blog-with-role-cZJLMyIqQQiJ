import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import Avatar from './Avatar';

export function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600 tracking-tight">
              WriteSpace
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link
                  to={session.role === 'admin' ? '/dashboard' : '/blogs'}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-150 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  {session.role === 'admin' ? 'Dashboard' : 'Blogs'}
                </Link>
                <Link
                  to={session.role === 'admin' ? '/dashboard' : '/blogs'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <Avatar role={session.role === 'admin' ? 'admin' : 'user'} />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {session.displayName}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-150 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;