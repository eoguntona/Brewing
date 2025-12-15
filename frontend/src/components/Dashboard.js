import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Badge definitions
  const badges = [
    { name: 'Espresso', icon: '☕', requirement: 60, key: 'espresso' },
    { name: 'Latte', icon: '🥛', requirement: 180, key: 'latte' },
    { name: 'Cappuccino', icon: '🍵', requirement: 300, key: 'cappuccino' },
    { name: 'Master Brewer', icon: '🏆', requirement: 500, key: 'master' }
  ];

  // Calculate hours and minutes
  const totalMinutes = user.totalMinutesStudied || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Find next badge
  const getNextBadge = () => {
    for (let badge of badges) {
      if (totalMinutes < badge.requirement) {
        return {
          name: badge.name,
          icon: badge.icon,
          remaining: badge.requirement - totalMinutes
        };
      }
    }
    return { name: 'All Complete!', icon: '✨', remaining: 0 };
  };

  const nextBadge = getNextBadge();

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleEndSession();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Start timer and create session
  const handleStartTimer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/sessions`,
        {
          userId: user._id,
          durationMinutes: selectedDuration
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCurrentSessionId(response.data._id);
      setTimeLeft(selectedDuration * 60); // Convert minutes to seconds
      setIsTimerActive(true);
    } catch (err) {
      console.error('Error starting session:', err);
      alert('Failed to start session');
    }
  };

  // End session and update user stats
  const handleEndSession = async () => {
    if (!currentSessionId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/sessions/end`,
        { sessionId: currentSessionId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch updated user data
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      setIsTimerActive(false);
      setTimeLeft(0);
      setCurrentSessionId(null);
      alert('🎉 Session completed! Great work!');
    } catch (err) {
      console.error('Error ending session:', err);
      setIsTimerActive(false);
      setTimeLeft(0);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick duration options
  const quickOptions = [15, 25, 45, 60];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, {user.username}!</h1>
        <p className="barista-id">Barista ID: {user.baristaId}</p>
      </div>

      {/* Timer Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        marginBottom: '2rem',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#472317', marginBottom: '1.5rem' }}>
          {isTimerActive ? '⏱️ Session in Progress' : '☕ Start a Study Session'}
        </h2>

        {!isTimerActive ? (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#5D573F', marginBottom: '1rem', fontWeight: 500 }}>
                Select Duration:
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '1rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {quickOptions.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSelectedDuration(mins)}
                    style={{
                      padding: '1rem',
                      backgroundColor: selectedDuration === mins ? '#9D6A59' : '#F0E5E3',
                      color: selectedDuration === mins ? 'white' : '#472317',
                      border: '3px solid #B9A49F',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartTimer}
              className="btn-primary"
              style={{ 
                maxWidth: '300px', 
                margin: '0 auto',
                fontSize: '1.1rem',
                padding: '1rem 2rem'
              }}
            >
              🚀 Start {selectedDuration} Min Session
            </button>
          </>
        ) : (
          <>
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#9D6A59',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              {formatTime(timeLeft)}
            </div>

            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '10px',
              backgroundColor: '#F0E5E3',
              borderRadius: '10px',
              margin: '1rem auto',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                backgroundColor: '#9D6A59',
                width: `${(timeLeft / (selectedDuration * 60)) * 100}%`,
                transition: 'width 1s linear'
              }} />
            </div>

            <p style={{ color: '#5D573F', marginBottom: '1.5rem' }}>
              Keep going! You're doing great! 💪
            </p>

            <button
              onClick={handleEndSession}
              className="btn-secondary"
              style={{ 
                backgroundColor: '#AA6B59',
                color: 'white',
                maxWidth: '200px',
                margin: '0 auto'
              }}
            >
              End Session Early
            </button>
          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Study Time</h3>
          <div className="stat-value">{totalMinutes} min</div>
          <p style={{ color: '#5D573F', marginTop: '0.5rem' }}>
            {hours}h {minutes}m
          </p>
        </div>

        <div className="stat-card">
          <h3>Badges Earned</h3>
          <div className="stat-value">{user.badges?.length || 0}</div>
          <p style={{ color: '#5D573F', marginTop: '0.5rem' }}>
            out of {badges.length}
          </p>
        </div>

        <div className="stat-card">
          <h3>Next Badge</h3>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            {nextBadge.icon} {nextBadge.name}
          </div>
          <p style={{ color: '#5D573F', marginTop: '0.5rem' }}>
            {nextBadge.remaining > 0 ? `${nextBadge.remaining} min to go` : 'Amazing!'}
          </p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="badges-section">
        <h2>Your Badges</h2>
        <div className="badges-grid">
          {badges.map((badge) => {
            const earned = user.badges?.includes(badge.key);
            return (
              <div 
                key={badge.key}
                className={`badge ${earned ? 'earned' : ''}`}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {badge.name}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  {badge.requirement} minutes
                </div>
                {earned && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    ✓ Earned
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;