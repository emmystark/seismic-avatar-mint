import axios from 'axios';
import { XProfile, XTweet } from '@/types';

/**
 * RapidAPI Twitter Client - Alternative to X API
 * No rate limits issues, easier to use
 * Sign up at: https://rapidapi.com/omarmhaimdat/api/twitter154/
 */
export class RapidAPITwitterClient {
  private apiKey: string;
  private baseUrl = 'https://twitter154.p.rapidapi.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
    };
  }

  /**
   * Fetch user profile by username
   */
  async getUserByUsername(username: string): Promise<XProfile> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/user/details`,
        {
          headers: this.getHeaders(),
          params: { username: username.replace('@', '') },
        }
      );

      const user = response.data;
      
      // Handle different response structures
      const userData = user.user || user;
      
      return {
        id: userData.id_str || userData.rest_id || userData.id,
        username: userData.screen_name || username,
        name: userData.name || username,
        description: userData.description || '',
        profileImageUrl: (userData.profile_image_url_https || userData.profile_image_url || '').replace('_normal', '_400x400'),
        followersCount: userData.followers_count || 0,
        followingCount: userData.friends_count || userData.following_count || 0,
        tweetCount: userData.statuses_count || userData.tweet_count || 0,
        createdAt: userData.created_at || new Date().toISOString(),
        verified: userData.verified || userData.is_blue_verified || false,
      };
    } catch (error: any) {
      console.error('RapidAPI profile error:', error.response?.data || error.message);
      throw new Error('Failed to fetch profile from RapidAPI');
    }
  }

  /**
   * Fetch recent tweets from user
   */
  async getUserTweets(username: string, maxResults: number = 20): Promise<XTweet[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/user/tweets`,
        {
          headers: this.getHeaders(),
          params: {
            username: username.replace('@', ''),
            limit: maxResults,
          },
        }
      );

      const tweets = response.data.results || response.data || [];
      
      return tweets.map((tweet: any) => ({
        id: tweet.tweet_id || tweet.id_str || tweet.id || String(Math.random()),
        text: tweet.text || tweet.full_text || '',
        createdAt: tweet.created_at || new Date().toISOString(),
        likeCount: tweet.favorite_count || tweet.likes || 0,
        retweetCount: tweet.retweet_count || tweet.retweets || 0,
        replyCount: tweet.reply_count || tweet.replies || 0,
      })).filter((tweet: XTweet) => tweet.text.length > 0);
    } catch (error: any) {
      console.error('RapidAPI tweets error:', error.response?.data || error.message);
      // Return empty array instead of throwing - allows app to continue
      return [];
    }
  }
}

/**
 * Factory function to create the appropriate client
 */
export function createTwitterClient(): RapidAPITwitterClient | null {
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  
  if (rapidApiKey) {
    console.log('Using RapidAPI Twitter client');
    return new RapidAPITwitterClient(rapidApiKey);
  }
  
  console.error('No Twitter API credentials found');
  return null;
}