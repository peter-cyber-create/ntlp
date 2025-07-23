// Performance monitoring utility
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static start(label: string): void {
    this.timers.set(label, Date.now());
  }

  static end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) return 0;
    
    const duration = Date.now() - startTime;
    this.timers.delete(label);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration}ms`);
    }
    
    return duration;
  }

  static async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}

// Optimized fetch with timeout and retry
export async function optimizedFetch(
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000,
  retries = 2
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions = {
    ...options,
    signal: controller.signal
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok && response.status >= 500 && attempt < retries) {
        lastError = new Error(`HTTP ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries && error instanceof Error && !error.name.includes('Abort')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
    }
  }

  clearTimeout(timeoutId);
  throw lastError || new Error('Request failed');
}

// Database connection pool optimization
export const dbConnectionPool = {
  _connections: new Map(),
  
  async getConnection(key: string = 'default') {
    if (this._connections.has(key)) {
      return this._connections.get(key);
    }
    
    // This will be set by the mongodb connection function
    return null;
  },
  
  setConnection(connection: any, key: string = 'default') {
    this._connections.set(key, connection);
  }
};
