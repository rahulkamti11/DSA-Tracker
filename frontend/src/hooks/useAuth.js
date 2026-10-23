import { useState, useEffect } from 'react';
import { authenticate, syncGuestData, updateProfile, deleteAccount } from '../services/auth.service.js';

const DEFAULT_GUEST_USER = {
  username: 'guest',
  name: 'Guest User',
  email: '',
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

  const handleUpdateProfile = async ({ name, username, email, password }) => {
    if (user?.isGuest || user?.username === 'guest') {
      throw new Error('Guest profile cannot be modified. Please log in or register an account.');
    }

    const res = await updateProfile({
      token: user?.token,
      name,
      username,
      email: email || undefined,
      password: password || undefined,
    });

    const updatedUser = {
      ...user,
      username: res.user.username,
      name: res.user.name,
      email: res.user.email || '',
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
    await deleteAccount(user?.token);
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
