const API_BASE = 'http://localhost:5001/api';

export async function register(username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

export async function login(username, password) {
const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});
    return res.json();
}

export async function createSession(userId, durationMinutes) {
const res = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, durationMinutes })
});
    return res.json();
}

export async function joinSession(baristaId, sessionId) {
const res = await fetch(`${API_BASE}/sessions/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baristaId, sessionId })
});
    return res.json();
}

