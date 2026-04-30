import { useState, useEffect } from 'react';
import { backendWarmer } from '../utils/backendWarmer';
import './SplashScreen.css';

export default function SplashScreen({ onReady }) {
  const [status, setStatus] = useState('Connecting to server...');
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let progressTimer;

    // Animate the progress bar smoothly
    progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Cap at 90 until actually ready
        return prev + Math.random() * 3;
      });
    }, 800);

    const warmBackend = async () => {
      const result = await backendWarmer.warmUp((msg) => {
        setStatus(msg);
      });

      clearInterval(progressTimer);

      if (result.success) {
        setProgress(100);
        setStatus('Ready!');
        // Short delay to show 100% before transitioning
        setTimeout(() => {
          onReady();
        }, 600);
      } else {
        setFailed(true);
        setStatus('Server is taking longer than usual...');
      }
    };

    warmBackend();

    return () => {
      clearInterval(progressTimer);
    };
  }, [onReady]);

  const handleRetry = () => {
    setFailed(false);
    setProgress(0);
    backendWarmer.reset();

    const warmBackend = async () => {
      const result = await backendWarmer.warmUp((msg) => {
        setStatus(msg);
      });

      if (result.success) {
        setProgress(100);
        setStatus('Ready!');
        setTimeout(() => onReady(), 600);
      } else {
        setFailed(true);
        setStatus('Server is taking longer than usual...');
      }
    };

    warmBackend();
  };

  return (
    <div className="splash-screen">
      <div className="splash-blob splash-blob-1"></div>
      <div className="splash-blob splash-blob-2"></div>

      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <div className="splash-icon">🎓</div>
          <h1 className="splash-title">
            Campus<span>Place</span>
          </h1>
        </div>

        <p className="splash-subtitle">Your AI-Powered Career Hub</p>

        <div className="splash-loader">
          <div className="splash-progress-track">
            <div
              className="splash-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="splash-status">{status}</p>
        </div>

        {failed && (
          <button className="splash-retry-btn" onClick={handleRetry}>
            Try Again
          </button>
        )}

        <p className="splash-hint">
          {failed
            ? 'The server may be in sleep mode. Retrying will wake it up.'
            : 'First load may take 20–40 seconds as the server wakes up'}
        </p>
      </div>
    </div>
  );
}
