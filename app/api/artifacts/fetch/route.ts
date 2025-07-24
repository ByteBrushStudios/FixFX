import { NextRequest, NextResponse } from 'next/server';
import { githubFetcher } from '@utils/functions/githubFetcher';
import type { ArtifactData, ArtifactCategory, GitHubTag } from '@utils/types';

// Enhanced cache management
let artifactsCache: ArtifactData | null = null;
let lastFetchTime = 0;
let etagCache: string | null = null;
const CACHE_DURATION = 3600000; // 1 hour cache
const RATE_LIMIT_DELAY = 1000; // 1 second delay between batches
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_ARTIFACTS = 20; // Reduced from 50 to 20 to prevent timeouts
const BATCH_SIZE = 2; // Reduced from 3 to 2 for better rate limit handling
const FETCH_TIMEOUT = 10000; // 10 second timeout for fetch operations
const MIN_ARTIFACTS = 5; // Minimum number of artifacts to consider a successful fetch

// Known artifacts as fallback
const FALLBACK_ARTIFACTS = [
  { version: '6683', hash: 'ad6c90072e62cdb7ee0dcc943d7ded8a5107d542' },
  { version: '6624', hash: '779c1fa38ec01b33d79a5e994b7e0c1a0bbcg421' },
  { version: '6551', hash: 'b85db86b37fdcab942859d3ef31cc4bd43eee8f6' },
  { version: '6497', hash: 'a87d8d99b11e56da288b215c435a3d95f5e1aee5' },
  { version: '6337', hash: '8b8d86c8bd866af8725932ad8761212eb8fd3335' }
];

