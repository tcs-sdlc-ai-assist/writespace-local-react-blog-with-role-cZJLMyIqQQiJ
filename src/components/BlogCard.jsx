import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { getSession } from '../utils/auth';

const ACCENT_COLORS = [
  'border-blue-500',
  'border-violet-500',
  'border-emerald-500',
  'border-rose-500',
  'border-amber-500',
  'border-cyan-500',
  'border-pink-500',
  'border-indigo-500',
];

function getAccentColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}

function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function BlogCard({ post }) {
  const session = getSession();
  const accentColor = getAccentColor(post.id);
  const excerpt = truncate(post.content, 150);

  const canEdit =
    session &&
    (session.role === 'admin' ||
      (session.role === 'user' && session.userId === post.authorId));

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-l-4 ${accentColor} hover:shadow-lg transition-shadow duration-200 flex flex-col`}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar role={post.authorId === 'admin' ? 'admin' : 'user'} />
            <span className="text-sm font-medium text-gray-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(post.createdAt)}
          </span>
        </div>

        <Link to={`/blog/${post.id}`} className="group flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150 mb-2">
            {truncate(post.title, 80)}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{excerpt}</p>
        </Link>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <Link
            to={`/blog/${post.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          >
            Read more →
          </Link>

          {canEdit && (
            <Link
              to={`/blog/${post.id}/edit`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
              title="Edit post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogCard;