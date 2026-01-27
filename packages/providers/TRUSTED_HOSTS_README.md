# Trusted Hosting Providers

This directory contains a list of trusted hosting providers for FiveM and RedM servers, sourced from the official FiveM registry at [fivem.net/server-hosting](https://fivem.net/server-hosting).

## Files

- **`trusted-hosts.json`** - The main data file containing all verified hosting providers
- **`trusted-hosts-schema.json`** - JSON Schema for validating the data format
- **`.github/scripts/update-trusted-hosts.js`** - Automated scraper that fetches the latest list from FiveM
- **`.github/scripts/validate-trusted-hosts.js`** - Validation script that checks data integrity
- **`.github/workflows/update-trusted-hosts.yml`** - GitHub Actions workflow for automated updates

## How It Works

### Automatic Updates

The system automatically updates the trusted hosts list every Monday at 00:00 UTC via GitHub Actions. The workflow:

1. **Scrapes** the FiveM server hosting page to find current providers
2. **Validates** the scraped data against the JSON schema
3. **Creates a Pull Request** if changes are detected
4. **Sends to review** for manual approval before merging

### Manual Triggers

You can manually trigger the update workflow:

- Navigate to **Actions** → **Update Trusted Hosting Providers** → **Run workflow**

### Data Structure

Each trusted host entry contains:

```json
{
  "id": "zap-hosting",
  "name": "ZAP-Hosting",
  "url": "https://zap-hosting.com",
  "description": "Premium game server hosting with DDoS protection",
  "verified": true,
  "lastVerified": "2026-01-26T12:00:00Z"
}
```

- **id**: Unique identifier (lowercase, alphanumeric, hyphens only)
- **name**: Display name
- **url**: Provider's website
- **description**: Brief description
- **verified**: Whether currently active on FiveM registry
- **lastVerified**: When this provider was last confirmed

## Usage in Code

### Get all trusted hosts

```typescript
import { getTrustedHosts } from "@/lib/trusted-hosts";

const hosts = await getTrustedHosts();
// Returns sorted array: verified hosts first, then by name
```

### Get trusted host metadata

```typescript
import { getTrustedHostsMetadata } from "@/lib/trusted-hosts";

const metadata = await getTrustedHostsMetadata();
// Returns: { lastUpdated, source }
```

### Get a specific host

```typescript
import { getTrustedHostById } from "@/lib/trusted-hosts";

const zapHosting = await getTrustedHostById("zap-hosting");
```

### Check if a provider is trusted

```typescript
import { isTrustedProvider } from "@/lib/trusted-hosts";

const isTrusted = await isTrustedProvider("https://zap-hosting.com");
```

## Validation

The data is validated using JSON Schema (Draft 7) to ensure:

- ✅ All required fields are present
- ✅ IDs follow naming conventions (lowercase, alphanumeric, hyphens)
- ✅ URLs are valid and parseable
- ✅ No duplicate IDs or URLs
- ✅ Field lengths are within limits
- ✅ Timestamps are valid ISO 8601 format

## Adding Providers Manually

If a provider appears on [fivem.net/server-hosting](https://fivem.net/server-hosting) but isn't automatically detected:

1. Add the entry to `trusted-hosts.json` following the schema
2. Run the validation: `node .github/scripts/validate-trusted-hosts.js`
3. Submit a PR with your changes
4. The GitHub Action will verify the changes automatically

## Removing Providers

When a provider is removed from the FiveM registry:

1. The scraper will set `verified: false`
2. Consider removing the entry entirely if it hasn't been verified in 90+ days
3. Changes trigger PR creation for review

## Troubleshooting

### Scraper not finding providers

The scraper uses multiple strategies:

1. HTML parsing to find provider links
2. Fallback to known provider list
3. Validation against provider websites

If a provider is missing:

- Check if it still exists on [fivem.net/server-hosting](https://fivem.net/server-hosting)
- Run the update workflow manually
- Manually add the provider to `trusted-hosts.json`

### Validation errors

Run the validator to check for issues:

```bash
node .github/scripts/validate-trusted-hosts.js
```

Common issues:

- Duplicate IDs (each provider must have unique ID)
- Invalid URL format (must be valid http/https URL)
- ID format (must match `/^[a-z0-9-]+$/`)

## Future Enhancements

Planned improvements:

- [ ] Provider rating/review system
- [ ] Regional availability tracking
- [ ] Feature matrix (DDoS protection, auto-backup, etc.)
- [ ] Performance metrics
- [ ] Community feedback integration
