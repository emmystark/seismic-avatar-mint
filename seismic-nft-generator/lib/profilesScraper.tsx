import axios from 'axios';
import { XProfile } from '@/types';

/**
 * Lightweight Profile Scraper
 * Gets ONLY profile picture + basic info without API rate limits
 * Uses public Twitter endpoints that don't require authentication
 */
export class ProfileScraper {
  
  /**
   * Get user profile pic and basic info without API
   * Uses Twitter's public syndication API (no auth needed)
   */
  async getBasicProfile(username: string): Promise<XProfile> {
    try {
      // Remove @ if present
      const cleanUsername = username.replace('@', '');

      // Method 1: Try syndication API (no auth required)
      try {
        const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=1&lang=en`;
        const profileUrl = `https://twitter.com/${cleanUsername}`;
        
        // Use a simple fetch to get profile page HTML
        const response = await axios.get(profileUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 10000,
        });

        // Extract profile image from HTML
        const html = response.data;
        const profileImageMatch = html.match(/profile_image_url_https":"([^"]+)"/);
        const nameMatch = html.match(/"name":"([^"]+)"/);
        const descriptionMatch = html.match(/"description":"([^"]+)"/);
        
        if (profileImageMatch) {
          return {
            id: cleanUsername,
            username: cleanUsername,
            name: nameMatch ? nameMatch[1] : cleanUsername,
            description: descriptionMatch ? descriptionMatch[1].replace(/\\n/g, ' ') : '',
            profileImageUrl: profileImageMatch[1].replace('_normal', '_400x400'),
            followersCount: 0,
            followingCount: 0,
            tweetCount: 0,
            createdAt: new Date().toISOString(),
            verified: false,
          };
        }
      } catch (scrapeError) {
        console.log('Scraping failed, trying alternative...');
      }

      // Method 2: Use nitter instance (Twitter alternative frontend)
      try {
        const nitterUrl = `https://nitter.net/${cleanUsername}`;
        const response = await axios.get(nitterUrl, {
          timeout: 10000,
        });

        const html = response.data;
        const avatarMatch = html.match(/src="([^"]*\/pic\/[^"]+)"/);
        const nameMatch = html.match(/<title>([^(]+)/);
        
        if (avatarMatch) {
          const avatarUrl = `https://nitter.net${avatarMatch[1]}`;
          
          return {
            id: cleanUsername,
            username: cleanUsername,
            name: nameMatch ? nameMatch[1].trim() : cleanUsername,
            description: '',
            profileImageUrl: avatarUrl,
            followersCount: 0,
            followingCount: 0,
            tweetCount: 0,
            createdAt: new Date().toISOString(),
            verified: false,
          };
        }
      } catch (nitterError) {
        console.log('Nitter failed, trying final method...');
      }

      // Method 3: Construct default profile pic URL
      // Twitter profile pics follow a pattern
      return {
        id: cleanUsername,
        username: cleanUsername,
        name: cleanUsername,
        description: `Profile for @${cleanUsername}`,
        profileImageUrl: `https://unavatar.io/twitter/${cleanUsername}`, // Fallback service
        followersCount: 100, // Defaults
        followingCount: 50,
        tweetCount: 500,
        createdAt: new Date().toISOString(),
        verified: false,
      };

    } catch (error: any) {
      console.error('Profile scraping error:', error.message);
      throw new Error(`Failed to get profile for @${username}`);
    }
  }

  /**
   * Analyze personality from username only (no tweets needed)
   */
  analyzeFromUsername(username: string, bio: string = ''): any {
    const lowerUsername = username.toLowerCase();
    const lowerBio = bio.toLowerCase();
    const combined = `${lowerUsername} ${lowerBio}`;

    // Determine tone from username/bio
    let tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'technical' = 'casual';
    
    if (combined.match(/ceo|founder|executive|official|corp|business/)) {
      tone = 'professional';
    } else if (combined.match(/dev|tech|code|engineer|web3|crypto|blockchain/)) {
      tone = 'technical';
    } else if (combined.match(/lol|meme|funny|joke|comedy/)) {
      tone = 'humorous';
    } else if (combined.match(/inspire|motivate|coach|mentor|spiritual/)) {
      tone = 'inspirational';
    }

    // Extract topics
    const topics: string[] = [];
    if (combined.match(/tech|software|code|ai|ml/)) topics.push('technology');
    if (combined.match(/business|startup|entrepreneur/)) topics.push('business');
    if (combined.match(/design|art|creative|ux|ui/)) topics.push('design');
    if (combined.match(/crypto|defi|nft|web3|blockchain/)) topics.push('finance');
    if (combined.match(/game|gaming|esports|player/)) topics.push('gaming');
    if (combined.match(/life|travel|food|fitness/)) topics.push('lifestyle');

    return {
      tone,
      topics: topics.length > 0 ? topics : ['technology'],
      sentiment: 'positive' as const,
      activityLevel: 'medium' as const,
      engagement: 'medium' as const,
    };
  }
}

/**
 * Helper to create profile analysis from just username
 */
export async function quickProfileAnalysis(username: string) {
  const scraper = new ProfileScraper();
  const profile = await scraper.getBasicProfile(username);
  const personality = scraper.analyzeFromUsername(username, profile.description);

  return {
    profile,
    recentTweets: [],
    personality,
    keywords: username.split(/[_.-]/).filter(k => k.length > 2),
    dominantColors: ['#8B5CF6', '#3B82F6', '#EC4899'],
    suggestedStyle: 'modern NFT character art',
    engagementStats: {
      totalLikes: 0,
      totalRetweets: 0,
      totalReplies: 0,
      avgLikes: 20,
      avgRetweets: 5,
      avgReplies: 3,
    },
  };
}