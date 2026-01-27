
interface GitHubResponse<T> {
  data: T;
  headers: Record<string, string>;
  status: number;
}

interface GitHubFetcherOptions {
  baseURL?: string;
  timeout?: number;
  userAgent?: string;
  authToken?: string;
}

class GitHubFetcher {
  private baseURL: string;
  private timeout: number;
  private userAgent: string;
  private rateLimitRemaining: number = 60;
  private rateLimitReset: number = 0;
  private authToken: string | undefined;

  constructor(options: GitHubFetcherOptions = {}) {
    const {
      baseURL = "https://api.github.com",
      timeout = 10000,
      userAgent = "FixFX-Wiki",
      authToken = process.env.GITHUB_TOKEN,
    } = options;

    this.baseURL = baseURL;
    this.timeout = timeout;
    this.userAgent = userAgent;
    this.authToken = authToken;
  }

  private updateRateLimits(headers: Headers) {
    const remaining = headers.get("x-ratelimit-remaining");
    const reset = headers.get("x-ratelimit-reset");

    if (remaining) {
      this.rateLimitRemaining = parseInt(remaining, 10);
    }
    if (reset) {
      this.rateLimitReset = parseInt(reset, 10);
    }
  }

  /**
   * Get the current rate limit information
   */
  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset,
      resetTime: new Date(this.rateLimitReset * 1000),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<GitHubResponse<T>> {
    if (!this.authToken) {
      throw new Error(
        "GitHub token not configured. Please set GITHUB_TOKEN environment variable.",
      );
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": this.userAgent,
          Authorization: `Bearer ${this.authToken}`,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(id);
      this.updateRateLimits(response.headers);

      const status = response.status;
      
      // Handle 304 Not Modified
      if (status === 304) {
        return {
          data: null as unknown as T,
          headers: Object.fromEntries(response.headers.entries()),
          status: 304,
        };
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data.message || response.statusText;

        switch (status) {
          case 401:
          case 403:
            throw new Error(
              `GitHub API Authentication Error: ${message}. Please check your GitHub token configuration.`,
            );
          case 404:
            throw new Error(`GitHub API Resource Not Found: ${message}`);
          case 429:
            const resetTime = response.headers.get("x-ratelimit-reset");
            const retryAfter = resetTime
              ? new Date(parseInt(resetTime) * 1000)
              : "unknown";
            throw new Error(
              `GitHub API Rate Limit Exceeded. Please try again after ${retryAfter}`,
            );
          default:
            throw new Error(`GitHub API Error (${status}): ${message}`);
        }
      }

      const data = await response.json();
      return {
        data,
        headers: Object.fromEntries(response.headers.entries()),
        status,
      };
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  /**
   * Make a GET request to the GitHub API
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<GitHubResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * Make a POST request to the GitHub API
   */
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<GitHubResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  /**
   * Make a PUT request to the GitHub API
   */
  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<GitHubResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  /**
   * Make a DELETE request to the GitHub API
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<GitHubResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Create a default instance
const githubFetcher = new GitHubFetcher();

export { GitHubFetcher, githubFetcher };
export default githubFetcher;
