import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js'
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SessionRoom from './components/SessionRoom';
import './App.css';

function App() {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser));
    }
    setLoading(false);
}, []);

const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
    }

    return (
    <Router>
        <div className="App">
        {user && (
            <nav className="navbar">
            <div className="nav-brand">☕ Brewing</div>
            <div className="nav-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/session">Session Room</a>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            </nav>
        )}
        
        <Routes>
            <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
        />
            <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />
            <Route 
            path="/session" 
            element={user ? <SessionRoom user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
        </div>
    </Router>
    );
}

export default App;