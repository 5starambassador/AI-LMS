import net from 'net';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private static memoryStore = new Map<string, CacheEntry<any>>();
  private static hits = 0;
  private static misses = 0;
  private static redisAvailable = false;
  private static redisClient: net.Socket | null = null;
  private static initialized = false;

  /**
   * Initializes the cache service and tests connection to local Redis (127.0.0.1:6379)
   */
  static init(port = 6379, host = '127.0.0.1') {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const socket = net.createConnection({ port, host, timeout: 1500 });
      socket.on('connect', () => {
        socket.write('PING\r\n');
      });
      socket.on('data', data => {
        if (data.toString().includes('PONG')) {
          this.redisAvailable = true;
          this.redisClient = socket;
          // Clean up on disconnect
          socket.on('close', () => {
            this.redisAvailable = false;
            this.redisClient = null;
          });
        }
      });
      socket.on('error', () => {
        this.redisAvailable = false;
        this.redisClient = null;
      });
      socket.on('timeout', () => {
        socket.destroy();
        this.redisAvailable = false;
        this.redisClient = null;
      });
    } catch {
      this.redisAvailable = false;
    }
  }

  /**
   * Retrieves a cached value by key. Returns null if expired or missing.
   */
  static async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryStore.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.memoryStore.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  /**
   * Stores a value in the cache with a specified TTL (in seconds, default 300s = 5m).
   */
  static async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryStore.set(key, { value, expiresAt });

    // If memory store grows beyond 1,000 items, purge expired items
    if (this.memoryStore.size > 1000) {
      this.purgeExpired();
    }
  }

  /**
   * Invalidates a key or group of keys matching a prefix.
   */
  static async del(keyOrPrefix: string): Promise<void> {
    for (const key of this.memoryStore.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.memoryStore.delete(key);
      }
    }
  }

  /**
   * High-level Cache-Aside wrapper: returns cached value or computes and caches it.
   */
  static async getOrCompute<T>(key: string, computeFn: () => Promise<T>, ttlSeconds = 300): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const computed = await computeFn();
    await this.set<T>(key, computed, ttlSeconds);
    return computed;
  }

  /**
   * Cleans up expired items from memory store
   */
  private static purgeExpired() {
    const now = Date.now();
    for (const [key, entry] of this.memoryStore.entries()) {
      if (now > entry.expiresAt) {
        this.memoryStore.delete(key);
      }
    }
  }

  /**
   * Cache telemetry stats
   */
  static getStats() {
    return {
      keysCount: this.memoryStore.size,
      hits: this.hits,
      misses: this.misses,
      hitRatePct: this.hits + this.misses > 0 ? Math.round((this.hits / (this.hits + this.misses)) * 100) : 0,
      redisConnected: this.redisAvailable
    };
  }
}

// Auto-initialize on module load
CacheService.init();
