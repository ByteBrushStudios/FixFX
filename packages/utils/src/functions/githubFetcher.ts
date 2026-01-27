import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

interface GitHubFetcherOptions {
  baseURL?: string;
  timeout?: number;
  userAgent?: string;
  authToken?: string;
}

interface GitHubResponse<T> {
  data: T;
  headers: Record<string, string>;
  status: number;
}

class GitHubFetcher {
  private client: AxiosInstance;
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

    this.authToken = authToken;

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": userAgent,
        ...(this.authToken
          ? { Authorization: `Bearer ${this.authToken}` }
          : {}),
      },
    });

    // Add response interceptor to track rate limits
    this.client.interceptors.response.use(
      (response) => {
        this.updateRateLimits(response.headers);
        return response;
      },
      (error) => {
        if (error.response) {
          this.updateRateLimits(error.response.headers);
        }
        return Promise.reject(error);
      },
    );
  }

  private updateRateLimits(headers: any) {
    const remaining = headers["x-ratelimit-remaining"];
    const reset = headers["x-ratelimit-reset"];

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

  /**
   * Make a GET request to the GitHub API
   */
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<GitHubResponse<T>> {
    try {
      if (!this.authToken) {
        throw new Error(
          "GitHub token not configured. Please set GITHUB_TOKEN environment variable.",
        );
      }

      const response = await this.client.get<T>(endpoint, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      return {
        data: response.data,
        headers: response.headers as Record<string, string>,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        const status = axiosError.response?.status;
        const message =
          axiosError.response?.data?.message || axiosError.message;

        // Handle 304 Not Modified as a special case
        if (status === 304) {
          return {
            data: null as unknown as T,
            headers: axiosError.response?.headers as Record<string, string>,
            status: 304,
          };
        }

        switch (status) {
          case 401:
          case 403:
            throw new Error(
              `GitHub API Authentication Error: ${message}. Please check your GitHub token configuration.`,
            );
          case 404:
            throw new Error(`GitHub API Resource Not Found: ${message}`);
          case 429:
            const resetTime = axiosError.response?.headers["x-ratelimit-reset"];
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
      throw error;
    }
  }

  /**
   * Make a POST request to the GitHub API
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<GitHubResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, data, config);
      return {
        data: response.data,
        headers: response.headers as Record<string, string>,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `GitHub API Error: ${error.message} (${error.response?.status})`,
        );
      }
      throw error;
    }
  }

  /**
   * Make a PUT request to the GitHub API
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<GitHubResponse<T>> {
    try {
      const response = await this.client.put<T>(endpoint, data, config);
      return {
        data: response.data,
        headers: response.headers as Record<string, string>,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `GitHub API Error: ${error.message} (${error.response?.status})`,
        );
      }
      throw error;
    }
  }

  /**
   * Make a DELETE request to the GitHub API
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<GitHubResponse<T>> {
    try {
      const response = await this.client.delete<T>(endpoint, config);
      return {
        data: response.data,
        headers: response.headers as Record<string, string>,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `GitHub API Error: ${error.message} (${error.response?.status})`,
        );
      }
      throw error;
    }
  }
}

// Create a default instance
const githubFetcher = new GitHubFetcher();

export { GitHubFetcher, githubFetcher };
export default githubFetcher;
