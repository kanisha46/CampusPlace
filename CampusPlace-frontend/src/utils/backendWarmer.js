import axios from 'axios';
import { API_BASE } from '../config';

class BackendWarmer {
  constructor() {
    this.isWarming = false;
    this.isWarmed = false;
    this.warmingAttempts = 0;
    this.maxAttempts = 3;
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
      return { success: false, message: 'Warming already in progress' };
    }

    this.isWarming = true;
    this.warmingAttempts = 0;

    try {
      if (onProgress) onProgress('Connecting to server...');

      // Try to ping the health endpoint
      const startTime = Date.now();
      
      while (this.warmingAttempts < this.maxAttempts) {
        try {
          this.warmingAttempts++;
          
          if (onProgress) {
            onProgress(`Attempt ${this.warmingAttempts}/${this.maxAttempts}...`);
          }

          const response = await axios.get(`${API_BASE}/health`, {
            timeout: 10000, // 10 second timeout
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
              onProgress(`Server starting... Retrying in 3s...`);
            }
            await this.sleep(3000);
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
   * Ping every 5 minutes
   */
  startPeriodicPing() {
    // Clear any existing interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Ping every 5 minutes (300000 ms)
    this.pingInterval = setInterval(async () => {
      try {
        await axios.get(`${API_BASE}/health`, { timeout: 5000 });
        console.log('✓ Backend keepalive ping successful');
      } catch (error) {
        console.warn('✗ Backend keepalive ping failed:', error.message);
        // Mark as not warmed so next action will trigger warming
        this.isWarmed = false;
      }
    }, 300000); // 5 minutes
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

