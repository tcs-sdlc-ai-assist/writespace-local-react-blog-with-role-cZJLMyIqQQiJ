import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';
import UserRow from '../components/UserRow';

export default function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/login');
      return;
    }
    setUsers(getUsers());
  }, []);

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setFormError('All fields are required.');
      return;
    }

    if (trimmedUsername.toLowerCase() === 'admin') {
      setFormError('Username "admin" is reserved.');
      return;
    }

    const currentUsers = getUsers();
    const duplicate = currentUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (duplicate) {
      setFormError('Username already exists. Please choose a different one.');
      return;
    }

    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setFormSuccess(`User "${trimmedUsername}" created successfully.`);
  }

  function handleDeleteRequest(userId) {
    setDeleteConfirm(userId);
  }

  function handleDeleteConfirm() {
    if (!deleteConfirm) return;

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== deleteConfirm);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setDeleteConfirm(null);
  }

  function handleDeleteCancel() {
    setDeleteConfirm(null);
  }

  const deleteTargetUser = deleteConfirm
    ? users.find((u) => u.id === deleteConfirm)
    : null;

  if (!session || session.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New User</h2>

          {formError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter display name"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users Table (Desktop) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Users ({users.length})
            </h2>
          </div>
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No users found. Create one above.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUserId={session.userId}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Users Cards (Mobile) */}
        <div className="md:hidden space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Users ({users.length})
          </h2>
          {users.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              No users found. Create one above.
            </div>
          ) : (
            users.map((user) => {
              const isAdmin = user.role === 'admin';
              const isSelf = user.id === session.userId;
              const canDelete = !isAdmin && !isSelf;

              let formattedDate;
              try {
                formattedDate = new Date(user.createdAt).toLocaleDateString();
              } catch {
                formattedDate = 'Unknown';
              }

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{user.displayName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isAdmin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            User
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!canDelete}
                    onClick={() => handleDeleteRequest(user.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      !canDelete
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete user{' '}
              <span className="font-medium text-gray-900">
                {deleteTargetUser ? `@${deleteTargetUser.username}` : ''}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}