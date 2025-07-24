import { NextRequest, NextResponse } from 'next/server';
import { githubFetcher } from '@utils/functions/githubFetcher';
import type { GitHubIssue } from '@utils/types';
import { fetchArtifacts } from '../fetch/route';

// Extended interface for GitHub issue with additional properties
interface ExtendedGitHubIssue extends GitHubIssue {
    labels?: Array<string | { name: string }>;
    milestone?: { title: string } | null;
    assignees?: Array<{ login: string }>;
}

interface ArtifactIssue {
    number: number;
    title: string;
    state: 'open' | 'closed';
    artifact_version: string;
    created_at: string;
    updated_at: string;
    url: string;
    report_count?: number;
    labels?: string[];
    milestone?: string | null;
    assignees?: string[];
    severity?: 'high' | 'medium' | 'low';
    last_comment_at?: string;
}

// Cache for issues to reduce API calls
interface IssuesCache {
    data: ArtifactIssue[];
    timestamp: number;
    etag?: string;
}

let issuesCache: IssuesCache | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_PAGES = 10;
const PER_PAGE = 100;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Function to handle GitHub API errors
function handleGitHubError(error: any, retries: number): never {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        switch (status) {
            case 401:
            case 403:
                throw new Error(`GitHub API Authentication Error: ${message}. Please check your GitHub token configuration.`);
            case 404:
                throw new Error(`GitHub API Resource Not Found: ${message}`);
            case 429:
                const resetTime = error.response.headers['x-ratelimit-reset'];
                const retryAfter = resetTime ? new Date(parseInt(resetTime) * 1000) : 'unknown';
                throw new Error(`GitHub API Rate Limit Exceeded. Please try again after ${retryAfter}`);
            default:
                if (retries > 0) {
                    throw new Error(`GitHub API Error (${status}): ${message}. Retrying...`);
                }
                throw new Error(`GitHub API Error (${status}): ${message}`);
        }
    }
    throw error;
}

