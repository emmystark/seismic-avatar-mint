// X Profile Types
export interface XProfile {
  id: string;
  username: string;
  name: string;
  description: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  createdAt: string;
  verified: boolean;
}

export interface XTweet {
  id: string;
  text: string;
  createdAt: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
}

// Personality Analysis Types
export interface PersonalityTraits {
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'technical';
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  activityLevel: 'high' | 'medium' | 'low';
  engagement: 'high' | 'medium' | 'low';
}

export interface ProfileAnalysis {
  profile: XProfile;
  recentTweets: XTweet[];
  personality: PersonalityTraits;
  keywords: string[];
  dominantColors: string[];
  suggestedStyle: string;
}

// NFT Generation Types
export interface NFTMetadata {
  name: string;
  description: string;
  imageUrl: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  createdAt: string;
  username: string;
  seismicBranded: boolean;
}

export interface GenerationRequest {
  username: string;
  style?: string;
}

export interface GenerationResponse {
  success: boolean;
  nft?: NFTMetadata;
  error?: string;
}