import { NextResponse } from "next/server";

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

interface Commit {
  author: GitHubUser;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
}

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = "FixFXOSS";

async function fetchRepos() {
  const response = await fetch(
    `https://api.github.com/orgs/${ORG_NAME}/repos`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.statusText}`);
  }

  return response.json();
}

async function fetchCommits(repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${ORG_NAME}/${repo}/commits`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch commits for ${repo}: ${response.statusText}`);
  }

  return response.json();
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    // Get all repositories in the organization
    const repos = await fetchRepos();
    
    // Map to store contributor data
    const contributorsMap = new Map<string, Contributor>();

    // Fetch commits for each repository
    for (const repo of repos) {
      try {
        const commits = await fetchCommits(repo.name);
        
        // Process commits and aggregate contributor data
        for (const commit of commits) {
          const author = commit.author;
          if (!author) continue;

          const existingContributor = contributorsMap.get(author.login);
          if (existingContributor) {
            existingContributor.contributions += 1;
          } else {
            contributorsMap.set(author.login, {
              login: author.login,
              id: author.id,
              avatar_url: author.avatar_url,
              html_url: author.html_url,
              contributions: 1,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing repo ${repo.name}:`, error);
        // Continue with next repo even if one fails
        continue;
      }
    }

    // Convert map to array and sort by contributions
    const contributors = Array.from(contributorsMap.values()).sort(
      (a, b) => b.contributions - a.contributions
    );

    return NextResponse.json(contributors);
  } catch (error) {
    console.error("Error fetching contributor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributor data" },
      { status: 500 }
    );
  }
} 