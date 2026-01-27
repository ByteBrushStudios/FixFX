export type Hook = Readonly<{
  id: number;
  title: string;
  description: string;
  content: string;
}>;

export type Card = {
  label: string;
  title: string;
  content?: string;
  code?: string;
  className?: string;
};

export interface GitHubTag {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  zipball_url: string;
  tarball_url: string;
  node_id: string;
}

export interface ArtifactDownloadUrls {
  zip: string;
  "7z": string;
}

export interface ArtifactEntry {
  version: string;
  recommended: boolean;
  critical: boolean;
  download_urls: ArtifactDownloadUrls;
  artifact_url: string;
  published_at: string;
  eol?: boolean;
  supportStatus?:
    | "recommended"
    | "latest"
    | "active"
    | "deprecated"
    | "eol"
    | "unknown";
  supportEnds?: string;
}

export interface ArtifactCategory {
  [version: string]: ArtifactEntry;
}

export interface ArtifactData {
  windows: ArtifactCategory;
  linux: ArtifactCategory;
}
