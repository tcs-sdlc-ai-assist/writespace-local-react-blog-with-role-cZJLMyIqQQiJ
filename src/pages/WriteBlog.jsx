import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';

const TITLE_MAX = 100;
const CONTENT_MAX = 5000;

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '', general: '' });
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditing) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setErrors((prev) => ({ ...prev, general: 'Post not found.' }));
        setLoading(false);
        return;
      }

      const canEdit =
        session.role === 'admin' || session.userId === post.authorId;

      if (!canEdit) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
  }, [id, isEditing, navigate, session]);

  function validate() {
    const newErrors = { title: '', content: '', general: '' };
    let valid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
      valid = false;
    } else if (title.length > TITLE_MAX) {
      newErrors.title = `Title must be ${TITLE_MAX} characters or less.`;
      valid = false;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required.';
      valid = false;
    } else if (content.length > CONTENT_MAX) {
      newErrors.content = `Content must be ${CONTENT_MAX} characters or less.`;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      const posts = getPosts();

      if (isEditing) {
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
          setErrors((prev) => ({ ...prev, general: 'Post not found.' }));
          return;
        }

        const post = posts[postIndex];
        const canEdit =
          session.role === 'admin' || session.userId === post.authorId;

        if (!canEdit) {
          setErrors((prev) => ({
            ...prev,
            general: 'You do not have permission to edit this post.',
          }));
          return;
        }

        posts[postIndex] = {
          ...post,
          title: title.trim(),
          content: content.trim(),
        };

        savePosts(posts);
        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: 'post_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName,
        };

        savePosts([newPost, ...posts]);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: 'Failed to save post. Please try again.',
      }));
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading…</p>
      </div>
    );
  }

  if (errors.general && isEditing && !title && !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-4">{errors.general}</p>
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX}
              placeholder="Enter your post title"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.title ? (
                <p className="text-sm text-red-600">{errors.title}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400">
                {title.length}/{TITLE_MAX}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={CONTENT_MAX}
              rows={12}
              placeholder="Write your blog post content here…"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.content ? (
                <p className="text-sm text-red-600">{errors.content}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400">
                {content.length}/{CONTENT_MAX}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              {isEditing ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}