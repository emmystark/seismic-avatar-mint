/**
 * OpenRouter API Client
 * Handles API calls to OpenRouter with proper error handling, retries, and configuration
 */

interface OpenRouterConfig {
  apiKey: string;
  siteName?: string;
  siteUrl?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | ContentPart[];
}

interface ContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenRouterError {
  error?: {
    message: string;
    type: string;
    code?: string;
    status?: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private siteName: string;
  private siteUrl: string;
  private maxRetries: number;
  private timeoutMs: number;

  constructor(config: OpenRouterConfig) {
    if (!config.apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    this.apiKey = config.apiKey;
    this.siteName = config.siteName || 'Seismic Avatar Mint';
    this.siteUrl = config.siteUrl || 'http://localhost:3000';
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 30000;

    // Log successful initialization
    console.log('✅ OpenRouter client initialized');
  }

  /**
   * Send a chat completion request with retry logic
   */
  async chat(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    return this.retryWithBackoff(() => this.sendRequest(request));
  }

  /**
   * Send a request to OpenRouter API
   */
  private async sendRequest(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.text();
        const error = this.parseError(errorData, response.status);
        throw error;
      }

      const data: OpenRouterResponse = await response.json();

      // Check for errors in the response body
      if ((data as any).error) {
        throw this.parseError(JSON.stringify((data as any).error), response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Retry a request with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    attempt = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt >= this.maxRetries - 1;
      const isRetryable =
        error.status === 429 || // Rate limit
        error.status === 503 || // Service unavailable
        error.status === 504 || // Gateway timeout
        error.message?.includes('timeout');

      if (!isRetryable || isLastAttempt) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt); // Exponential backoff
      console.log(`🔄 Retrying (attempt ${attempt + 1}/${this.maxRetries}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryWithBackoff(fn, attempt + 1);
    }
  }

  /**
   * Parse error responses from OpenRouter
   */
  private parseError(errorData: string, status: number): Error {
    const error: any = new Error();
    error.status = status;

    try {
      const parsed = JSON.parse(errorData);

      if (parsed.error) {
        error.message = parsed.error.message || JSON.stringify(parsed.error);
        error.type = parsed.error.type;
        error.code = parsed.error.code;
      } else {
        error.message = errorData;
      }
    } catch {
      error.message = errorData || `HTTP ${status}`;
    }

    // Add user-friendly messages
    switch (status) {
      case 401:
      case 403:
        error.message = `Authentication failed: ${error.message}`;
        error.isAuthError = true;
        break;
      case 429:
        error.message = `Rate limited: ${error.message}`;
        error.isRateLimited = true;
        break;
      case 503:
      case 504:
        error.message = `Service unavailable: ${error.message}`;
        error.isServiceError = true;
        break;
    }

    return error;
  }

  /**
   * Get request headers
   */
  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': this.siteUrl,
      'X-Title': this.siteName,
      'X-Max-Retries': this.maxRetries.toString(),
    };
  }

  /**
   * Analyze an image using Gemini 2.0 Flash (free model)
   */
  async analyzeImage(
    imageBase64: string,
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    const response = await this.chat({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 500,
    });

    return response.choices[0].message.content;
  }

  /**
   * Text-only chat completion
   */
  async chat_text(
    messages: OpenRouterMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    const response = await this.chat({
      model: options?.model ?? 'google/gemini-2.0-flash-exp:free',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    });

    return response.choices[0].message.content;
  }
}

/**
 * Create an OpenRouter client from environment variables
 */
export function createOpenRouterClient(): OpenRouterClient {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY environment variable is not set. ' +
      'Get your key from https://openrouter.ai/keys'
    );
  }

  return new OpenRouterClient({
    apiKey,
    siteName: process.env.OPENROUTER_APP_NAME,
    siteUrl: process.env.OPENROUTER_SITE_URL,
  });
}
