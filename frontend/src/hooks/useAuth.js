import { useState, useEffect } from 'react';
import { guestLogin, authenticate, syncGuestData, updateProfile, deleteAccount } from '../services/auth.service.js';

export default function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('dsa_session') || 'null'));
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [syncProgress, setSyncProgress] = useState(false);

  // Auto guest login on mount if no user session
  useEffect(() => {
    const saved = localStorage.getItem('dsa_session');
    if (!saved) {
      guestLogin()
        .then(data => {
          setUser({ username: data.user.username, name: data.user.name, email: data.user.email || '', token: data.token, isGuest: true });
        })
        .catch(err => {
          console.warn('Backend offline, initialized offline guest session:', err.message);
          setUser({ username: 'guest', name: 'Guest User', email: '', token: null, isGuest: true });
        });
    }
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
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
          username: data.user.username,
          name: data.user.name,
          email: data.user.email || '',
          token: data.token,
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
    guestLogin()
      .then(data => {
        setUser({ username: data.user.username, name: data.user.name, email: data.user.email || '', token: data.token, isGuest: true });
      })
      .catch(() => {
        setUser({ username: 'guest', name: 'Guest User', email: '', token: null, isGuest: true });
      });
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
