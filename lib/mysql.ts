import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
  charset: string;
}

class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: mysql.Pool | null = null;
  private config: DatabaseConfig;

  private constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ntlp_conference_2025',
      connectionLimit: parseInt(process.env.DATABASE_POOL_MAX || '20'),
      acquireTimeout: 60000,
      timeout: 60000,
      charset: 'utf8mb4'
    };
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async getConnection(): Promise<mysql.Pool> {
    if (!this.pool) {
      this.pool = mysql.createPool(this.config);
      
      // Test the connection
      try {
        const connection = await this.pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ MySQL connection established successfully');
      } catch (error) {
        console.error('❌ Failed to connect to MySQL:', error);
        throw error;
      }
    }
    return this.pool;
  }

  public async execute<T = any>(query: string, params?: any[]): Promise<T[]> {
    const pool = await this.getConnection();
    try {
      const [rows] = await pool.execute(query, params);
      return rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  public async executeOne<T = any>(query: string, params?: any[]): Promise<T | null> {
    const results = await this.execute<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

  public async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    const pool = await this.getConnection();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('MySQL connection pool closed');
    }
  }

  // Utility methods for common operations
  public async getStats(): Promise<any> {
    const stats = {
      totalRegistrations: 0,
      pendingRegistrations: 0,
      totalAbstracts: 0,
      pendingAbstracts: 0,
      totalContacts: 0,
      newContacts: 0,
      totalSpeakers: 0,
      confirmedSpeakers: 0
    };

    try {
      // Get registration stats
      const regStats = await this.execute(
        'SELECT status, COUNT(*) as count FROM registrations GROUP BY status'
      );
      
      regStats.forEach((stat: any) => {
        if (stat.status === 'pending') {
          stats.pendingRegistrations = stat.count;
        }
        stats.totalRegistrations += stat.count;
      });

      // Get abstract stats
      const abstractStats = await this.execute(
        'SELECT status, COUNT(*) as count FROM abstracts GROUP BY status'
      );
      
      abstractStats.forEach((stat: any) => {
        if (stat.status === 'pending') {
          stats.pendingAbstracts = stat.count;
        }
        stats.totalAbstracts += stat.count;
      });

      // Get contact stats
      const contactStats = await this.execute(
        'SELECT status, COUNT(*) as count FROM contacts GROUP BY status'
      );
      
      contactStats.forEach((stat: any) => {
        if (stat.status === 'new') {
          stats.newContacts = stat.count;
        }
        stats.totalContacts += stat.count;
      });

      // Get speaker stats
      const speakerStats = await this.execute(
        'SELECT status, COUNT(*) as count FROM speakers GROUP BY status'
      );
      
      speakerStats.forEach((stat: any) => {
        if (stat.status === 'confirmed') {
          stats.confirmedSpeakers = stat.count;
        }
        stats.totalSpeakers += stat.count;
      });

    } catch (error) {
      console.error('Error getting database stats:', error);
    }

    return stats;
  }

  // Health check method
  public async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const pool = await this.getConnection();
      const connection = await pool.getConnection();
      
      // Test basic connectivity
      await connection.ping();
      
      // Get connection info
      const [results] = await connection.execute('SELECT VERSION() as version, NOW() as current_time');
      const info = results as any[];
      
      // Get pool status
      const poolStatus = {
        totalConnections: this.config.connectionLimit,
        activeConnections: this.config.connectionLimit, // mysql2 doesn't expose internal counters
        idleConnections: 0 // mysql2 doesn't expose internal counters
      };
      
      connection.release();
      
      return {
        status: 'healthy',
        details: {
          version: info[0]?.version,
          currentTime: info[0]?.current_time,
          pool: poolStatus
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

export default DatabaseManager;
