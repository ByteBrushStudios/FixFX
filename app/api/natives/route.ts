import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Types for natives
interface Param {
  name: string;
  type: string;
  description?: string;
}

interface Native {
  name: string;
  params: Param[];
  results: string;
  description: string;
  hash: string;
  jhash?: string;
  ns: string;
  resultsDescription?: string;
  environment: 'client' | 'server' | 'shared';
  apiset?: string;
  game: 'gta5' | 'rdr3';
  isCfx?: boolean;
}

// Cache management
const nativesCache: Record<string, any> = {
  gta5: null,
  rdr3: null,
  cfx: null
};
let lastFetchTime: Record<string, number> = {
  gta5: 0,
  rdr3: 0,
  cfx: 0
};
const CACHE_DURATION = 3600000; // 1 hour cache

// Endpoint URLs - Correctly mapped to their content
const ENDPOINTS = {
  gta5: 'https://runtime.fivem.net/doc/natives.json',      // GTA V natives
  rdr3: 'https://runtime.fivem.net/doc/natives_rdr3.json', // RDR2/RedM natives
  cfx: 'https://runtime.fivem.net/doc/natives_cfx.json'    // CFX-specific natives for both games
};

async function fetchNatives(source: 'gta5' | 'rdr3' | 'cfx'): Promise<any> {
  const now = Date.now();

  // Return cached data if valid
  if (nativesCache[source] && now - lastFetchTime[source] < CACHE_DURATION) {
    return nativesCache[source];
  }

  try {
    console.log(`Fetching ${source} natives from ${ENDPOINTS[source]}`);
    const response = await axios.get(ENDPOINTS[source], {
      headers: {
        'User-Agent': 'FixFX-Wiki/1.0'
      }
    });

    // Update cache
    nativesCache[source] = response.data;
    lastFetchTime[source] = now;

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${source} natives:`, error);
    throw error;
  }
}

// Helper function to process natives with more accurate environment detection
function processNatives(rawData: any, source: 'gta5' | 'rdr3' | 'cfx'): Native[] {
  const result: Native[] = [];

  for (const namespace in rawData) {
    for (const hash in rawData[namespace]) {
      const nativeData = rawData[namespace][hash];

      // Skip if this is not a proper native
      if (!nativeData.name) continue;

      // Process parameters
      const params: Param[] = nativeData.params?.map((param: any) => ({
        name: param.name,
        type: param.type,
        description: param.description || undefined
      })) || [];

      // Determine game - This logic handles multiple situations
      let assignedGame: 'gta5' | 'rdr3';
      let isCfx = false;

      // First determine if it's a CFX native
      if (source === 'cfx' || namespace === 'CFX') {
        isCfx = true;
      }

      // Then determine which game it belongs to
      if (source === 'rdr3' || nativeData.game === 'rdr3') {
        assignedGame = 'rdr3';
      } else {
        // Default to GTA V if not explicitly RDR3
        assignedGame = 'gta5';
      }

      // Determine environment based on a combination of factors:
      // 1. Explicit apiset if present
      // 2. Namespace conventions (server namespaces)
      // 3. CFX namespace special handling
      let environment: 'client' | 'server' | 'shared' = 'client'; // Default to client

      // First check explicit apiset if available
      if (nativeData.apiset) {
        environment = nativeData.apiset === 'server' ? 'server' :
          nativeData.apiset === 'shared' ? 'shared' : 'client';
      }
      // For CFX namespace without explicit apiset, determine by function name patterns
      else if (namespace === 'CFX') {
        // Common server-side function prefixes in CFX namespace
        if (
          nativeData.name.startsWith('GET_') ||
          nativeData.name.startsWith('SET_') ||
          nativeData.name.startsWith('IS_') ||
          nativeData.name.includes('SERVER') ||
          nativeData.name.includes('PLAYER') ||
          nativeData.name.includes('RESOURCE') ||
          nativeData.name.includes('CONVAR')
        ) {
          // These are commonly server-side but we need to check for client exceptions
          if (
            nativeData.name.includes('_CLIENT_') ||
            nativeData.name.includes('NUI_') ||
            nativeData.name.includes('SCREEN') ||
            nativeData.name.includes('MINIMAP') ||
            nativeData.name.includes('CAMERA') ||
            nativeData.name.includes('AUDIO') ||
            nativeData.name.includes('TEXTURE')
          ) {
            environment = 'client';
          } else {
            environment = 'server';
          }
        }
        // Explicitly client-side patterns
        else if (
          nativeData.name.includes('NUI_') ||
          nativeData.name.includes('SCREEN') ||
          nativeData.name.includes('MINIMAP') ||
          nativeData.name.includes('CAMERA') ||
          nativeData.name.includes('AUDIO') ||
          nativeData.name.includes('TEXTURE') ||
          nativeData.name.includes('DRAW') ||
          nativeData.name.includes('STREAMING')
        ) {
          environment = 'client';
        }
        // If not matched by patterns yet, set based on function name
        else {
          // More server patterns
          if (
            nativeData.name.includes('NETWORK') ||
            nativeData.name.includes('EVENT') ||
            nativeData.name.includes('ENTITY') && !nativeData.name.includes('CREATE')
          ) {
            environment = 'server';
          } else {
            // Default to client if no clear indicator
            environment = 'client';
          }
        }
      }
      // Check namespaces that are typically server-side
      else if (
        namespace === 'NETWORK' ||
        namespace === 'PLAYER' && !nativeData.name.includes('LOCAL_PLAYER') ||
        namespace.includes('SERVER') ||
        namespace.includes('_SV')
      ) {
        environment = 'server';
      }

      // Build native object with proper namespace and environment information
      const native: Native = {
        name: nativeData.name,
        params,
        results: nativeData.resultsType || nativeData.results || 'void',
        description: nativeData.description || '',
        hash,
        jhash: nativeData.jhash,
        ns: namespace,
        resultsDescription: nativeData.resultsDescription,
        environment,
        apiset: nativeData.apiset,
        game: assignedGame,
        isCfx
      };

      result.push(native);
    }
  }

  return result;
}

// Helper function to categorize namespaces by game and environment
function organizeNamespacesByGameAndEnvironment(allNatives: Native[]) {
  const categories = {
    gta5: {
      all: new Set<string>(),
      client: new Set<string>(),
      server: new Set<string>(),
      shared: new Set<string>()
    },
    rdr3: {
      all: new Set<string>(),
      client: new Set<string>(),
      server: new Set<string>(),
      shared: new Set<string>()
    }
  };

  // Special handling for CFX namespace which contains server functions
  let hasCfxNamespace = false;

  // First pass: collect all namespaces by game and environment
  allNatives.forEach(native => {
    const game = native.game as 'gta5' | 'rdr3';
    const env = native.environment as 'client' | 'server' | 'shared';

    // Add to game-specific collections
    categories[game].all.add(native.ns);
    categories[game][env].add(native.ns);

    // Track if we've seen any CFX namespaces
    if (native.ns === 'CFX') {
      hasCfxNamespace = true;
    }
  });

  // Convert Sets to sorted arrays
  const result = {} as any;
  for (const game of ['gta5', 'rdr3']) {
    result[game] = {};
    for (const env of ['all', 'client', 'server', 'shared']) {
      result[game][env] = Array.from(categories[game as 'gta5' | 'rdr3'][env as 'all' | 'client' | 'server' | 'shared']).sort();
    }
  }

  return {
    namespacesByGameAndEnv: result,
    hasCfxNamespace
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract and validate query parameters
    const game = (searchParams.get('game') || 'gta5') as 'gta5' | 'rdr3';
    const environment = searchParams.get('environment')?.toLowerCase() as 'client' | 'server' | 'shared' | 'all' | null;
    const ns = searchParams.get('ns')?.toUpperCase();
    const search = searchParams.get('search')?.toLowerCase();
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeCfx = searchParams.get('cfx') !== 'false';

    // Determine which sources to fetch
    const sources: Array<'gta5' | 'rdr3' | 'cfx'> = [game];
    if (includeCfx) sources.push('cfx');

    // For full API documentation, if requested (used for metadata only)
    if (searchParams.has('full')) {
      if (game === 'gta5' && !sources.includes('rdr3')) {
        sources.push('rdr3');
      } else if (game === 'rdr3' && !sources.includes('gta5')) {
        sources.push('gta5');
      }
    }

    console.log("Fetching natives for sources:", sources);

    // Fetch all requested native sources
    const nativesPromises = sources.map(src => fetchNatives(src));
    const nativesResults = await Promise.allSettled(nativesPromises);

    // Process successful results
    let allNatives: Native[] = [];

    nativesResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const processedNatives = processNatives(result.value, sources[index]);
        allNatives = [...allNatives, ...processedNatives];
      } else {
        console.error(`Failed to fetch natives for ${sources[index]}:`, result.reason);
      }
    });

    // Extract unique namespaces and organize by game and environment
    const { namespacesByGameAndEnv, hasCfxNamespace } = organizeNamespacesByGameAndEnvironment(allNatives);

    // Optimized filtering logic
    let filteredNatives = allNatives.filter(native => {
      // Game filter
      if (native.game !== game && !native.isCfx) return false;

      // Environment filter
      if (environment && environment !== 'all') {
        if (native.environment !== environment && native.environment !== 'shared') {
          return false;
        }
      }

      // Namespace filter
      if (ns && native.ns !== ns) return false;

      // Search filter - optimized for performance
      if (search) {
        const searchTerms = search.split(/\s+/);
        return searchTerms.every(term => {
          const matches = [
            native.name.toLowerCase(),
            native.description?.toLowerCase(),
            native.params.some(p =>
              p.name?.toLowerCase().includes(term) ||
              p.description?.toLowerCase().includes(term)
            ),
            native.resultsDescription?.toLowerCase()
          ].some(field => field?.includes(term));

          return matches;
        });
      }

      return true;
    });

    // Extract unique namespaces for the current game selection
    const namespaces = [...new Set(filteredNatives.map(native => native.ns))].sort();

    // Additional stats for better filtering UI
    const environmentStats = {
      client: filteredNatives.filter(n => n.environment === 'client').length,
      server: filteredNatives.filter(n => n.environment === 'server').length,
      shared: filteredNatives.filter(n => n.environment === 'shared').length,
      total: filteredNatives.length
    };

    const namespaceStats = namespaces.map(ns => ({
      namespace: ns,
      count: filteredNatives.filter(n => n.ns === ns).length,
      client: filteredNatives.filter(n => n.ns === ns && n.environment === 'client').length,
      server: filteredNatives.filter(n => n.ns === ns && n.environment === 'server').length,
      shared: filteredNatives.filter(n => n.ns === ns && n.environment === 'shared').length,
      isCfx: ns === 'CFX',
    }));

    // Sort by relevance if search was performed
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredNatives.sort((a, b) => {
        // Exact match in name gets highest priority
        const aNameMatch = a.name.toLowerCase() === searchLower ? 2 :
          a.name.toLowerCase().includes(searchLower) ? 1 : 0;
        const bNameMatch = b.name.toLowerCase() === searchLower ? 2 :
          b.name.toLowerCase().includes(searchLower) ? 1 : 0;

        if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;

        // Then check if description has exact search term
        const aDescMatch = a.description.toLowerCase().includes(searchLower) ? 1 : 0;
        const bDescMatch = b.description.toLowerCase().includes(searchLower) ? 1 : 0;

        return bDescMatch - aDescMatch;
      });
    }

    // Apply pagination
    const totalResults = filteredNatives.length;
    const paginatedNatives = filteredNatives.slice(offset, offset + limit);

    // Return response with enhanced metadata
    return NextResponse.json({
      data: paginatedNatives,
      metadata: {
        total: totalResults,
        limit,
        offset,
        hasMore: offset + limit < totalResults,
        namespaces,
        namespacesByGameAndEnv,
        hasCfxNamespace,
        games: ['gta5', 'rdr3'],
        environmentStats,
        namespaceStats,
        query: { // Return the query params for debugging
          game,
          environment: environment || 'all',
          ns,
          search,
          includeCfx
        }
      }
    });
  } catch (error) {
    console.error('Error in natives API route:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve natives data. Please try again later.' },
      { status: 500 }
    );
  }
}