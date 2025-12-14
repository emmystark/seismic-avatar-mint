import { XProfile, XTweet, PersonalityTraits, ProfileAnalysis, XEngagementStats } from '@/types';

export class PersonalityAnalyzer {
  /**
   * Analyze profile and tweets to determine personality traits
   */
  static analyzeProfile(profile: XProfile, tweets: XTweet[]): ProfileAnalysis {
    const personality = this.extractPersonalityTraits(profile, tweets);
    const keywords = this.extractKeywords(profile, tweets);
    const dominantColors = this.suggestColors(personality);
    const suggestedStyle = this.suggestArtStyle(personality);
    const engagementStats = this.calculateEngagementStats(tweets);

    return {
      profile,
      recentTweets: tweets,
      personality,
      keywords,
      dominantColors,
      suggestedStyle,
      engagementStats,
    };
  }

  /**
   * Calculate engagement statistics from tweets
   */
  private static calculateEngagementStats(tweets: XTweet[]): XEngagementStats {
    if (tweets.length === 0) {
      return {
        totalLikes: 0,
        totalRetweets: 0,
        totalReplies: 0,
        avgLikes: 0,
        avgRetweets: 0,
        avgReplies: 0,
      };
    }

    const totalLikes = tweets.reduce((sum, tweet) => sum + tweet.likeCount, 0);
    const totalRetweets = tweets.reduce((sum, tweet) => sum + tweet.retweetCount, 0);
    const totalReplies = tweets.reduce((sum, tweet) => sum + tweet.replyCount, 0);

    return {
      totalLikes,
      totalRetweets,
      totalReplies,
      avgLikes: Math.round(totalLikes / tweets.length),
      avgRetweets: Math.round(totalRetweets / tweets.length),
      avgReplies: Math.round(totalReplies / tweets.length),
    };
  }

  /**
   * Extract personality traits from profile and tweets
   */
  private static extractPersonalityTraits(
    profile: XProfile,
    tweets: XTweet[]
  ): PersonalityTraits {
    const allText = [
      profile.description,
      ...tweets.map(t => t.text),
    ].join(' ').toLowerCase();

    // Determine tone
    const tone = this.determineTone(allText, tweets);

    // Extract topics
    const topics = this.extractTopics(allText);

    // Analyze sentiment
    const sentiment = this.analyzeSentiment(allText);

    // Calculate activity level
    const activityLevel = this.calculateActivityLevel(profile, tweets);

    // Calculate engagement
    const engagement = this.calculateEngagement(tweets);

    return {
      tone,
      topics,
      sentiment,
      activityLevel,
      engagement,
    };
  }

  private static determineTone(
    text: string,
    tweets: XTweet[]
  ): PersonalityTraits['tone'] {
    const professionalWords = ['business', 'strategy', 'professional', 'ceo', 'founder', 'enterprise'];
    const casualWords = ['lol', 'haha', 'yeah', 'cool', 'awesome', 'hey'];
    const humorousWords = ['😂', '😄', 'joke', 'funny', 'lmao', '🤣'];
    const inspirationalWords = ['inspire', 'motivate', 'achieve', 'success', 'dream', 'believe'];
    const technicalWords = ['code', 'algorithm', 'api', 'blockchain', 'ai', 'developer', 'web3'];

    const scores = {
      professional: this.countMatches(text, professionalWords),
      casual: this.countMatches(text, casualWords),
      humorous: this.countMatches(text, humorousWords),
      inspirational: this.countMatches(text, inspirationalWords),
      technical: this.countMatches(text, technicalWords),
    };

    return Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as PersonalityTraits['tone'];
  }

  private static extractTopics(text: string): string[] {
    const topicKeywords = {
      technology: ['tech', 'ai', 'blockchain', 'crypto', 'web3', 'software', 'code'],
      business: ['business', 'startup', 'entrepreneur', 'marketing', 'sales'],
      design: ['design', 'ui', 'ux', 'creative', 'art', 'visual'],
      finance: ['finance', 'trading', 'investment', 'defi', 'nft'],
      lifestyle: ['life', 'travel', 'food', 'fitness', 'health'],
      gaming: ['game', 'gaming', 'esports', 'player'],
    };

    const topics: string[] = [];
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics.slice(0, 3);
  }

  private static analyzeSentiment(text: string): PersonalityTraits['sentiment'] {
    const positiveWords = ['great', 'amazing', 'awesome', 'love', 'excited', 'happy', 'excellent'];
    const negativeWords = ['bad', 'terrible', 'hate', 'worst', 'awful', 'disappointing'];

    const positiveCount = this.countMatches(text, positiveWords);
    const negativeCount = this.countMatches(text, negativeWords);

    if (positiveCount > negativeCount * 2) return 'positive';
    if (negativeCount > positiveCount * 2) return 'negative';
    return 'neutral';
  }

  private static calculateActivityLevel(
    profile: XProfile,
    tweets: XTweet[]
  ): PersonalityTraits['activityLevel'] {
    const tweetsPerDay = profile.tweetCount / this.daysSinceCreation(profile.createdAt);
    
    if (tweetsPerDay > 5) return 'high';
    if (tweetsPerDay > 1) return 'medium';
    return 'low';
  }

  private static calculateEngagement(tweets: XTweet[]): PersonalityTraits['engagement'] {
    if (tweets.length === 0) return 'low';

    const avgEngagement = tweets.reduce((sum, tweet) => 
      sum + tweet.likeCount + tweet.retweetCount + tweet.replyCount, 0
    ) / tweets.length;

    if (avgEngagement > 100) return 'high';
    if (avgEngagement > 20) return 'medium';
    return 'low';
  }

  private static extractKeywords(profile: XProfile, tweets: XTweet[]): string[] {
    const text = [profile.description, ...tweets.map(t => t.text)].join(' ');
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);
  }

  private static suggestColors(personality: PersonalityTraits): string[] {
    const colorSchemes: Record<PersonalityTraits['tone'], string[]> = {
      professional: ['#1a365d', '#2c5282', '#4299e1', '#90cdf4'],
      casual: ['#f6ad55', '#fc8181', '#f687b3', '#d6bcfa'],
      humorous: ['#fbd38d', '#fc8181', '#9ae6b4', '#90cdf4'],
      inspirational: ['#805ad5', '#d69e2e', '#38b2ac', '#f56565'],
      technical: ['#2d3748', '#4a5568', '#00d9ff', '#10b981'],
    };

    return colorSchemes[personality.tone];
  }

  private static suggestArtStyle(personality: PersonalityTraits): string {
    const styles: Record<PersonalityTraits['tone'], string> = {
      professional: 'corporate minimalist style, clean lines, professional portrait',
      casual: 'vibrant pop art style, colorful and energetic',
      humorous: 'cartoon style, playful and fun, comic book aesthetic',
      inspirational: 'ethereal fantasy style, inspiring and dreamlike',
      technical: 'cyberpunk style, futuristic and digital, neon accents',
    };

    return styles[personality.tone];
  }

  private static countMatches(text: string, words: string[]): number {
    return words.reduce((count, word) => 
      count + (text.match(new RegExp(word, 'gi'))?.length || 0), 0
    );
  }

  private static daysSinceCreation(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
  }
}