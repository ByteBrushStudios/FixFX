import fs from "fs";
import path from "path";

export interface ProviderLink {
  label: string;
  url: string;
  description: string;
}

export interface ProviderDiscount {
  percentage: number;
  code: string;
  duration: string;
}

export interface HostingProvider {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description: string;
  discount: ProviderDiscount;
  links: ProviderLink[];
  features: string[];
  highlight?: string;
  priority?: number;
}

/**
 * Load all hosting providers from subdirectories in packages/providers
 * Each provider should be in a directory like: packages/providers/zap-hosting/provider.json
 * Files are sorted by priority (highest first), then alphabetically
 */
export async function getHostingProviders(): Promise<HostingProvider[]> {
  const providersDir = path.join(process.cwd(), "packages", "providers");
  
  // Check if directory exists
  if (!fs.existsSync(providersDir)) {
    console.warn("Providers directory not found:", providersDir);
    return [];
  }

  const entries = fs.readdirSync(providersDir, { withFileTypes: true });
  const providerDirs = entries.filter((entry) => entry.isDirectory());

  const providers: HostingProvider[] = [];

  for (const dir of providerDirs) {
    try {
      const providerJsonPath = path.join(providersDir, dir.name, "provider.json");
      
      // Skip if provider.json doesn't exist in this directory
      if (!fs.existsSync(providerJsonPath)) {
        continue;
      }

      const fileContent = fs.readFileSync(providerJsonPath, "utf-8");
      const provider: HostingProvider = JSON.parse(fileContent);
      
      // Validate required fields
      if (!provider.id || !provider.name || !provider.description) {
        console.warn(`Invalid provider in ${dir.name}: missing required fields`);
        continue;
      }

      providers.push(provider);
    } catch (error) {
      console.error(`Failed to load provider from ${dir.name}:`, error);
    }
  }

  // Sort by priority (highest first), then alphabetically by name
  providers.sort((a, b) => {
    const priorityA = a.priority ?? 0;
    const priorityB = b.priority ?? 0;
    
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }
    
    return a.name.localeCompare(b.name);
  });

  return providers;
}

  for (const file of jsonFiles) {
    try {
      const filePath = path.join(providersDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const provider = JSON.parse(content) as HostingProvider;
      
      // Basic validation
      if (provider.id && provider.name && provider.description && provider.discount && provider.links) {
        providers.push(provider);
      } else {
        console.warn(`Invalid provider file: ${file} - missing required fields`);
      }
    } catch (error) {
      console.error(`Error loading provider file ${file}:`, error);
    }
  }

  // Sort by priority (highest first), then by name
  return providers.sort((a, b) => {
    const priorityA = a.priority ?? 0;
    const priorityB = b.priority ?? 0;
    if (priorityB !== priorityA) {
      return priorityB - priorityA;
    }
    return a.name.localeCompare(b.name);
  });
}
