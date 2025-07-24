import { cn } from '@utils/functions/cn';
import { Star, GitFork, GitCommit, Tag } from 'lucide-react';
import { type AnchorHTMLAttributes } from 'react';

async function getRepoStats(
  owner: string,
  repo: string,
  token?: string,
): Promise<{
  stars: number;
  forks: number;
  commits: number;
  releases: number;
  openIssues: number;
  watchers: number;
}> {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(endpoint, { headers });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to fetch repository data: ${message}`);
  }

  const data = await response.json();
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    commits: data.default_branch ? await getCommitCount(owner, repo, data.default_branch, token) : 0,
    releases: data.releases_count || 0,
    openIssues: data.open_issues_count,
    watchers: data.watchers_count,
  };
}

async function getCommitCount(
  owner: string,
  repo: string,
  branch: string,
  token?: string,
): Promise<number> {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`;
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(endpoint, { headers });

  if (!response.ok) {
    return 0;
  }

  const linkHeader = response.headers.get('link');
  if (!linkHeader) {
    return 1;
  }

  const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
  if (!lastPageMatch) {
    return 1;
  }

  return parseInt(lastPageMatch[1], 10);
}

export async function GithubInfo({
  repo,
  owner,
  token,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  owner: string;
  repo: string;
  token?: string;
}) {
  const { stars, forks, commits, releases, openIssues, watchers } = await getRepoStats(
    owner,
    repo,
    token,
  );

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      rel="noreferrer noopener"
      target="_blank"
      {...props}
      className={cn(
        'flex flex-col gap-1.5 p-2 rounded-lg text-sm text-fd-foreground/80 transition-colors lg:flex-row lg:items-center hover:text-fd-accent-foreground hover:bg-fd-accent',
        props.className,
      )}
    >
      <p className="flex items-center gap-2 truncate">
        <svg fill="currentColor" viewBox="0 0 24 24" className="size-3.5">
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        {owner}/{repo}
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-fd-muted-foreground">
        <p className="flex items-center gap-1">
          <Star className="size-3" />
          {humanizeNumber(stars)}
        </p>
        <p className="flex items-center gap-1">
          <GitFork className="size-3" />
          {humanizeNumber(forks)}
        </p>
        <p className="flex items-center gap-1">
          <GitCommit className="size-3" />
          {humanizeNumber(commits)}
        </p>
        <p className="flex items-center gap-1">
          <Tag className="size-3" />
          {humanizeNumber(releases)}
        </p>
        <p className="flex items-center gap-1">
          <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {humanizeNumber(openIssues)}
        </p>
        <p className="flex items-center gap-1">
          <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {humanizeNumber(watchers)}
        </p>
      </div>
    </a>
  );
}

/**
 * Converts a number to a human-readable string with K suffix for thousands
 * @example 1500 -> "1.5K", 1000000 -> "1000000"
 */
function humanizeNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 100000) {
    // For numbers between 1,000 and 99,999, show with one decimal (e.g., 1.5K)
    const value = (num / 1000).toFixed(1);
    // Remove trailing .0 if present
    const formattedValue = value.endsWith('.0') ? value.slice(0, -2) : value;

    return `${formattedValue}K`;
  }

  if (num < 1000000) {
    // For numbers between 10,000 and 999,999, show as whole K (e.g., 10K, 999K)
    return `${Math.floor(num / 1000)}K`;
  }

  // For 1,000,000 and above, just return the number
  return num.toString();
}