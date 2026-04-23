import PropTypes from 'prop-types';

export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-violet-800 text-sm font-semibold select-none">
        👑
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 text-sm font-semibold select-none">
      📖
    </span>
  );
}

export default function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};