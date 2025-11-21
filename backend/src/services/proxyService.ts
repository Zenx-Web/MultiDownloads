import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface Proxy {
  ip: string;
  port: string;
  protocol: string;
}

class ProxyRotator {
  private proxyList: Proxy[] = [];
  private currentProxyIndex = 0;
  private lastRotation = Date.now();
  private rotationInterval = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  private cacheFile = path.join(__dirname, '../../proxy_cache.json');
  private isLoading = false;

  constructor() {
    this.loadProxiesFromCache();
    this.fetchProxies();
  }

  /**
   * Load proxies from cache file if available
   */
  private loadProxiesFromCache(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        const cached = JSON.parse(data);
        
        // Check if cache is less than 4 hours old
        if (Date.now() - cached.timestamp < 4 * 60 * 60 * 1000) {
          this.proxyList = cached.proxies;
          console.log(`✓ Loaded ${this.proxyList.length} proxies from cache`);
        }
      }
    } catch (error) {
      console.warn('Failed to load proxy cache:', error);
    }
  }

  /**
   * Save proxies to cache file
   */
  private saveProxiesToCache(): void {
    try {
      const data = {
        timestamp: Date.now(),
        proxies: this.proxyList
      };
      fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn('Failed to save proxy cache:', error);
    }
  }

  /**
   * Fetch free proxies from Geonode API
   */
  async fetchProxies(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      console.log('📡 Fetching free proxies from Geonode...');
      
      // Geonode free proxy API - get multiple protocols
      const protocols = ['http', 'https', 'socks4', 'socks5'];
      const allProxies: Proxy[] = [];

      for (const protocol of protocols) {
        try {
          const response = await axios.get('https://proxylist.geonode.com/api/proxy-list', {
            params: {
              limit: 50,
              page: 1,
              sort_by: 'lastChecked',
              sort_type: 'desc',
              protocols: protocol,
              filterUpTime: 70, // Only proxies with 70%+ uptime
              speed: 'fast', // Fast proxies only
            },
            timeout: 10000
          });

          if (response.data && response.data.data) {
            const proxies = response.data.data.map((p: any) => ({
              ip: p.ip,
              port: p.port,
              protocol: p.protocols[0] || protocol
            }));
            allProxies.push(...proxies);
          }
        } catch (error) {
          console.warn(`Failed to fetch ${protocol} proxies:`, (error as Error).message);
        }
      }

      if (allProxies.length > 0) {
        this.proxyList = allProxies;
        this.currentProxyIndex = 0;
        this.lastRotation = Date.now();
        this.saveProxiesToCache();
        console.log(`✓ Loaded ${this.proxyList.length} working proxies from Geonode`);
      } else {
        console.warn('⚠ No proxies fetched, using existing list or no proxy');
      }
    } catch (error) {
      console.error('✗ Failed to fetch proxies from Geonode:', (error as Error).message);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get current proxy URL
   */
  getCurrentProxy(): string | null {
    if (this.proxyList.length === 0) {
      return null;
    }

    // Rotate proxy if interval has passed
    if (Date.now() - this.lastRotation > this.rotationInterval) {
      this.rotateProxy();
    }

    const proxy = this.proxyList[this.currentProxyIndex];
    return `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
  }

  /**
   * Rotate to next proxy
   */
  private rotateProxy(): void {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyList.length;
    this.lastRotation = Date.now();
    console.log(`🔄 Rotated to proxy ${this.currentProxyIndex + 1}/${this.proxyList.length}`);
  }

  /**
   * Mark current proxy as failed and rotate to next
   */
  markCurrentProxyAsFailed(): void {
    if (this.proxyList.length === 0) return;

    console.log(`❌ Proxy ${this.currentProxyIndex + 1} failed, rotating...`);
    
    // Remove failed proxy from list
    this.proxyList.splice(this.currentProxyIndex, 1);
    
    // Adjust index
    if (this.currentProxyIndex >= this.proxyList.length && this.proxyList.length > 0) {
      this.currentProxyIndex = 0;
    }

    this.saveProxiesToCache();
    
    // If we're running low on proxies, fetch more
    if (this.proxyList.length < 5) {
      console.log('⚠ Running low on proxies, fetching more...');
      this.fetchProxies();
    }
  }

  /**
   * Get proxy count
   */
  getProxyCount(): number {
    return this.proxyList.length;
  }

  /**
   * Force refresh proxies
   */
  async refresh(): Promise<void> {
    await this.fetchProxies();
  }
}

// Singleton instance
export const proxyRotator = new ProxyRotator();

// Refresh proxies every 4 hours
setInterval(() => {
  proxyRotator.refresh();
}, 4 * 60 * 60 * 1000);
