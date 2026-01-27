#!/usr/bin/env node

/**
 * Scraper for FiveM trusted hosting providers
 * Automatically fetches and validates hosting providers from FiveM's official registry
 * Used by GitHub Actions to keep the trusted-hosts.json file up to date
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FIVEM_HOSTING_URL = 'https://fivem.net/server-hosting';
const TRUSTED_HOSTS_FILE = path.join(__dirname, '..', '..', 'packages', 'providers', 'trusted-hosts.json');
const SCHEMA_FILE = path.join(__dirname, '..', '..', 'packages', 'providers', 'trusted-hosts-schema.json');

/**
 * Fetch the FiveM hosting page and extract provider information
 */
async function fetchFiveMListing() {
  return new Promise((resolve, reject) => {
    https.get(FIVEM_HOSTING_URL, { headers: { 'User-Agent': 'FixFX-TrustedHostsScraper/1.0' } }, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Parse hosting provider information from HTML
 * This extracts provider cards that follow a predictable structure
 */
function parseHostingProviders(html) {
  const providers = [];
  
  // Look for hosting provider cards - they typically have specific patterns
  // Pattern 1: Look for links with typical hosting provider domain patterns
  const linkRegex = /<a[^>]*href=["']([^"']*(?:zap-hosting|gtxgaming|nitrado|g-portal|firestorm|nitrado|gameservers|lgsm)[^"']*)["'][^>]*>([^<]+)<\/a>/gi;
  let match;
  
  const seen = new Set();
  
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const name = match[2].trim();
    
    // Skip duplicates and invalid entries
    if (!url || !name || seen.has(url.toLowerCase())) continue;
    
    seen.add(url.toLowerCase());
    
    // Normalize URL
    const normalizedUrl = new URL(url.includes('://') ? url : `https://${url}`).href;
    
    providers.push({
      id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: name,
      url: normalizedUrl,
      description: `Trusted FiveM/RedM hosting provider`,
      verified: true,
      lastVerified: new Date().toISOString()
    });
  }
  
  // Known hosting providers fallback (if scraping doesn't find them)
  const knownProviders = [
    { id: 'zap-hosting', name: 'ZAP-Hosting', url: 'https://zap-hosting.com' },
    { id: 'gtxgaming', name: 'GTXGaming', url: 'https://gtxgaming.co.uk' },
    { id: 'nitrado', name: 'Nitrado', url: 'https://nitrado.net' },
    { id: 'g-portal', name: 'G-Portal', url: 'https://www.g-portal.com' },
    { id: 'firestorm-servers', name: 'Firestorm Servers', url: 'https://firestormservers.com' },
    { id: 'gameservers', name: 'GameServers', url: 'https://www.gameservers.com' }
  ];
  
  // Add known providers if not already found
  for (const known of knownProviders) {
    if (!providers.find(p => p.id === known.id)) {
      providers.push({
        ...known,
        description: `Trusted FiveM/RedM hosting provider`,
        verified: false,
        lastVerified: new Date().toISOString()
      });
    }
  }
  
  return providers;
}

/**
 * Validate provider against schema
 */
function validateAgainstSchema(provider, schema) {
  const errors = [];
  
  // Check required fields
  if (!provider.id) errors.push('Missing required field: id');
  if (!provider.name) errors.push('Missing required field: name');
  if (!provider.url) errors.push('Missing required field: url');
  
  // Validate ID format
  if (provider.id && !/^[a-z0-9-]+$/.test(provider.id)) {
    errors.push(`Invalid id format: ${provider.id}`);
  }
  
  // Validate URL format
  if (provider.url) {
    try {
      new URL(provider.url);
    } catch {
      errors.push(`Invalid URL format: ${provider.url}`);
    }
  }
  
  // Validate string lengths
  if (provider.name && provider.name.length > 255) {
    errors.push(`Name exceeds maximum length: ${provider.name.length} > 255`);
  }
  
  if (provider.description && provider.description.length > 500) {
    errors.push(`Description exceeds maximum length`);
  }
  
  return errors;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🌐 Fetching FiveM trusted hosting providers...');
    const html = await fetchFiveMListing();
    
    console.log('📊 Parsing provider information...');
    const hosts = parseHostingProviders(html);
    
    if (hosts.length === 0) {
      console.warn('⚠️  No providers found. Using defaults.');
    } else {
      console.log(`✅ Found ${hosts.length} hosting providers`);
    }
    
    // Load schema for validation
    const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
    
    // Validate each provider
    const validationErrors = [];
    for (const host of hosts) {
      const errors = validateAgainstSchema(host, schema);
      if (errors.length > 0) {
        console.warn(`⚠️  Validation issues for ${host.name}:`, errors);
        validationErrors.push({ provider: host.name, errors });
      }
    }
    
    // Create output object
    const output = {
      lastUpdated: new Date().toISOString(),
      source: 'https://fivem.net/server-hosting',
      hosts: hosts.sort((a, b) => a.name.localeCompare(b.name))
    };
    
    // Write to file
    fs.writeFileSync(TRUSTED_HOSTS_FILE, JSON.stringify(output, null, 2));
    console.log(`📝 Updated ${TRUSTED_HOSTS_FILE}`);
    
    // Print summary
    console.log('\n📋 Summary:');
    console.log(`   Total providers: ${hosts.length}`);
    console.log(`   Verified: ${hosts.filter(h => h.verified).length}`);
    console.log(`   Unverified: ${hosts.filter(h => !h.verified).length}`);
    
    if (validationErrors.length > 0) {
      console.warn(`\n⚠️  Found ${validationErrors.length} validation warnings`);
      process.exit(0); // Don't fail on warnings
    }
    
    console.log('\n✅ Successfully updated trusted hosts list');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
