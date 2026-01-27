import { promises as fs } from 'fs';
import { join } from 'path';

export interface TrustedHost {
  id: string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  verified: boolean;
  lastVerified: string;
}

export interface TrustedHostsData {
  lastUpdated: string;
  source: string;
  hosts: TrustedHost[];
}

/**
 * Load trusted hosting providers from JSON file
 * These are providers officially listed on fivem.net/server-hosting
 */
export async function getTrustedHosts(): Promise<TrustedHost[]> {
  try {
    const filePath = join(process.cwd(), 'packages', 'providers', 'trusted-hosts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed: TrustedHostsData = JSON.parse(data);
    
    // Sort by name, verified first
    return parsed.hosts.sort((a, b) => {
      if (a.verified !== b.verified) {
        return b.verified ? 1 : -1; // Verified hosts first
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Failed to load trusted hosts:', error);
    return [];
  }
}

/**
 * Get metadata about the trusted hosts list
 */
export async function getTrustedHostsMetadata(): Promise<Omit<TrustedHostsData, 'hosts'> | null> {
  try {
    const filePath = join(process.cwd(), 'packages', 'providers', 'trusted-hosts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed: TrustedHostsData = JSON.parse(data);
    
    return {
      lastUpdated: parsed.lastUpdated,
      source: parsed.source,
    };
  } catch (error) {
    console.error('Failed to load trusted hosts metadata:', error);
    return null;
  }
}

/**
 * Get a specific trusted host by ID
 */
export async function getTrustedHostById(id: string): Promise<TrustedHost | null> {
  const hosts = await getTrustedHosts();
  return hosts.find(host => host.id === id) || null;
}

/**
 * Check if a provider URL is from a trusted hosting provider
 */
export async function isTrustedProvider(url: string): Promise<boolean> {
  const hosts = await getTrustedHosts();
  try {
    const inputUrl = new URL(url).hostname.toLowerCase();
    return hosts.some(host => {
      const hostUrl = new URL(host.url).hostname.toLowerCase();
      return inputUrl === hostUrl || inputUrl.includes(hostUrl);
    });
  } catch {
    return false;
  }
}
