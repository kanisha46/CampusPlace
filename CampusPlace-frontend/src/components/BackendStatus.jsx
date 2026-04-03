import { useState, useEffect } from 'react';
import { backendWarmer } from '../utils/backendWarmer';
import './BackendStatus.css';

export default function BackendStatus() {
  const [status, setStatus] = useState('checking');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    checkBackendHealth();
    
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    const isHealthy = await backendWarmer.checkHealth();
    setStatus(isHealthy ? 'online' : 'offline');
    
    // Show status for 3 seconds only if offline
    if (!isHealthy) {
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    }
  };

  const handleRetry = async () => {
    setStatus('warming');
    setShowStatus(true);
    
    const result = await backendWarmer.warmUp((message) => {
      console.log('Warming:', message);
    });
    
    setStatus(result.success ? 'online' : 'offline');
    
    setTimeout(() => {
      if (result.success) setShowStatus(false);
    }, 2000);
  };

  if (!showStatus && status === 'online') return null;

  return (
    <div className={`backend-status ${status}`}>
      <div className="status-indicator">
        <div className="status-dot"></div>
        <span className="status-text">
          {status === 'checking' && 'Checking server...'}
          {status === 'online' && 'Server online'}
          {status === 'offline' && 'Server offline'}
          {status === 'warming' && 'Warming up server...'}
        </span>
      </div>
      
      {status === 'offline' && (
        <button className="retry-btn" onClick={handleRetry}>
          Retry Connection
        </button>
      )}
    </div>
  );
}