// Route segment configuration
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function fetchArtifacts(): Promise<ArtifactData> {
  const now = Date.now();
  const startTime = now;

  // Return cached data if valid
  if (artifactsCache && now - lastFetchTime < CACHE_DURATION) {
    console.log('Using cached artifacts data');
    return artifactsCache;
  }

  // Initialize empty data structure
  const processedData: ArtifactData = {
    windows: {},
    linux: {}
  };

  try {
    const allTags = await fetchAllTags();

    // If we got an empty array due to cache hit, return cache
    if (allTags.length === 0 && artifactsCache) {
      console.log('Using cached data due to empty tags response');
      return artifactsCache;
    }

    // If we got an empty array but no cache, use fallback
    if (allTags.length === 0) {
      console.log('No cache available, applying fallback data');
      applyFallbackData(processedData);
      return processedData;
    }

    console.log(`Fetched ${allTags.length} tags from GitHub`);

    // Process tags in smaller batches to prevent timeouts
    const MAX_PROCESSING_TIME = FETCH_TIMEOUT - 2000; // Leave 2 seconds buffer
    let processedCount = 0;

    for (let i = 0; i < allTags.length; i += BATCH_SIZE) {
      // Check if we're approaching the timeout
      if (Date.now() - startTime > MAX_PROCESSING_TIME) {
        console.log('Approaching timeout, using processed data so far');
        break;
      }

      const batch = allTags.slice(i, i + BATCH_SIZE);

      // Check rate limits before processing batch
      const rateLimitInfo = githubFetcher.getRateLimitInfo();
      if (rateLimitInfo.remaining < BATCH_SIZE) {
        console.log(`Rate limit too low (${rateLimitInfo.remaining} remaining) for batch processing, using available data`);
        break;
      }

      // Process commits sequentially within each batch
      for (const tag of batch) {
        try {
          // Check if we're approaching the timeout
          if (Date.now() - startTime > MAX_PROCESSING_TIME) {
            console.log('Approaching timeout, using processed data so far');
            break;
          }

          const versionMatch = tag.name.match(/v\d+\.\d+\.\d+[._-](\d+)/);
          if (!versionMatch) continue;

          // Check rate limits before each request
          const currentRateLimit = githubFetcher.getRateLimitInfo();
          if (currentRateLimit.remaining < 2) {
            console.log(`Rate limit too low (${currentRateLimit.remaining} remaining) for commit fetch, stopping`);
            break;
          }

          // Add delay between requests
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

          const commitResponse = await githubFetcher.get<{ commit: { committer: { date: string } } }>(
            `/repos/citizenfx/fivem/commits/${tag.commit.sha}`
          );

          const version = versionMatch[1];
          const sha = tag.commit.sha;
          const artifactId = `${version}-${sha}`;
          const commitDate = commitResponse.data.commit.committer.date;

          // Base URLs for artifacts
          const windowsBaseUrl = `https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/${artifactId}`;
          const linuxBaseUrl = `https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/${artifactId}`;

          // Create artifact entries
          processedData.windows[version] = {
            version,
            recommended: false,
            critical: false,
            download_urls: {
              zip: `${windowsBaseUrl}/server.zip`,
              '7z': `${windowsBaseUrl}/server.7z`
            },
            artifact_url: windowsBaseUrl,
            published_at: commitDate
          };

          processedData.linux[version] = {
            version,
            recommended: false,
            critical: false,
            download_urls: {
              zip: `${linuxBaseUrl}/fx.tar.xz`,
              '7z': `${linuxBaseUrl}/fx.tar.xz`
            },
            artifact_url: linuxBaseUrl,
            published_at: commitDate
          };

          processedCount++;
        } catch (error: any) {
          if (error.message?.includes('Rate Limit Exceeded')) {
            console.log('Rate limit hit while fetching commits, using available data');
            break;
          }
          console.error(`Failed to fetch commit for ${tag.name}:`, error);
          continue; // Skip this tag and continue with the next one
        }
      }

      // If we have enough artifacts, we can stop
      if (processedCount >= MIN_ARTIFACTS) {
        console.log(`Processed ${processedCount} artifacts, stopping early`);
        break;
      }

      // Add delay between batches
      if (i + BATCH_SIZE < allTags.length) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY * 2));
      }
    }

    // If we have no data after processing, use fallback
    if (Object.keys(processedData.windows).length === 0 && Object.keys(processedData.linux).length === 0) {
      console.log('No artifacts processed, applying fallback data');
      applyFallbackData(processedData);
      return processedData;
    }

    console.log(`Processed ${Object.keys(processedData.windows).length} artifacts`);

    // Add support status and EOL flags
    processedData.windows = calculateSupportStatus(processedData.windows);
    processedData.linux = calculateSupportStatus(processedData.linux);

    // Update cache
    artifactsCache = processedData;
    lastFetchTime = now;

    return processedData;
  } catch (error) {
    console.error('Error fetching artifacts:', error);

    if (artifactsCache) {
      console.log('Using cached data due to fetch error');
      return artifactsCache;
    }

    // Apply fallback data if no cache available
    console.log('No cache available, applying fallback data');
    applyFallbackData(processedData);
    return processedData;
  }
}

