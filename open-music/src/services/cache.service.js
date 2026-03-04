import { createClient } from 'redis';

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  }

  async connect() {
    try {
      await this._client.connect();
      console.log('✓ Redis connected successfully');
    } catch (error) {
      console.error('✗ Failed to connect to Redis:', error.message);
      throw error;
    }
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }

  async disconnect() {
    await this._client.quit();
  }
}

export default CacheService;
