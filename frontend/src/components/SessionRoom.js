import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function CreateSession({ user }) {
  const [duration, setDuration] = useState(25);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/sessions`,
        {
          userId: user._id,
          durationMinutes: parseInt(duration)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Navigate to sessions page after creating
      navigate('/sessions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  // Quick duration options
  const quickOptions = [15, 25, 45, 60, 90, 120];

  return (
    <div className="create-session-container">
      <div className="form-card">
        <h2>☕ Create Study Session</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="duration">Session Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="300"
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              marginBottom: '1rem', 
              color: '#5D573F', 
              fontWeight: 500 
            }}>
              Quick Select:
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '0.75rem' 
            }}>
              {quickOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: duration === mins ? '#9D6A59' : '#F0E5E3',
                    color: duration === mins ? 'white' : '#472317',
                    border: '2px solid #B9A49F',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#F0E5E3', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #A48A50'
          }}>
            <p style={{ margin: 0, color: '#472317' }}>
              <strong>Tip:</strong> Use the Pomodoro technique! 25 minutes of focused study 
              followed by a 5-minute break is scientifically proven to boost productivity. ☕
            </p>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Session...' : '🚀 Start Session'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a 
            href="/sessions" 
            style={{ 
              color: '#9D6A59', 
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            ← View All Sessions
          </a>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;