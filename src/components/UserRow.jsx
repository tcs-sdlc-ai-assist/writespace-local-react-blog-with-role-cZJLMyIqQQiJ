import PropTypes from 'prop-types';
import Avatar from './Avatar.jsx';

export function UserRow({ user, currentUserId, onDelete }) {
  const isAdmin = user.role === 'admin';
  const isSelf = user.id === currentUserId;
  const deleteDisabled = isAdmin || isSelf;

  const roleBadge = isAdmin ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
      User
    </span>
  );

  const formattedDate = (() => {
    try {
      return new Date(user.createdAt).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  })();

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar role={user.role} />
          <div>
            <p className="font-medium text-gray-900">{user.displayName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {roleBadge}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formattedDate}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          disabled={deleteDisabled}
          onClick={() => onDelete(user.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            deleteDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
          }`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;