// Apply fallback data when network requests fail
function applyFallbackData(data: ArtifactData) {
  console.log('Applying fallback artifact data');
  FALLBACK_ARTIFACTS.forEach(({ version, hash }) => {
    const timestamp = new Date().toISOString();
    const winArtifactUrl = `https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/${version}-${hash}`;
    const linuxArtifactUrl = `https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/${version}-${hash}`;

    data.windows[version] = {
      version,
      recommended: version === '6683',
      critical: false,
      download_urls: {
        zip: `${winArtifactUrl}/server.zip`,
        '7z': `${winArtifactUrl}/server.7z`
      },
      artifact_url: winArtifactUrl,
      published_at: timestamp,
      eol: false,
      supportStatus: version === '6683' ? 'recommended' : 'active',
      supportEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    data.linux[version] = {
      version,
      recommended: version === '6683',
      critical: false,
      download_urls: {
        zip: `${linuxArtifactUrl}/fx.tar.xz`,
        '7z': `${linuxArtifactUrl}/fx.tar.xz`
      },
      artifact_url: linuxArtifactUrl,
      published_at: timestamp,
      eol: false,
      supportStatus: version === '6683' ? 'recommended' : 'active',
      supportEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
}

// Calculate support status based on release dates and recommended status
function calculateSupportStatus(artifacts: ArtifactCategory): ArtifactCategory {
  const versions = Object.keys(artifacts)
    .sort((a, b) => parseInt(b) - parseInt(a));

  const now = new Date();
  const SIX_WEEKS_MS = 42 * 24 * 60 * 60 * 1000;
  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

  let recommendedVersion = null;
  if (versions.length >= 2) {
    recommendedVersion = versions[1];
    artifacts[recommendedVersion].recommended = true;
  } else if (versions.length === 1) {
    recommendedVersion = versions[0];
    artifacts[recommendedVersion].recommended = true;
  }

  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    const artifact = artifacts[version];
    const nextVersion = i > 0 ? versions[i - 1] : null;
    const nextReleaseDate = nextVersion ? new Date(artifacts[nextVersion].published_at) : now;

    let supportEndsDate: Date;
    let supportStatus: 'recommended' | 'latest' | 'active' | 'deprecated' | 'eol' | 'unknown';

    if (version === recommendedVersion) {
      supportEndsDate = new Date(nextReleaseDate.getTime() + SIX_WEEKS_MS);
      supportStatus = "recommended";
    } else if (i === 0) {
      supportEndsDate = new Date(nextReleaseDate.getTime() + TWO_WEEKS_MS);
      supportStatus = "latest";
    } else {
      supportEndsDate = new Date(nextReleaseDate.getTime() + TWO_WEEKS_MS);
      supportStatus = "active";
    }

    if (supportEndsDate < now) {
      supportStatus = "eol";
    }

    artifacts[version] = {
      ...artifact,
      supportStatus,
      supportEnds: supportEndsDate.toISOString(),
      eol: supportStatus === "eol"
    };
  }

  return artifacts;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const version = searchParams.get('version');
    const platform = searchParams.get('platform')?.toLowerCase();
    const pageLimit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeEol = searchParams.get('includeEol') === 'true';
    const sortBy = searchParams.get('sortBy') || 'version';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const supportStatus = searchParams.get('status')?.toLowerCase();

    // If requesting a specific version, use cache if available
    if (version) {
      const now = Date.now();
      if (artifactsCache && (now - lastFetchTime < CACHE_DURATION)) {
        const response: any = {
          windows: {},
          linux: {}
        };
        const platforms = platform === 'windows' || platform === 'linux'
          ? [platform] : ['windows', 'linux'];

        let found = false;
        for (const plat of platforms) {
          const artifact = artifactsCache[plat as keyof typeof artifactsCache][version];
          if (artifact) {
            response[plat] = {
              [version]: {
                ...artifact,
                eol: artifact.eol || false,
                supportStatus: artifact.supportStatus || 'unknown',
              }
            };
            found = true;
          } else {
            response[plat] = {};
          }
        }

        if (found) {
          return NextResponse.json({
            data: response,
            metadata: {
              platforms,
              recommended: null,
              latest: null,
              stats: null,
              pagination: { limit: 1, offset: 0, filtered: 1, total: 1, currentPage: 1, totalPages: 1 },
              filters: { version },
              supportSchedule: {
                recommended: '6 weeks after next release',
                latest: '2 weeks after next release',
                eol: '3 months after release'
              },
            }
          });
        }
      }
    }

    // Fetch artifacts with timeout
    const artifactsPromise = fetchArtifacts();
    const timeoutPromise = new Promise<ArtifactData>((_, reject) => {
      setTimeout(() => reject(new Error('Fetching operation timed out')), FETCH_TIMEOUT);
    });

    const artifactsData = await Promise.race([artifactsPromise, timeoutPromise]);

    // Apply fallback data if needed
    if (Object.keys(artifactsData.windows).length === 0 && Object.keys(artifactsData.linux).length === 0) {
      applyFallbackData(artifactsData);
    }

    // Filter and paginate the data
    let fullResponse: any = {
      windows: {},
      linux: {}
    };

    if (platform === 'windows' || platform === 'linux') {
      fullResponse = { [platform]: {} };
    }

    const filteredCounts: Record<string, number> = {};

    for (const plat in fullResponse) {
      const platformData = artifactsData[plat as keyof typeof artifactsData];
      const filteredArtifacts: any[] = [];

      // Filter artifacts
      for (const ver in platformData) {
        const artifact = platformData[ver];

        if (artifact.eol && !includeEol) continue;
        if (supportStatus && artifact.supportStatus !== supportStatus) continue;

        const artifactStatus = artifact.supportStatus || 'unknown';
        filteredArtifacts.push({
          ...artifact,
          version: ver,
          eol: artifact.eol || false,
          supportStatus: artifactStatus as 'recommended' | 'latest' | 'active' | 'deprecated' | 'eol' | 'unknown'
        });
      }

      // Sort artifacts
      filteredArtifacts.sort((a, b) => {
        if (sortBy === 'date') {
          const dateA = new Date(a.published_at).getTime();
          const dateB = new Date(b.published_at).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          const versionA = parseInt(a.version);
          const versionB = parseInt(b.version);
          return sortOrder === 'asc' ? versionA - versionB : versionB - versionA;
        }
      });

      // Apply pagination
      const paginatedArtifacts = filteredArtifacts.slice(offset, offset + pageLimit);
      filteredCounts[plat] = filteredArtifacts.length;

      fullResponse[plat] = {};
      paginatedArtifacts.forEach(artifact => {
        const { version, ...rest } = artifact;
        fullResponse[plat][version] = rest;
      });
    }

    // Calculate metadata
    const recommended: any = {};
    const latest: any = {};
    const stats: any = {};

    for (const plat in artifactsData) {
      if (!(plat in fullResponse)) continue;

      recommended[plat] = null;
      latest[plat] = null;

      const allArtifacts = Object.values(artifactsData[plat as keyof typeof artifactsData]);

      stats[plat] = {
        total: allArtifacts.length,
        filtered: filteredCounts[plat] || 0,
        recommended: allArtifacts.filter(a => (a as any).supportStatus === 'recommended').length,
        latest: allArtifacts.filter(a => (a as any).supportStatus === 'latest').length,
        active: allArtifacts.filter(a => (a as any).supportStatus === 'active').length,
        deprecated: allArtifacts.filter(a => (a as any).supportStatus === 'deprecated').length,
        eol: allArtifacts.filter(a => (a as any).eol).length
      };

      const sortedVersions = Object.keys(artifactsData[plat as keyof typeof artifactsData])
        .sort((a, b) => parseInt(b) - parseInt(a));

      if (sortedVersions.length > 0) {
        const latestVer = sortedVersions[0];
        const artifact = artifactsData[plat as keyof typeof artifactsData][latestVer];
        latest[plat] = {
          ...artifact,
          version: latestVer,
          eol: artifact.eol || false,
          supportStatus: 'latest' as const
        };
      }

      const recommendedVer = sortedVersions.find(ver =>
        artifactsData[plat as keyof typeof artifactsData][ver].supportStatus === 'recommended'
      );

      if (recommendedVer) {
        const artifact = artifactsData[plat as keyof typeof artifactsData][recommendedVer];
        recommended[plat] = {
          ...artifact,
          version: recommendedVer,
          eol: artifact.eol || false,
          supportStatus: 'recommended' as const
        };
      }
    }

    return NextResponse.json({
      data: fullResponse,
      metadata: {
        platforms: Object.keys(fullResponse),
        recommended,
        latest,
        stats,
        pagination: {
          limit: pageLimit,
          offset,
          filtered: filteredCounts[platform || 'windows'] || 0,
          total: stats[platform || 'windows']?.total || 0,
          currentPage: Math.floor(offset / pageLimit) + 1,
          totalPages: Math.ceil((filteredCounts[platform || 'windows'] || 0) / pageLimit)
        },
        filters: {
          platform,
          supportStatus,
          includeEol,
          sortBy,
          sortOrder
        },
        supportSchedule: {
          recommended: '6 weeks after next release',
          latest: '2 weeks after next release',
          eol: '3 months after release'
        },
        supportStatusExplanation: {
          recommended: 'Fully supported, recommended for production use',
          latest: 'Most recent build, supported for testing',
          active: 'Currently supported',
          deprecated: 'Support ended, but still usable',
          eol: 'End of life, not supported and may be inaccessible from server browser',
          info: 'https://aka.cfx.re/eol'
        }
      }
    });
  } catch (error) {
    console.error('Error in artifacts API route:', error);

    if (error instanceof Error && error.message.includes('timed out')) {
      return NextResponse.json(
        { error: 'Request processing timed out. Please try again with fewer filters or a smaller dataset.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to retrieve artifacts data. Please try again later.' },
      { status: 500 }
    );
  }
}

async function fetchAllTags(): Promise<GitHubTag[]> {
  try {
    const allTags: GitHubTag[] = [];
    let page = 1;
    const PER_PAGE = 50;

    // Check rate limits before starting
    const rateLimitInfo = githubFetcher.getRateLimitInfo();
    if (rateLimitInfo.remaining < 10) {
      console.log(`Rate limit low (${rateLimitInfo.remaining} remaining), using cache if available`);
      if (artifactsCache) {
        return []; // Signal to use cache
      }
      console.log('No cache available and rate limit low, using fallback data');
      return [];
    }

    // Fetch first page with retry logic
    let retryCount = 0;
    let initialResponse;

    while (retryCount < MAX_RETRIES) {
      try {
        initialResponse = await githubFetcher.get<GitHubTag[]>(
          `/repos/citizenfx/fivem/tags?per_page=${PER_PAGE}&page=${page}`,
          { headers: etagCache ? { 'If-None-Match': etagCache } : {} }
        );

        // Handle 304 Not Modified response
        if (initialResponse.status === 304) {
          console.log('Using cached GitHub tags data (304 Not Modified)');
          if (artifactsCache) {
            return []; // Signal to use cache
          }
          // If we get a 304 but no cache, we need to fetch fresh data
          console.log('Received 304 but no cache available, fetching fresh data');
          etagCache = null; // Clear etag to force fresh fetch
          continue;
        }

        break;
      } catch (error: any) {
        if (error.message?.includes('Rate Limit Exceeded')) {
          retryCount++;
          if (retryCount === MAX_RETRIES) {
            console.log('Max retries reached for rate limit, using fallback data');
            return [];
          }
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
          console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        console.error('Error fetching tags:', error);
        return [];
      }
    }

    if (!initialResponse) {
      console.log('Failed to fetch initial response, using fallback data');
      return [];
    }

    // Store the new etag
    etagCache = initialResponse.headers.etag;
    allTags.push(...initialResponse.data);

    // Only fetch more pages if we haven't reached MAX_ARTIFACTS
    if (allTags.length < MAX_ARTIFACTS) {
      const linkHeader = initialResponse.headers.link;
      const lastPageMatch = linkHeader?.match(/page=(\d+)>; rel="last"/);
      const totalPages = lastPageMatch ? Math.min(parseInt(lastPageMatch[1]), Math.ceil(MAX_ARTIFACTS / PER_PAGE)) : 1;

      // Fetch remaining pages sequentially with delays
      for (let i = 2; i <= totalPages && allTags.length < MAX_ARTIFACTS; i++) {
        // Check rate limits before each request
        const currentRateLimit = githubFetcher.getRateLimitInfo();
        if (currentRateLimit.remaining < 5) {
          console.log(`Rate limit low (${currentRateLimit.remaining} remaining), stopping pagination`);
          break;
        }

        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        try {
          const response = await githubFetcher.get<GitHubTag[]>(
            `/repos/citizenfx/fivem/tags?per_page=${PER_PAGE}&page=${i}`
          );
          allTags.push(...response.data);
        } catch (error: any) {
          if (error.message?.includes('Rate Limit Exceeded')) {
            console.log('Rate limit hit while fetching additional pages, using available data');
            break;
          }
          throw error;
        }
      }
    }

    // Sort tags by version number and take only the most recent MAX_ARTIFACTS
    return allTags
      .sort((a, b) => {
        const versionA = parseInt(a.name.match(/v\d+\.\d+\.\d+[._-](\d+)/)?.[1] || '0');
        const versionB = parseInt(b.name.match(/v\d+\.\d+\.\d+[._-](\d+)/)?.[1] || '0');
        return versionB - versionA;
      })
      .slice(0, MAX_ARTIFACTS);
  } catch (error) {
    console.error('Error fetching tags:', error);
    if (artifactsCache) {
      console.log('Using cached data due to fetch error');
      return [];
    }
    throw error;
  }
}
