import React, { useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function ProfilePage() {
  const { user, updateUserProfile, fetchUserProfile, loading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Only if changing
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const updates = { username };
      if (password) updates.password = password;
      
      await updateUserProfile(updates);
      setMessage('Profile updated successfully!');
      setPassword(''); // Clear password field
    } catch (err) {
      // Error handled by store
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Profile</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email (Read-only)
            </label>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
              {user.email}
            </div>
          </div>

          <div className="mb-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <Input
              label="New Password (Leave blank to keep current)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
