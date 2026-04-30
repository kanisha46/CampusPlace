import axios from 'axios';
import { API_BASE } from '../config';

class BackendWarmer {
  constructor() {
    this.isWarming = false;
    this.isWarmed = false;
    this.warmingAttempts = 0;
    this.maxAttempts = 8; // More attempts for Render cold starts (up to ~80s)
    this.pingInterval = null;
  }

  /**
   * Warm up the backend by pinging the health endpoint
   * Returns a promise that resolves when backend is ready
   */
  async warmUp(onProgress) {
    if (this.isWarmed) {
      return { success: true, message: 'Backend already warmed up' };
    }

    if (this.isWarming) {
      // Wait for existing warming to complete instead of returning failure
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isWarming) {
            clearInterval(checkInterval);
            resolve({ success: this.isWarmed, message: this.isWarmed ? 'Backend warmed up' : 'Warming failed' });
          }
        }, 500);
      });
    }

    this.isWarming = true;
    this.warmingAttempts = 0;

    try {
      if (onProgress) onProgress('Connecting to server...');

      const startTime = Date.now();
      
      while (this.warmingAttempts < this.maxAttempts) {
        try {
          this.warmingAttempts++;
          
          if (onProgress) {
            const messages = [
              'Waking up server...',
              'Server is starting...',
              'Loading modules...',
              'Almost ready...',
              'Connecting to database...',
              'Finalizing setup...',
              'Just a moment...',
              'Nearly there...',
            ];
            onProgress(messages[Math.min(this.warmingAttempts - 1, messages.length - 1)]);
          }

          const response = await axios.get(`${API_BASE}/health`, {
            timeout: 12000, // 12 second timeout per attempt
          });

          if (response.status === 200) {
            const elapsed = Date.now() - startTime;
            this.isWarmed = true;
            this.isWarming = false;
            
            if (onProgress) {
              onProgress('Server ready!');
            }

            // Start periodic pinging to keep server alive
            this.startPeriodicPing();

            return {
              success: true,
              message: 'Backend warmed up successfully',
              elapsed: elapsed,
            };
          }
        } catch (error) {
          // If we haven't reached max attempts, wait and retry
          if (this.warmingAttempts < this.maxAttempts) {
            if (onProgress) {
              onProgress(`Server is waking up... (${this.warmingAttempts}/${this.maxAttempts})`);
            }
            await this.sleep(2000); // 2 second delay between retries
          }
        }
      }

      // If we've exhausted all attempts
      this.isWarming = false;
      return {
        success: false,
        message: 'Backend warming timeout. Please try again.',
      };
    } catch (error) {
      this.isWarming = false;
      return {
        success: false,
        message: 'Failed to connect to backend',
        error: error.message,
      };
    }
  }

  /**
   * Start periodic pinging to keep the backend alive
   * Ping every 2 minutes to prevent Render from sleeping
   */
  startPeriodicPing() {
    // Clear any existing interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Ping every 2 minutes (120000 ms) - aggressive to prevent sleep during presentation
    this.pingInterval = setInterval(async () => {
      try {
        await axios.get(`${API_BASE}/health`, { timeout: 5000 });
        console.log('✓ Backend keepalive ping successful');
      } catch (error) {
        console.warn('✗ Backend keepalive ping failed:', error.message);
        // Mark as not warmed so next action will trigger warming
        this.isWarmed = false;
      }
    }, 120000); // 2 minutes
  }

  /**
   * Stop periodic pinging
   */
  stopPeriodicPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Check if backend is responsive
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${API_BASE}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset warmer state
   */
  reset() {
    this.isWarming = false;
    this.isWarmed = false;
    this.warmingAttempts = 0;
    this.stopPeriodicPing();
  }
}

// Export a singleton instance
export const backendWarmer = new BackendWarmer();
