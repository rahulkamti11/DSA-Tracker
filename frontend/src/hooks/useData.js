import { useState, useEffect, useRef } from 'react';
import { today, addDays } from '../utils/date.js';
import { uid } from '../utils/id.js';
import { fetchProfile, logActivity } from '../services/auth.service.js';
import {
  fetchProblems,
  fetchTrash,
  mapProblem,
  updateProblem,
  updateProblemTrash,
  deleteProblemPermanently,
  emptyTrash as emptyTrashRequest,
  createProblem,
} from '../services/problems.service.js';
import {
  fetchCollections,
  createCollection,
  deleteCollection as deleteCollectionRequest,
} from '../services/collections.service.js';
import {
  getInitialSeedProblems,
  getInitialSeedCollections,
  getInitialSeedActivity,
} from '../utils/seedData.js';

const STORAGE_PREFIX = {
  PROBLEMS: 'dsa_local_problems',
  COLLECTIONS: 'dsa_local_collections',
  TRASH: 'dsa_local_trash',
  ACTIVITY: 'dsa_local_activity',
};

const getScopeKey = (prefix, user) => {
  const scope = (user && !user.isGuest && (user.username || user.id)) ? (user.username || user.id) : 'guest';
  return `${prefix}_${scope}`;
};

export default function useData(user, onOfflineDetected) {
  const currentScope = (user && !user.isGuest && (user.username || user.id)) ? (user.username || user.id) : 'guest';
  const prevScopeRef = useRef(currentScope);

  // 1. Initial State from LocalStorage for current scope or Default Seeds
  const [problems, setProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(getScopeKey(STORAGE_PREFIX.PROBLEMS, user));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached problems:', e);
    }
    return getInitialSeedProblems();
  });

  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(getScopeKey(STORAGE_PREFIX.COLLECTIONS, user));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter((c) => c && c.id !== 'starred');
      }
    } catch (e) {
      console.warn('Failed to parse cached collections:', e);
    }
    return getInitialSeedCollections();
  });

  const [trash, setTrash] = useState(() => {
    try {
      const saved = localStorage.getItem(getScopeKey(STORAGE_PREFIX.TRASH, user));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached trash:', e);
    }
    return [];
  });

  const [activity, setActivity] = useState(() => {
    try {
      const saved = localStorage.getItem(getScopeKey(STORAGE_PREFIX.ACTIVITY, user));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached activity:', e);
    }
    return getInitialSeedActivity();
  });

  // Switch active data immediately when user logs in or out (Prevents Data Leakage to Guest)
  useEffect(() => {
    if (prevScopeRef.current !== currentScope) {
      prevScopeRef.current = currentScope;
      try {
        const cachedProblems = localStorage.getItem(getScopeKey(STORAGE_PREFIX.PROBLEMS, user));
        const parsedProblems = cachedProblems ? JSON.parse(cachedProblems) : null;
        setProblems(Array.isArray(parsedProblems) ? parsedProblems : getInitialSeedProblems());

        const cachedCollections = localStorage.getItem(getScopeKey(STORAGE_PREFIX.COLLECTIONS, user));
        const parsedCollections = cachedCollections ? JSON.parse(cachedCollections) : null;
        setCollections(Array.isArray(parsedCollections) ? parsedCollections.filter((c) => c && c.id !== 'starred') : getInitialSeedCollections());

        const cachedTrash = localStorage.getItem(getScopeKey(STORAGE_PREFIX.TRASH, user));
        const parsedTrash = cachedTrash ? JSON.parse(cachedTrash) : null;
        setTrash(Array.isArray(parsedTrash) ? parsedTrash : []);

        const cachedActivity = localStorage.getItem(getScopeKey(STORAGE_PREFIX.ACTIVITY, user));
        const parsedActivity = cachedActivity ? JSON.parse(cachedActivity) : null;
        setActivity(parsedActivity && typeof parsedActivity === 'object' && !Array.isArray(parsedActivity) ? parsedActivity : getInitialSeedActivity());
      } catch {
        setProblems(getInitialSeedProblems());
        setCollections(getInitialSeedCollections());
        setTrash([]);
        setActivity(getInitialSeedActivity());
      }
    }
  }, [currentScope, user]);

  // 2. Continuous LocalStorage Persistence (Scoped per user/guest)
  useEffect(() => {
    if (Array.isArray(problems)) {
      try {
        localStorage.setItem(getScopeKey(STORAGE_PREFIX.PROBLEMS, user), JSON.stringify(problems));
      } catch (e) {
        console.warn('LocalStorage save error (problems):', e);
      }
    }
  }, [problems, user]);

  useEffect(() => {
    if (Array.isArray(collections) && collections.length > 0) {
      try {
        localStorage.setItem(getScopeKey(STORAGE_PREFIX.COLLECTIONS, user), JSON.stringify(collections));
      } catch (e) {
        console.warn('LocalStorage save error (collections):', e);
      }
    }
  }, [collections, user]);

  useEffect(() => {
    if (Array.isArray(trash)) {
      try {
        localStorage.setItem(getScopeKey(STORAGE_PREFIX.TRASH, user), JSON.stringify(trash));
      } catch (e) {
        console.warn('LocalStorage save error (trash):', e);
      }
    }
  }, [trash, user]);

  useEffect(() => {
    if (activity && typeof activity === 'object' && !Array.isArray(activity)) {
      try {
        localStorage.setItem(getScopeKey(STORAGE_PREFIX.ACTIVITY, user), JSON.stringify(activity));
      } catch (e) {
        console.warn('LocalStorage save error (activity):', e);
      }
    }
  }, [activity, user]);

  // 3. Sync/fetch data from backend when logged in user changes
  useEffect(() => {
    if (user && user.token && !user.isGuest) {
      fetchProblems(user.token)
        .then(data => {
          const list = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : null);
          if (list) {
            setProblems(list.map(mapProblem));
          }
        })
        .catch(err => {
          console.warn('Backend unavailable, using offline local cache (problems):', err.message);
          if (onOfflineDetected) onOfflineDetected(true);
        });

      fetchTrash(user.token)
        .then(data => {
          const list = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : null);
          if (list) {
            setTrash(list.map(mapProblem));
          }
        })
        .catch(err => {
          console.warn('Backend unavailable, using offline local cache (trash):', err.message);
          if (onOfflineDetected) onOfflineDetected(true);
        });

      fetchCollections(user.token)
        .then(data => {
          const list = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : null);
          if (Array.isArray(list)) {
            const sanitized = list.filter((c) => c && c.id !== 'starred');
            setCollections(sanitized);
            localStorage.setItem(getScopeKey(STORAGE_PREFIX.COLLECTIONS, user), JSON.stringify(sanitized));
          }
        })
        .catch(err => {
          console.warn('Backend unavailable, using offline local cache (collections):', err.message);
          if (onOfflineDetected) onOfflineDetected(true);
        });

      fetchProfile(user.token)
        .then(data => {
          if (data && data.activity && typeof data.activity === 'object' && !Array.isArray(data.activity)) {
            setActivity(data.activity);
          }
        })
        .catch(err => {
          console.warn('Backend unavailable, using offline local cache (profile):', err.message);
          if (onOfflineDetected) onOfflineDetected(true);
        });
    }
  }, [user, onOfflineDetected]);

  const logAct = () => {
    if (user && user.token && !user.isGuest) {
      logActivity(user.token)
        .then(newAct => setActivity(newAct))
        .catch(() => {
          setActivity(prev => ({ ...prev, [today()]: (prev[today()] || 0) + 1 }));
        });
    } else {
      setActivity(prev => ({ ...prev, [today()]: (prev[today()] || 0) + 1 }));
    }
  };

  const saveProblem = (probForm, probModalId) => {
    if (!probForm.name) return Promise.reject(new Error('Problem name is required'));

    const reminderInDays = Number(probForm.reminderInDays !== undefined ? probForm.reminderInDays : 3);
    const rawTags = Array.isArray(probForm.tags)
      ? probForm.tags
      : (typeof probForm.tags === 'string' ? probForm.tags.split(',') : []);
    const cleanedTags = rawTags.map(t => String(t).trim()).filter(Boolean);
    const seen = new Set();
    const uniqueTags = [];
    for (const tag of cleanedTags) {
      const lower = tag.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueTags.push(tag);
      }
    }
    const finalTags = uniqueTags.slice(0, 5);
    const isMastered = reminderInDays === -2 || probForm.status === 'Mastered';
    const computedStatus = isMastered ? 'Mastered' : probForm.status;
    const computedSolvedDate = (computedStatus === 'Solved' || computedStatus === 'Mastered')
      ? (probForm.solvedDate || probForm.date || today())
      : null;
    const computedMasteredDate = computedStatus === 'Mastered'
      ? (probForm.masteredDate || today())
      : null;

    const data = {
      ...probForm,
      status: computedStatus,
      tags: finalTags,
      platforms: (Array.isArray(probForm.platforms) ? probForm.platforms : []).filter(pl => pl && pl.platform && pl.url && pl.url.trim() !== ''),
      noRep: reminderInDays === -1 || isMastered,
      interval: (reminderInDays !== -1 && reminderInDays !== -2) ? reminderInDays : 3,
      date: probForm.date || today(),
      solvedDate: computedSolvedDate,
      masteredDate: computedMasteredDate,
    };
    delete data.reminderInDays;

    if (probModalId) {
      const p = problems.find(x => x.id === probModalId);
      const oldReminder = p?.status === 'Mastered' ? -2 : (p?.noRep ? -1 : p?.interval);
      if (oldReminder !== reminderInDays || p?.date !== data.date) {
        data.nextRev = (reminderInDays !== -1 && reminderInDays !== -2) ? addDays(data.date, reminderInDays) : null;
      }
      
      // Update local state immediately
      setProblems(probs => probs.map(x => x.id === probModalId ? { ...x, ...data } : x));

      if (user && user.token && !user.isGuest) {
        return updateProblem(user.token, probModalId, data)
          .then(updated => {
            setProblems(probs => probs.map(x => x.id === probModalId ? mapProblem(updated) : x));
          })
          .catch(err => {
            console.warn('Backend update failed, kept offline change in localStorage:', err.message);
            if (onOfflineDetected) onOfflineDetected(true);
          });
      }
      return Promise.resolve();
    } else {
      const newId = uid();
      const payload = {
        id: newId,
        ...data,
        nextRev: (reminderInDays !== -1 && reminderInDays !== -2) ? addDays(data.date, reminderInDays) : null,
        revCount: 0,
      };

      // Add to local state immediately
      setProblems(probs => [payload, ...probs]);
      logAct();

      if (user && user.token && !user.isGuest) {
        return createProblem(user.token, payload)
          .then(newProb => {
            setProblems(probs => probs.map(x => x.id === newId ? mapProblem(newProb) : x));
          })
          .catch(err => {
            console.warn('Backend create failed, kept offline problem in localStorage:', err.message);
            if (onOfflineDetected) onOfflineDetected(true);
          });
      }
      return Promise.resolve();
    }
  };

  const deleteProblem = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));
    
    // Update local state immediately
    setProblems(probs => probs.filter(x => x.id !== id));
    setTrash(t => [{ ...p, delDate: today() }, ...t]);

    if (user && user.token && !user.isGuest) {
      return updateProblemTrash(user.token, p._id || p.id, { isDeleted: true, delDate: today() })
        .catch(err => console.warn('Backend trash update failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const restoreProblem = (id) => {
    const p = trash.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found in trash'));

    // Update local state immediately
    setTrash(t => t.filter(x => x.id !== id));
    setProblems(probs => [{ ...p, delDate: null }, ...probs]);

    if (user && user.token && !user.isGuest) {
      return updateProblemTrash(user.token, p._id || p.id, { isDeleted: false })
        .catch(err => console.warn('Backend restore failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const deletePermanent = (id) => {
    const p = trash.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found in trash'));

    // Update local state immediately
    setTrash(t => t.filter(x => x.id !== id));

    if (user && user.token && !user.isGuest) {
      return deleteProblemPermanently(user.token, p._id || p.id)
        .catch(err => console.warn('Backend permanent delete failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const emptyTrash = () => {
    // Update local state immediately
    setTrash([]);

    if (user && user.token && !user.isGuest) {
      return emptyTrashRequest(user.token)
        .catch(err => console.warn('Backend empty trash failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const markReviewed = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));

    const updatedRevCount = (p.revCount || 0) + 1;
    const lastReviewedDate = today();

    // Update local state immediately
    setProblems(probs => probs.map(x => x.id === id ? { ...x, revCount: updatedRevCount, lastReviewed: lastReviewedDate } : x));
    logAct();

    if (user && user.token && !user.isGuest) {
      return updateProblem(user.token, p._id || p.id, { revCount: updatedRevCount, lastReviewed: lastReviewedDate })
        .catch(err => console.warn('Backend review update failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const setReminder = (id, days) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));

    const payload = days === -2 ? {
      noRep: true,
      status: 'Mastered',
      masteredDate: p.masteredDate || today(),
      solvedDate: p.solvedDate || p.date || today(),
      nextRev: null,
    } : {
      noRep: days === -1,
      interval: days !== -1 ? days : p.interval,
      nextRev: days !== -1 ? addDays(today(), days) : null,
    };

    // Update local state immediately
    setProblems(probs => probs.map(x => x.id === id ? { ...x, ...payload } : x));

    if (user && user.token && !user.isGuest) {
      return updateProblem(user.token, p._id || p.id, payload)
        .catch(err => console.warn('Backend reminder update failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const toggleStar = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));

    const starredState = !p.starred;

    // Update local state immediately
    setProblems(probs => probs.map(x => x.id === id ? { ...x, starred: starredState } : x));

    if (user && user.token && !user.isGuest) {
      return updateProblem(user.token, p._id || p.id, { starred: starredState })
        .catch(err => console.warn('Backend star update failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  const addCollection = (name, description, color) => {
    const id = uid();
    const newColl = { id, name, description, color };

    // Update local state immediately
    setCollections(prev => [...prev, newColl]);

    if (user && user.token && !user.isGuest) {
      return createCollection(user.token, { id, name, description, color })
        .catch(err => console.warn('Backend collection create failed, kept offline:', err.message));
    }
    return Promise.resolve(newColl);
  };

  const deleteCollection = (collId) => {
    // Update local state immediately
    setCollections(items => items.filter(item => item.id !== collId));
    setProblems(items => items.map(item => {
      const remaining = Array.isArray(item.collections) ? item.collections.filter(c => c !== collId) : [];
      return (item.collId === collId || (Array.isArray(item.collections) && item.collections.includes(collId)))
        ? { ...item, collId: remaining[0] || '', collections: remaining }
        : item;
    }));

    if (user && user.token && !user.isGuest) {
      return deleteCollectionRequest(user.token, collId)
        .catch(err => console.warn('Backend collection delete failed, kept offline:', err.message));
    }
    return Promise.resolve();
  };

  return {
    problems,
    setProblems,
    collections,
    setCollections,
    trash,
    setTrash,
    activity,
    setActivity,
    logAct,
    saveProblem,
    deleteProblem,
    restoreProblem,
    deletePermanent,
    emptyTrash,
    markReviewed,
    setReminder,
    toggleStar,
    addCollection,
    deleteCollection,
  };
}
