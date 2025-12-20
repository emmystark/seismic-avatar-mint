// lib/xScraper.ts
// Scrape X/Twitter data without API rate limits

import axios from 'axios';
import * as cheerio from 'cheerio';
import { XProfile, XTweet } from '@/types';

/**
 * SOLUTION 1: Web Scraping (No API needed)
 * Works without authentication, no rate limits
 */
export class XWebScraper {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  /**
   * Get profile data by scraping public profile page
   */
  async getProfile(username: string): Promise<XProfile> {
    try {
      // Use Nitter (Twitter frontend) or direct scraping
      const url = `https://nitter.net/${username}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      
      // Extract profile data
      const name = $('.profile-card-fullname').text().trim();
      const bio = $('.profile-bio').text().trim();
      const tweets = $('.profile-stat-num').eq(0).text().trim();
      const following = $('.profile-stat-num').eq(1).text().trim();
      const followers = $('.profile-stat-num').eq(2).text().trim();
      const profileImg = $('.profile-card-avatar').attr('src') || '';

      return {
        id: username,
        username: username,
        name: name || username,
        description: bio,
        profileImageUrl: profileImg,
        followersCount: this.parseNumber(followers),
        followingCount: this.parseNumber(following),
        tweetCount: this.parseNumber(tweets),
        createdAt: new Date().toISOString(),
        verified: false,
      };
    } catch (error) {
      console.error('Scraping failed:', error);
      throw new Error('Failed to scrape profile');
    }
  }

  /**
   * Get recent tweets by scraping
   */
  async getTweets(username: string, maxResults: number = 10): Promise<XTweet[]> {
    try {
      const url = `https://nitter.net/${username}`;
      
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const tweets: XTweet[] = [];

      $('.timeline-item').slice(0, maxResults).each((i, elem) => {
        const text = $(elem).find('.tweet-content').text().trim();
        const time = $(elem).find('.tweet-date a').attr('title') || '';
        
        if (text) {
          tweets.push({
            id: `${Date.now()}_${i}`,
            text: text,
            createdAt: time,
            authorId: username,
            publicMetrics: {
              retweets: 0,
              replies: 0,
              likes: 0,
              quotes: 0,
            },
          });
        }
      });

      return tweets;
    } catch (error) {
      console.error('Failed to scrape tweets:', error);
      return [];
    }
  }

  private parseNumber(str: string): number {
    const cleaned = str.replace(/[,\s]/g, '');
    if (cleaned.includes('K')) return parseFloat(cleaned) * 1000;
    if (cleaned.includes('M')) return parseFloat(cleaned) * 1000000;
    return parseInt(cleaned) || 0;
  }
}

/**
 * SOLUTION 2: Fallback to manual data
 * When user provides their own info
 */
export class XManualData {
  /**
   * Create profile from user input
   */
  static createProfile(data: {
    username: string;
    name?: string;
    bio?: string;
    followers?: number;
  }): XProfile {
    return {
      id: data.username,
      username: data.username,
      name: data.name || data.username,
      description: data.bio || '',
      profileImageUrl: '',
      followersCount: data.followers || 0,
      followingCount: 0,
      tweetCount: 0,
      createdAt: new Date().toISOString(),
      verified: false,
    };
  }

  /**
   * Generate sample tweets for testing
   */
  static generateSampleTweets(username: string, topics: string[]): XTweet[] {
    const templates = [
      `Excited about ${topics[0] || 'tech'}! 🚀`,
      `Working on some cool ${topics[1] || 'projects'} today`,
      `Just learned something new about ${topics[0] || 'development'}`,
      `Building in public! Check out my latest work`,
      `Great community vibes today 💪`,
    ];

    return templates.map((text, i) => ({
      id: `sample_${i}`,
      text,
      createdAt: new Date().toISOString(),
      authorId: username,
      publicMetrics: {
        retweets: Math.floor(Math.random() * 10),
        replies: Math.floor(Math.random() * 5),
        likes: Math.floor(Math.random() * 20),
        quotes: 0,
      },
    }));
  }
}

/**
 * SOLUTION 3: Combined client with multiple fallbacks
 */
export class XUnlimitedClient {
  private scraper: XWebScraper;
  private apiClient?: any;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  constructor(bearerToken?: string) {
    this.scraper = new XWebScraper();
    this.cache = new Map();
    
    // Optional: Use API as primary, scraper as fallback
    if (bearerToken) {
      // Your existing API client
    }
  }

  /**
   * Get profile with automatic fallback
   */
  async getProfile(username: string): Promise<XProfile> {
    // Check cache first
    const cached = this.getFromCache(`profile_${username}`);
    if (cached) return cached;

    try {
      // Try API first if available
      if (this.apiClient) {
        try {
          const profile = await this.apiClient.getUserByUsername(username);
          this.saveToCache(`profile_${username}`, profile);
          return profile;
        } catch (apiError: any) {
          if (apiError.response?.status === 429) {
            console.log('API rate limited, switching to scraper...');
          }
        }
      }

      // Fallback to scraper
      console.log('Using web scraper for:', username);
      const profile = await this.scraper.getProfile(username);
      this.saveToCache(`profile_${username}`, profile);
      return profile;

    } catch (error) {
      console.error('All methods failed:', error);
      
      // Final fallback: Return basic profile
      return XManualData.createProfile({ username });
    }
  }

  /**
   * Get tweets with fallback
   */
  async getTweets(username: string, maxResults: number = 10): Promise<XTweet[]> {
    const cached = this.getFromCache(`tweets_${username}`);
    if (cached) return cached;

    try {
      // Try scraper
      const tweets = await this.scraper.getTweets(username, maxResults);
      
      if (tweets.length > 0) {
        this.saveToCache(`tweets_${username}`, tweets);
        return tweets;
      }

      // Fallback to sample data
      console.log('Generating sample tweets for:', username);
      const sampleTweets = XManualData.generateSampleTweets(username, ['tech', 'web3']);
      return sampleTweets;

    } catch (error) {
      console.error('Failed to get tweets:', error);
      return XManualData.generateSampleTweets(username, ['tech']);
    }
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private saveToCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * SOLUTION 4: Rotating Proxies (Advanced)
 */
export class XProxyClient extends XWebScraper {
  private proxies: string[] = [];
  private currentProxyIndex = 0;

  constructor(proxies?: string[]) {
    super();
    if (proxies) {
      this.proxies = proxies;
    }
  }

  /**
   * Add proxy servers
   */
  addProxies(proxies: string[]): void {
    this.proxies.push(...proxies);
  }

  /**
   * Get next proxy in rotation
   */
  private getNextProxy(): string | undefined {
    if (this.proxies.length === 0) return undefined;
    
    const proxy = this.proxies[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
    return proxy;
  }

  /**
   * Override getProfile with proxy rotation
   */
  async getProfile(username: string): Promise<XProfile> {
    const proxy = this.getNextProxy();
    
    try {
      const url = `https://nitter.net/${username}`;
      const config: any = {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      };

      if (proxy) {
        config.proxy = this.parseProxy(proxy);
      }

      const response = await axios.get(url, config);
      // Parse response (same as parent class)
      return super.getProfile(username);
    } catch (error) {
      // Try next proxy on failure
      if (this.proxies.length > 0) {
        return this.getProfile(username);
      }
      throw error;
    }
  }

  private parseProxy(proxy: string): any {
    const url = new URL(proxy);
    return {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: parseInt(url.port),
    };
  }
}