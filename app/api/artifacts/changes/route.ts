import { NextRequest, NextResponse } from 'next/server';
import { githubFetcher } from '@utils/functions/githubFetcher';
import type { GitHubTag, GitHubCommit } from '@utils/types';

interface GitHubCompare {
    commits: Array<{
        sha: string;
        commit: {
            message: string;
            author: {
                name: string;
                email: string;
                date: string;
            };
        };
        html_url: string;
        stats?: {
            additions: number;
            deletions: number;
            total: number;
        };
    }>;
    files: Array<{
        filename: string;
        status: string;
        additions: number;
        deletions: number;
        changes: number;
        blob_url: string;
        raw_url: string;
        patch?: string;
    }>;
}

interface CommitChange {
    sha: string;
    message: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    url: string;
    stats: {
        additions: number;
        deletions: number;
        total: number;
    };
}

interface FileChange {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    patch?: string;
}

interface ChangelogEntry {
    version: string;
    tag: string;
    commits: CommitChange[];
    files: FileChange[];
    summary: {
        total: number;
        features: number;
        fixes: number;
        other: number;
        stats: {
            additions: number;
            deletions: number;
            changes: number;
        };
    };
}

// Cache management
const changelogCache: Record<string, ChangelogEntry> = {};
const CACHE_DURATION = 3600000; // 1 hour cache

async function fetchChangelog(fromVersion: string, toVersion: string): Promise<ChangelogEntry> {
    const cacheKey = `${fromVersion}-${toVersion}`;

    // Check cache first
    if (changelogCache[cacheKey]) {
        return changelogCache[cacheKey];
    }

    try {
        // Find the tags that correspond to these versions
        const tagsResponse = await githubFetcher.get<GitHubTag[]>('/repos/citizenfx/fivem/tags');
        const fromTag = tagsResponse.data.find(tag => {
            const versionMatch = tag.name.match(/v\d+\.\d+\.\d+\.(\d+)/);
            return versionMatch && versionMatch[1] === fromVersion;
        });
        const toTag = tagsResponse.data.find(tag => {
            const versionMatch = tag.name.match(/v\d+\.\d+\.\d+\.(\d+)/);
            return versionMatch && versionMatch[1] === toVersion;
        });

        if (!fromTag || !toTag) {
            throw new Error(`No tag found for version ${!fromTag ? fromVersion : toVersion}`);
        }

        // Use GitHub's compare API to get detailed diff information
        const compareResponse = await githubFetcher.get<GitHubCompare>(
            `/repos/citizenfx/fivem/compare/${fromTag.name}...${toTag.name}`
        );

        // Process commits with stats
        const commits = compareResponse.data.commits.map((commit: GitHubCompare['commits'][0]): CommitChange => ({
            sha: commit.sha.substring(0, 7),
            message: commit.commit.message,
            author: {
                name: commit.commit.author.name,
                email: commit.commit.author.email,
                date: commit.commit.author.date
            },
            url: commit.html_url,
            stats: {
                additions: commit.stats?.additions || 0,
                deletions: commit.stats?.deletions || 0,
                total: commit.stats?.total || 0
            }
        }));

        // Process file changes
        const files = compareResponse.data.files.map((file: GitHubCompare['files'][0]): FileChange => ({
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            blob_url: file.blob_url,
            raw_url: file.raw_url,
            patch: file.patch
        }));

        // Categorize commits
        const features = commits.filter((commit: CommitChange) =>
            commit.message.toLowerCase().includes('feat:') ||
            commit.message.toLowerCase().includes('feature:')
        );

        const fixes = commits.filter((commit: CommitChange) =>
            commit.message.toLowerCase().includes('fix:') ||
            commit.message.toLowerCase().includes('bug:') ||
            commit.message.toLowerCase().includes('fixes:')
        );

        const other = commits.filter((commit: CommitChange) =>
            !features.includes(commit) && !fixes.includes(commit)
        );

        // Calculate total stats
        const totalStats = files.reduce((acc: { additions: number; deletions: number; changes: number }, file: FileChange) => ({
            additions: acc.additions + file.additions,
            deletions: acc.deletions + file.deletions,
            changes: acc.changes + file.changes
        }), { additions: 0, deletions: 0, changes: 0 });

        // Create changelog entry
        const changelogEntry: ChangelogEntry = {
            version: toVersion,
            tag: toTag.name,
            commits,
            files,
            summary: {
                total: commits.length,
                features: features.length,
                fixes: fixes.length,
                other: other.length,
                stats: totalStats
            }
        };

        // Cache the result
        changelogCache[cacheKey] = changelogEntry;

        return changelogEntry;
    } catch (error) {
        console.error(`Error fetching changelog between versions ${fromVersion} and ${toVersion}:`, error);
        throw error;
    }
}

