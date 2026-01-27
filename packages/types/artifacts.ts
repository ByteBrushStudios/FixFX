/**
 * Artifact API types
 */

export interface ArtifactDownloadUrls {
    zip: string;
    '7z': string;
}

export interface ArtifactDetails {
    version: string;
    recommended: boolean;
    critical: boolean;
    download_urls: ArtifactDownloadUrls;
    changelog_url: string;
    published_at: string;
    eol: boolean;
    supportStatus: 'recommended' | 'latest' | 'active' | 'deprecated' | 'eol' | 'unknown';
    supportEnds: string;
}

export type SupportStatus = 'recommended' | 'latest' | 'active' | 'deprecated' | 'eol' | 'unknown';

export interface ArtifactResponse {
    windows: Record<string, ArtifactDetails>;
    linux: Record<string, ArtifactDetails>;
}

export interface ArtifactStats {
    total: number;
    recommended: number;
    latest: number;
    active: number;
    deprecated: number;
    eol: number;
}

export interface ArtifactMetadata {
    platforms: string[];
    recommended: Record<string, ArtifactDetails & { version: string }>;
    latest: Record<string, ArtifactDetails & { version: string }>;
    stats: Record<string, ArtifactStats>;
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
    filters: {
        search?: string;
        platform?: string;
        supportStatus?: string;
        includeEol: boolean;
        beforeDate?: string;
        afterDate?: string;
        sortBy: string;
        sortOrder: string;
    };
    supportSchedule: {
        recommended: string;
        latest: string;
        eol: string;
    };
    supportStatusExplanation: {
        recommended: string;
        latest: string;
        active: string;
        deprecated: string;
        eol: string;
    };
}

export interface ArtifactsAPIResponse {
    data: ArtifactResponse;
    metadata: ArtifactMetadata;
}

/**
 * Query parameters for the artifacts API
 */
export interface ArtifactQueryParams {
    platform?: 'windows' | 'linux';
    product?: 'fivem' | 'redm';
    version?: string;
    search?: string;
    limit?: number;
    offset?: number;
    includeEol?: boolean;
    sortBy?: 'version' | 'date';
    sortOrder?: 'asc' | 'desc';
    status?: SupportStatus;
    before?: string;  // Date in ISO format
    after?: string;   // Date in ISO format
}

/**
 * Helper functions
 */
export const getSupportStatusColor = (status: SupportStatus): string => {
    switch (status) {
        case 'recommended':
            return '#34A853'; // Green
        case 'latest':
            return '#5865F2'; // Blue
        case 'active':
            return '#4285F4'; // Light blue
        case 'deprecated':
            return '#FBBC05'; // Yellow/Amber
        case 'eol':
            return '#EA4335'; // Red
        default:
            return '#9AA0A6'; // Grey
    }
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
