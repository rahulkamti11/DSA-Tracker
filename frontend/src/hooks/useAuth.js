import { useState, useEffect } from 'react';
import { guestLogin, authenticate, syncGuestData, updateProfile } from '../services/auth.service.js';

export default function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('dsa_session') || 'null'));
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [syncProgress, setSyncProgress] = useState(false);

  // Auto guest login on mount if no user session
  useEffect(() => {
    if (!user) {
      guestLogin()
        .then(data => {
          setUser({ username: data.user.username, name: data.user.name, token: data.token, isGuest: true });
        })
        .catch(err => {
          console.warn('Backend offline, initialized offline guest session:', err.message);
          setUser({ username: 'guest', name: 'Guest User', token: null, isGuest: true });
        });
    }
  }, [user]);

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
    const password = fd.get('password');
    const name = fd.get('name') || username;

    authenticate({ authMode, username, password, name })
      .then(data => {
        const newUser = { username: data.user.username, name: data.user.name, token: data.token };
        localStorage.setItem('dsa_session', JSON.stringify(newUser));
        
        if (syncProgress) {
          return syncGuestData(data.token)
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
    setUser(null);
  };

  const handleUpdateProfile = async ({ name, username, password }) => {
    if (user?.isGuest || user?.username === 'guest') {
      throw new Error('Guest profile cannot be modified. Please log in or register an account.');
    }

    const res = await updateProfile({
      token: user?.token,
      name,
      username,
      password: password || undefined,
    });

    const updatedUser = {
      ...user,
      username: res.user.username,
      name: res.user.name,
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
  };
}
