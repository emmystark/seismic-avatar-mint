import axios from 'axios';
import { XProfile, XTweet } from '@/types';

const X_API_BASE = 'https://api.twitter.com/2';

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

  /**
   * Fetch user profile by username
   */
  async getUserByUsername(username: string): Promise<XProfile> {
    try {
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
    } catch (error) {
      console.error('Error fetching X profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch X profile');
    }
  }

  /**
   * Fetch recent tweets from user
   */
  async getUserTweets(userId: string, maxResults: number = 10): Promise<XTweet[]> {
    try {
      const response = await axios.get(
        `${X_API_BASE}/users/${userId}/tweets`,
        {
          headers: this.getHeaders(),
          params: {
            max_results: maxResults,
            'tweet.fields': 'created_at,public_metrics',
            exclude: 'retweets,replies',
          },
        }
      );

      if (!response.data.data) return [];

      return response.data.data.map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at,
        likeCount: tweet.public_metrics.like_count,
        retweetCount: tweet.public_metrics.retweet_count,
        replyCount: tweet.public_metrics.reply_count,
      }));
    } catch (error) {
      console.error('Error fetching tweets:', error);
      return [];
    }
  }
}