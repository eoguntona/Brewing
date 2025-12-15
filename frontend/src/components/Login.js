import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../Api';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const data = await login(username, password);
        if (data.token) {
            onLogin(data);
        } else {
            setError(data.message || 'Login failed');
        }
    } catch (err) {
        setError('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
}

return (
    <div className="auth-container">
        <div className="auth-card">
        <h2>☕ Welcome to Brewing</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>

        <div className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
        </div>
        </div>
    </div>
    );
}

export default Login;