// Route segment configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const version = searchParams.get('version');
        const format = searchParams.get('format') || 'json';
        const includeDiffs = searchParams.get('includeDiffs') === 'true';

        if (!version) {
            return NextResponse.json(
                { error: 'Version parameter is required' },
                { status: 400 }
            );
        }

        // Find the tag for the requested version
        const tagsResponse = await githubFetcher.get<GitHubTag[]>('/repos/citizenfx/fivem/tags');
        const currentTag = tagsResponse.data.find(tag => {
            const versionMatch = tag.name.match(/v\d+\.\d+\.\d+\.(\d+)/);
            return versionMatch && versionMatch[1] === version;
        });

        if (!currentTag) {
            return NextResponse.json(
                { error: `No tag found for version ${version}` },
                { status: 404 }
            );
        }

        // Find the previous tag (assuming tags are sorted by creation date)
        const previousTag = tagsResponse.data.find(tag => {
            const versionMatch = tag.name.match(/v\d+\.\d+\.\d+\.(\d+)/);
            return versionMatch && parseInt(versionMatch[1]) < parseInt(version);
        });

        if (!previousTag) {
            return NextResponse.json(
                { error: `No previous version found for ${version}` },
                { status: 404 }
            );
        }

        // Extract the previous version number
        const previousVersionMatch = previousTag.name.match(/v\d+\.\d+\.\d+\.(\d+)/);
        const previousVersion = previousVersionMatch ? previousVersionMatch[1] : null;

        if (!previousVersion) {
            return NextResponse.json(
                { error: `Could not determine previous version for ${version}` },
                { status: 500 }
            );
        }

        // Fetch the changelog between the previous version and the requested version
        const changelog = await fetchChangelog(previousVersion, version);

        // Format the response based on the requested format
        if (format === 'markdown') {
            // Generate markdown format
            let markdown = `# Changelog for FiveM Artifact ${version}\n\n`;
            markdown += `Comparing ${previousVersion} to ${version}\n\n`;
            markdown += `## Summary\n\n`;
            markdown += `- Total changes: ${changelog.summary.total}\n`;
            markdown += `- Features: ${changelog.summary.features}\n`;
            markdown += `- Fixes: ${changelog.summary.fixes}\n`;
            markdown += `- Other: ${changelog.summary.other}\n`;
            markdown += `- Total additions: ${changelog.summary.stats.additions}\n`;
            markdown += `- Total deletions: ${changelog.summary.stats.deletions}\n\n`;
            markdown += `## Files Changed\n\n`;

            // Group files by status
            const added = changelog.files.filter(f => f.status === 'added');
            const modified = changelog.files.filter(f => f.status === 'modified');
            const removed = changelog.files.filter(f => f.status === 'removed');

            if (added.length > 0) {
                markdown += `### Added Files\n\n`;
                added.forEach(file => {
                    markdown += `- \`${file.filename}\` (+${file.additions})\n`;
                });
                markdown += '\n';
            }

            if (modified.length > 0) {
                markdown += `### Modified Files\n\n`;
                modified.forEach(file => {
                    markdown += `- \`${file.filename}\` (+${file.additions} -${file.deletions})\n`;
                    if (includeDiffs && file.patch) {
                        markdown += '```diff\n';
                        markdown += file.patch;
                        markdown += '\n```\n\n';
                    }
                });
                markdown += '\n';
            }

            if (removed.length > 0) {
                markdown += `### Removed Files\n\n`;
                removed.forEach(file => {
                    markdown += `- \`${file.filename}\` (-${file.deletions})\n`;
                });
                markdown += '\n';
            }

            markdown += `## Commits\n\n`;

            // Group commits by type
            const features = changelog.commits.filter(commit =>
                commit.message.toLowerCase().includes('feat:') ||
                commit.message.toLowerCase().includes('feature:')
            );

            const fixes = changelog.commits.filter(commit =>
                commit.message.toLowerCase().includes('fix:') ||
                commit.message.toLowerCase().includes('bug:') ||
                commit.message.toLowerCase().includes('fixes:')
            );

            const other = changelog.commits.filter(commit =>
                !features.includes(commit) && !fixes.includes(commit)
            );

            if (features.length > 0) {
                markdown += `### Features\n\n`;
                features.forEach(commit => {
                    markdown += `- [${commit.sha}](${commit.url}) ${commit.message.split('\n')[0]}\n`;
                    markdown += `  Stats: +${commit.stats.additions} -${commit.stats.deletions}\n`;
                });
                markdown += '\n';
            }

            if (fixes.length > 0) {
                markdown += `### Fixes\n\n`;
                fixes.forEach(commit => {
                    markdown += `- [${commit.sha}](${commit.url}) ${commit.message.split('\n')[0]}\n`;
                    markdown += `  Stats: +${commit.stats.additions} -${commit.stats.deletions}\n`;
                });
                markdown += '\n';
            }

            if (other.length > 0) {
                markdown += `### Other Changes\n\n`;
                other.forEach(commit => {
                    markdown += `- [${commit.sha}](${commit.url}) ${commit.message.split('\n')[0]}\n`;
                    markdown += `  Stats: +${commit.stats.additions} -${commit.stats.deletions}\n`;
                });
            }

            return new NextResponse(markdown, {
                headers: {
                    'Content-Type': 'text/markdown',
                },
            });
        } else if (format === 'html') {
            // Generate HTML format
            let html = `<h1>Changelog for FiveM Artifact ${version}</h1>`;
            html += `<p>Comparing ${previousVersion} to ${version}</p>`;
            html += `<h2>Summary</h2>`;
            html += `<ul>`;
            html += `<li>Total changes: ${changelog.summary.total}</li>`;
            html += `<li>Features: ${changelog.summary.features}</li>`;
            html += `<li>Fixes: ${changelog.summary.fixes}</li>`;
            html += `<li>Other: ${changelog.summary.other}</li>`;
            html += `<li>Total additions: ${changelog.summary.stats.additions}</li>`;
            html += `<li>Total deletions: ${changelog.summary.stats.deletions}</li>`;
            html += `</ul>`;

            // Add file changes section
            html += `<h2>Files Changed</h2>`;

            const added = changelog.files.filter(f => f.status === 'added');
            const modified = changelog.files.filter(f => f.status === 'modified');
            const removed = changelog.files.filter(f => f.status === 'removed');

            if (added.length > 0) {
                html += `<h3>Added Files</h3><ul>`;
                added.forEach(file => {
                    html += `<li><code>${file.filename}</code> (+${file.additions})</li>`;
                });
                html += `</ul>`;
            }

            if (modified.length > 0) {
                html += `<h3>Modified Files</h3><ul>`;
                modified.forEach(file => {
                    html += `<li><code>${file.filename}</code> (+${file.additions} -${file.deletions})</li>`;
                    if (includeDiffs && file.patch) {
                        html += `<pre><code class="diff">${file.patch}</code></pre>`;
                    }
                });
                html += `</ul>`;
            }

            if (removed.length > 0) {
                html += `<h3>Removed Files</h3><ul>`;
                removed.forEach(file => {
                    html += `<li><code>${file.filename}</code> (-${file.deletions})</li>`;
                });
                html += `</ul>`;
            }

            // Add commits section
            html += `<h2>Commits</h2>`;

            // Group commits by type
            const features = changelog.commits.filter(commit =>
                commit.message.toLowerCase().includes('feat:') ||
                commit.message.toLowerCase().includes('feature:')
            );

            const fixes = changelog.commits.filter(commit =>
                commit.message.toLowerCase().includes('fix:') ||
                commit.message.toLowerCase().includes('bug:') ||
                commit.message.toLowerCase().includes('fixes:')
            );

            const other = changelog.commits.filter(commit =>
                !features.includes(commit) && !fixes.includes(commit)
            );

            if (features.length > 0) {
                html += `<h3>Features</h3><ul>`;
                features.forEach(commit => {
                    html += `<li><a href="${commit.url}">${commit.sha}</a> ${commit.message.split('\n')[0]}`;
                    html += `<br>Stats: +${commit.stats.additions} -${commit.stats.deletions}</li>`;
                });
                html += `</ul>`;
            }

            if (fixes.length > 0) {
                html += `<h3>Fixes</h3><ul>`;
                fixes.forEach(commit => {
                    html += `<li><a href="${commit.url}">${commit.sha}</a> ${commit.message.split('\n')[0]}`;
                    html += `<br>Stats: +${commit.stats.additions} -${commit.stats.deletions}</li>`;
                });
                html += `</ul>`;
            }

            if (other.length > 0) {
                html += `<h3>Other Changes</h3><ul>`;
                other.forEach(commit => {
                    html += `<li><a href="${commit.url}">${commit.sha}</a> ${commit.message.split('\n')[0]}`;
                    html += `<br>Stats: +${commit.stats.additions} -${commit.stats.deletions}</li>`;
                });
                html += `</ul>`;
            }

            return new NextResponse(html, {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        }

        // Default JSON response
        return NextResponse.json({
            data: {
                commits: changelog.commits,
                files: includeDiffs ? changelog.files : changelog.files.map(({ patch, ...rest }) => rest),
                metadata: {
                    from: previousVersion,
                    to: version,
                    totalCommits: changelog.summary.total,
                    totalFiles: changelog.files.length,
                    stats: changelog.summary.stats
                }
            }
        });
    } catch (error) {
        console.error('Error in artifacts changes route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch changelog. Please try again later.' },
            { status: 500 }
        );
    }
}