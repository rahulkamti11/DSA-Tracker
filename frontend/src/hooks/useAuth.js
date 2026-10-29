import { useState, useEffect } from 'react';
import { authenticate, syncGuestData, updateProfile, deleteAccount, fetchProfile } from '../services/auth.service.js';

const DEFAULT_GUEST_USER = {
  username: 'guest',
  name: 'Guest User',
  email: '',
  gender: 'prefer_not_to_say',
  avatar: 'ninja',
  token: null,
  isGuest: true,
};

export default function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dsa_session');
      return saved ? JSON.parse(saved) : DEFAULT_GUEST_USER;
    } catch {
      return DEFAULT_GUEST_USER;
    }
  });
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [syncProgress, setSyncProgress] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user && !user.isGuest) {
      localStorage.setItem('dsa_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('dsa_session');
    }
  }, [user]);

  // Background profile sync: ensures changes made on PC (avatar, gender, name) reflect on mobile seamlessly
  useEffect(() => {
    if (user && user.token && !user.isGuest) {
      try {
        const req = fetchProfile(user.token);
        if (req && typeof req.then === 'function') {
          req
            .then((profile) => {
              if (profile) {
                setUser((prev) => {
                  if (!prev || prev.isGuest) return prev;
                  const newAvatar = profile.avatar || 'ninja';
                  const newGender = profile.gender || 'prefer_not_to_say';
                  const newName = profile.name || prev.name;
                  const newUsername = profile.username || prev.username;
                  const newEmail = profile.email || '';

                  if (
                    prev.avatar === newAvatar &&
                    prev.gender === newGender &&
                    prev.name === newName &&
                    prev.username === newUsername &&
                    prev.email === newEmail
                  ) {
                    return prev;
                  }

                  const updated = {
                    ...prev,
                    name: newName,
                    username: newUsername,
                    email: newEmail,
                    gender: newGender,
                    avatar: newAvatar,
                  };
                  localStorage.setItem('dsa_session', JSON.stringify(updated));
                  return updated;
                });
              }
            })
            .catch((err) => {
              console.warn('Could not sync user profile with backend on mount:', err.message);
            });
        }
      } catch (err) {
        console.warn('Error initiating background profile sync:', err.message);
      }
    }
  }, [user?.token, user?.isGuest]);

  const handleAuth = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get('username');
    const email = fd.get('email');
    const password = fd.get('password');
    const name = fd.get('name') || username;

    authenticate({ authMode, username, email, password, name })
      .then(data => {
        const newUser = {
          id: data.user.id || data.user._id,
          username: data.user.username,
          name: data.user.name,
          email: data.user.email || '',
          gender: data.user.gender || 'prefer_not_to_say',
          avatar: data.user.avatar || 'ninja',
          token: data.token,
          isGuest: false,
        };
        localStorage.setItem('dsa_session', JSON.stringify(newUser));
        
        if (syncProgress) {
          let payload = {};
          try {
            payload = {
              problems: JSON.parse(localStorage.getItem('dsa_local_problems_guest') || localStorage.getItem('dsa_local_problems') || '[]'),
              collections: JSON.parse(localStorage.getItem('dsa_local_collections_guest') || localStorage.getItem('dsa_local_collections') || '[]'),
              trash: JSON.parse(localStorage.getItem('dsa_local_trash_guest') || localStorage.getItem('dsa_local_trash') || '[]'),
              activity: JSON.parse(localStorage.getItem('dsa_local_activity_guest') || localStorage.getItem('dsa_local_activity') || '{}'),
            };
          } catch {
            payload = {};
          }
          return syncGuestData(data.token, payload)
            .then(() => {
              // Clear guest storage after successful migration to new account
              localStorage.removeItem('dsa_local_problems_guest');
              localStorage.removeItem('dsa_local_collections_guest');
              localStorage.removeItem('dsa_local_trash_guest');
              localStorage.removeItem('dsa_local_activity_guest');
              setUser(newUser);
              setAuthModal(false);
              setAuthError('');
              setSyncProgress(false);
            });
        } else {
          setUser(newUser);
          setAuthModal(false);
          setAuthError('');
        }
      })
      .catch(err => {
        setAuthError(err.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('dsa_session');
    setUser(DEFAULT_GUEST_USER);
  };

  const handleUpdateProfile = async ({ name, username, email, password, gender, avatar }) => {
    if (user?.isGuest || user?.username === 'guest') {
      throw new Error('Guest profile cannot be modified. Please log in or register an account.');
    }

    const res = await updateProfile({
      token: user?.token,
      name,
      username,
      email: email || undefined,
      password: password || undefined,
      gender: gender !== undefined ? gender : undefined,
      avatar: avatar !== undefined ? avatar : undefined,
    });

    const updatedUser = {
      ...user,
      username: res.user.username,
      name: res.user.name,
      email: res.user.email || '',
      gender: res.user.gender || user.gender || 'prefer_not_to_say',
      avatar: res.user.avatar || user.avatar || 'ninja',
      token: res.token || user.token,
    };
    setUser(updatedUser);
    localStorage.setItem('dsa_session', JSON.stringify(updatedUser));
    return {
      success: true,
      message: res.message || 'Profile updated successfully!',
      user: updatedUser,
    };
  };

  const handleDeleteAccount = async () => {
    if (user?.isGuest || user?.username === 'guest') {
      throw new Error('Guest account cannot be deleted.');
    }
    const username = user?.username;
    const userId = user?.id;

    await deleteAccount(user?.token);

    // Purge local browser storage caches scoped to this user
    if (username) {
      localStorage.removeItem(`dsa_problems_${username}`);
      localStorage.removeItem(`dsa_collections_${username}`);
      localStorage.removeItem(`dsa_trash_${username}`);
      localStorage.removeItem(`dsa_activity_${username}`);
    }
    if (userId && userId !== username) {
      localStorage.removeItem(`dsa_problems_${userId}`);
      localStorage.removeItem(`dsa_collections_${userId}`);
      localStorage.removeItem(`dsa_trash_${userId}`);
      localStorage.removeItem(`dsa_activity_${userId}`);
    }

    handleLogout();
  };

  return {
    user,
    setUser,
    authModal,
    setAuthModal,
    authMode,
    setAuthMode,
    authError,
    setAuthError,
    syncProgress,
    setSyncProgress,
    handleAuth,
    handleLogout,
    handleUpdateProfile,
    handleDeleteAccount,
  };
}
