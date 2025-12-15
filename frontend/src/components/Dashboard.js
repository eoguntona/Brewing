import { useNavigate } from 'react-router-dom';

function Dashboard({ user, setUser }) {
    const navigate = useNavigate();

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

return (
    <div className="dashboard">
      {/* Welcome Section */}
        <div className="welcome-section">
            <h1>Welcome back, {user.username}!</h1>
            <p className="barista-id">Barista ID: {user.baristaId}</p>
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

      {/* Quick Actions */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
                onClick={() => navigate('/session')}
                className="btn-primary" 
                style={{ maxWidth: '300px', margin: '0 auto' }}
        >
            ☕ Start New Study Session
        </button>
        </div>
    </div>
    );
}

export default Dashboard;