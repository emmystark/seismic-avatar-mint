import axios from 'axios';
import { XProfile, XTweet } from '@/types';

const X_API_BASE = 'https://api.twitter.com/2';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class XApiClient {
  private bearerToken: string;

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = MAX_RETRIES
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        const retryAfter = error.response?.headers['retry-after'] || RETRY_DELAY;
        const delay = parseInt(retryAfter) * 1000 || RETRY_DELAY;
        console.log(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithBackoff(fn, retries - 1);
      }
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<XProfile> {
    try {
      return await this.retryWithBackoff(async () => {
        const response = await axios.get(
          `${X_API_BASE}/users/by/username/${username}`,
          {
            headers: this.getHeaders(),
            params: {
              'user.fields': 'description,profile_image_url,public_metrics,created_at,verified',
            },
          }
        );

        const user = response.data.data;
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          description: user.description || '',
          profileImageUrl: user.profile_image_url || '',
          followersCount: user.public_metrics.followers_count,
          followingCount: user.public_metrics.following_count,
          tweetCount: user.public_metrics.tweet_count,
          createdAt: user.created_at,
          verified: user.verified || false,
        };
      });
    } catch (error) {
      console.error('Error fetching X profile:', error);
      throw new Error('Failed to fetch X profile');
    }
  }

 
}