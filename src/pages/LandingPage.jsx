import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import PublicNavbar from '../components/PublicNavbar';
import BlogCard from '../components/BlogCard';

const features = [
  {
    icon: '✍️',
    title: 'Write',
    description:
      'Create beautiful blog posts with a clean, distraction-free writing experience. Focus on your words and let WriteSpace handle the rest.',
  },
  {
    icon: '🌍',
    title: 'Share',
    description:
      'Publish your stories and ideas with the community. Share your unique perspective and connect with readers who care.',
  },
  {
    icon: '⚙️',
    title: 'Manage',
    description:
      'Organize your content effortlessly. Edit, update, or remove posts anytime with powerful management tools built right in.',
  },
];

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = getSession();

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    setLatestPosts(sorted);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Your Space to Write
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            A modern, distraction-free blogging platform. Share your ideas, stories, and
            knowledge with the world — beautifully.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {session ? (
              <Link
                to={session.role === 'admin' ? '/dashboard' : '/blogs'}
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg bg-white text-indigo-700 shadow-md hover:bg-indigo-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Go to {session.role === 'admin' ? 'Dashboard' : 'Blogs'}
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg bg-white text-indigo-700 shadow-md hover:bg-indigo-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              WriteSpace gives you the tools to create, share, and manage your content
              with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-gray-50 py-16 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Latest Posts
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Discover the most recent stories from our community.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading posts…</p>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to share something amazing with the community.
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Join WriteSpace
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                WriteSpace
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm hover:text-white transition-colors duration-150"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm hover:text-white transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-white transition-colors duration-150"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}