// Function to fetch all pages of issues from GitHub with retry logic
async function fetchAllIssues(state: 'open' | 'closed', retries = MAX_RETRIES): Promise<ExtendedGitHubIssue[]> {
    let allIssues: ExtendedGitHubIssue[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages && page <= MAX_PAGES) {
        try {
            const response = await githubFetcher.get<ExtendedGitHubIssue[]>(
                `/repos/citizenfx/fivem/issues?state=${state}&per_page=${PER_PAGE}&page=${page}&sort=updated&direction=desc`,
                {
                    headers: {
                        'If-None-Match': issuesCache?.etag || '',
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.status === 304 && issuesCache) {
                console.log('Using cached issues data');
                return issuesCache.data.map(issue => ({
                    ...issue,
                    html_url: issue.url
                })) as ExtendedGitHubIssue[];
            }

            if (response.data.length === 0) {
                hasMorePages = false;
            } else {
                allIssues = [...allIssues, ...response.data];
                page++;
            }
        } catch (error) {
            console.error(`Error fetching ${state} issues page ${page}:`, error);

            if (retries > 0) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
                console.log(`Retrying in ${delay}ms... ${retries} attempts remaining`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchAllIssues(state, retries - 1);
            }

            handleGitHubError(error, retries);
        }
    }

    console.log(`Fetched ${allIssues.length} ${state} issues`);
    return allIssues;
}

// Enhanced function to check if an issue is related to artifacts
function isArtifactRelatedIssue(issue: ExtendedGitHubIssue): boolean {
    const artifactKeywords = [
        'artifact', 'fxserver', 'fxs', 'server', 'build', 'version',
        'five-server', 'fivem', 'runtime', 'runtime.fivem.net',
        'crash', 'error', 'bug', 'issue', 'problem'
    ];

    const title = issue.title.toLowerCase();
    const body = (issue.body || '').toLowerCase();

    // Check for keywords in title or body
    const hasKeyword = artifactKeywords.some(keyword =>
        title.includes(keyword) || body.includes(keyword)
    );

    // Check for artifact-related labels
    const issueLabels = issue.labels?.map(label =>
        (typeof label === 'string' ? label : label.name).toLowerCase()
    ) || [];

    const artifactLabels = [
        'artifact', 'fxserver', 'fxs', 'server', 'build', 'version',
        'five-server', 'fivem', 'runtime', 'bug', 'crash', 'error'
    ];

    const hasArtifactLabel = issueLabels.some(label =>
        artifactLabels.some(artifactLabel => label.includes(artifactLabel))
    );

    // Check for specific patterns in the body
    const hasArtifactPattern = /(?:artifact|fxserver|fxs)\s*(?:version|build)?\s*#?\d{4,}/i.test(body);

    return hasKeyword || hasArtifactLabel || hasArtifactPattern;
}

// Enhanced function to find artifact version references
function findArtifactVersionReferences(text: string, validVersions: Set<string>): string[] {
    const foundVersions = new Set<string>();

    // Common version patterns
    const versionPatterns = [
        /(?:Artifact\s+(?:Version\s+)?|FXServer\s+(?:b|build)?|FXS\s+(?:b|build)?)\s*(\d{4,})/gi,
        /(?:version|build|artifact|fxserver|fxs)\s*(?:#|number|no\.?|num\.?)?\s*(\d{4,})/gi,
        /(?:v|version|build|artifact|fxserver|fxs|server|build)\s*(?:#|number|no\.?|num\.?)?\s*(\d{4,})/gi
    ];

    // Check each pattern
    for (const pattern of versionPatterns) {
        const matches = [...text.matchAll(pattern)];
        for (const match of matches) {
            const version = match[1];
            if (validVersions.has(version)) {
                foundVersions.add(version);
            }
        }
    }

    // Check "Specific version(s)" section
    const specificVersionSection = text.match(/Specific version\(s\):\s*([\s\S]*?)(?:\n\n|$)/i);
    if (specificVersionSection) {
        const sectionText = specificVersionSection[1];
        const numberRegex = /\b(\d{4,})\b/g;
        const numberMatches = [...sectionText.matchAll(numberRegex)];

        for (const match of numberMatches) {
            const version = match[1];
            if (validVersions.has(version)) {
                foundVersions.add(version);
            }
        }
    }

    return Array.from(foundVersions);
}

// Function to determine issue severity based on labels and content
function determineSeverity(issue: ExtendedGitHubIssue): 'high' | 'medium' | 'low' {
    const labels = issue.labels?.map(label =>
        (typeof label === 'string' ? label : label.name).toLowerCase()
    ) || [];

    if (labels.includes('critical') || labels.includes('high-priority')) {
        return 'high';
    }
    if (labels.includes('medium-priority')) {
        return 'medium';
    }
    return 'low';
}

async function fetchIssuesWithArtifacts(): Promise<ArtifactIssue[]> {
    // Return cached data if it's still valid
    if (issuesCache && Date.now() - issuesCache.timestamp < CACHE_DURATION) {
        return issuesCache.data;
    }

    try {
        // Fetch valid artifact versions
        const artifactsData = await fetchArtifacts();
        const validVersions = new Set<string>([
            ...Object.keys(artifactsData.windows),
            ...Object.keys(artifactsData.linux)
        ]);

        console.log(`Found ${validVersions.size} valid artifact versions`);

        // Fetch both open and closed issues in parallel
        const [openIssues, closedIssues] = await Promise.all([
            fetchAllIssues('open'),
            fetchAllIssues('closed')
        ]);

        const allIssues = [...openIssues, ...closedIssues];
        const artifactIssues: ArtifactIssue[] = [];
        const processedIssueNumbers = new Set<number>();

        // Process issues in parallel batches
        const batchSize = 10;
        for (let i = 0; i < allIssues.length; i += batchSize) {
            const batch = allIssues.slice(i, i + batchSize);
            const batchPromises = batch.map(async (issue) => {
                if (processedIssueNumbers.has(issue.number)) {
                    return null;
                }

                const titleVersions = findArtifactVersionReferences(issue.title, validVersions);
                const bodyVersions = issue.body ? findArtifactVersionReferences(issue.body, validVersions) : [];
                const allVersions = [...new Set([...titleVersions, ...bodyVersions])];

                if (allVersions.length > 0) {
                    const labels = issue.labels?.map(label =>
                        typeof label === 'string' ? label : label.name
                    ) || [];

                    const milestone = issue.milestone?.title || null;
                    const assignees = issue.assignees?.map(assignee => assignee.login) || [];
                    const severity = determineSeverity(issue);

                    return allVersions.map(version => ({
                        number: issue.number,
                        title: issue.title,
                        state: issue.state as 'open' | 'closed',
                        artifact_version: version,
                        created_at: issue.created_at,
                        updated_at: issue.updated_at,
                        url: issue.html_url,
                        labels,
                        milestone,
                        assignees,
                        severity,
                        last_comment_at: issue.updated_at // Using updated_at as a proxy for last comment
                    }));
                }

                return null;
            });

            const batchResults = await Promise.all(batchPromises);
            const validResults = batchResults.flat().filter(Boolean) as ArtifactIssue[];
            artifactIssues.push(...validResults);

            batchResults.forEach(result => {
                if (result) {
                    processedIssueNumbers.add(result[0].number);
                }
            });
        }

        // Group issues by artifact version and add report count
        const groupedIssues = artifactIssues.reduce<Record<string, ArtifactIssue[]>>((acc, issue) => {
            acc[issue.artifact_version] = acc[issue.artifact_version] || [];
            acc[issue.artifact_version].push(issue);
            return acc;
        }, {});

        const issuesWithReportCount = Object.values(groupedIssues).flatMap(group =>
            group.map(issue => ({
                ...issue,
                report_count: group.length
            }))
        );

        // Sort by severity, then artifact version, then updated_at
        const sortedIssues = issuesWithReportCount.sort((a, b) => {
            const severityOrder = { high: 0, medium: 1, low: 2 };
            const severityCompare = severityOrder[a.severity || 'low'] - severityOrder[b.severity || 'low'];
            if (severityCompare !== 0) return severityCompare;

            const versionCompare = parseInt(b.artifact_version) - parseInt(a.artifact_version);
            if (versionCompare !== 0) return versionCompare;

            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        // Update cache
        issuesCache = {
            data: sortedIssues,
            timestamp: Date.now()
        };

        return sortedIssues;
    } catch (error) {
        console.error('Error fetching issues with artifacts:', error);
        if (issuesCache) {
            console.log('Returning cached data due to error');
            return issuesCache.data;
        }
        throw error;
    }
}

// Route segment configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Check if GitHub token is configured
        if (!process.env.GITHUB_TOKEN) {
            return NextResponse.json(
                { error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable.' },
                { status: 500 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const version = searchParams.get('version');
        const platform = searchParams.get('platform')?.toLowerCase();
        const state = searchParams.get('state')?.toLowerCase() as 'open' | 'closed' | undefined;
        const severity = searchParams.get('severity')?.toLowerCase() as 'high' | 'medium' | 'low' | undefined;

        const issues = await fetchIssuesWithArtifacts();

        // Apply filters
        let filteredIssues = issues;

        if (version) {
            filteredIssues = filteredIssues.filter(issue => issue.artifact_version === version);
        }

        if (platform) {
            filteredIssues = filteredIssues.filter(issue => {
                const artifact = platform === 'windows' ?
                    issuesCache?.data.find(i => i.artifact_version === issue.artifact_version) :
                    null;
                return artifact !== undefined;
            });
        }

        if (state) {
            filteredIssues = filteredIssues.filter(issue => issue.state === state);
        }

        if (severity) {
            filteredIssues = filteredIssues.filter(issue => issue.severity === severity);
        }

        // Calculate statistics
        const stats = {
            total: issues.length,
            open: issues.filter(i => i.state === 'open').length,
            closed: issues.filter(i => i.state === 'closed').length,
            bySeverity: {
                high: issues.filter(i => i.severity === 'high').length,
                medium: issues.filter(i => i.severity === 'medium').length,
                low: issues.filter(i => i.severity === 'low').length
            },
            byVersion: issues.reduce<Record<string, number>>((acc, issue) => {
                acc[issue.artifact_version] = (acc[issue.artifact_version] || 0) + 1;
                return acc;
            }, {})
        };

        return NextResponse.json({
            data: filteredIssues,
            metadata: {
                total: filteredIssues.length,
                stats,
                cache: {
                    timestamp: issuesCache?.timestamp,
                    age: issuesCache ? Date.now() - issuesCache.timestamp : 0
                }
            }
        });
    } catch (error) {
        console.error('Error in check API route:', error);

        if (error instanceof Error) {
            if (error.message.includes('Authentication Error')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 401 }
                );
            }
            if (error.message.includes('Rate Limit Exceeded')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 429 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Failed to retrieve artifact issues. Please try again later.' },
            { status: 500 }
        );
    }
}
