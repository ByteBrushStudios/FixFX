# Versioning Guide

FixFX uses GitHub releases as the single source of truth for version numbers. This approach eliminates version duplication between `package.json` and `CHANGELOG.md`.

## How It Works

1. **GitHub Releases** are authoritative - version lives in release tags (e.g., `v1.0.0`)
2. **CHANGELOG.md** documents changes for each version
3. **Script** (`get-version.js`) fetches the latest release from GitHub API
4. **package.json** does NOT have a hardcoded version field

## Getting the Current Version

### From Command Line

```bash
# Get version as plain text
npm run version

# Get version as JSON
npm run version:json

# Direct script usage
node .github/scripts/get-version.js
```

### In JavaScript/TypeScript Code

```typescript
// Async import and use
import { getVersion } from '../.github/scripts/get-version.js';

const version = await getVersion();
console.log(`FixFX v${version}`);
```

### In Build Process

Add to your build script:

```bash
node .github/scripts/get-version.js --file public/version.txt
```

## Creating a New Release

When releasing a new version:

1. **Update CHANGELOG.md** with the version changes
2. **Create a GitHub Release** with tag `v1.0.0` (format: `vMAJOR.MINOR.PATCH`)
3. **Script automatically discovers** the version
4. **No need to update package.json**

### Example Release Process

```bash
# 1. Update CHANGELOG.md sections
# Change "## [1.1.0] - Unreleased" to "## [1.1.0] - 2026-01-26"

# 2. Commit changes
git add CHANGELOG.md
git commit -m "chore: release v1.1.0"
git push

# 3. Create release on GitHub
# Go to https://github.com/CodeMeAPixel/FixFX/releases/new
# Tag: v1.1.0
# Title: Release v1.1.0
# Copy content from CHANGELOG for this version
# Click "Publish release"

# 4. The version is now discoverable by the script!
npm run version  # outputs: 1.1.0
```

## Tag Naming Convention

- **Must start with `v`**: `v1.0.0` ✅ (not `1.0.0`)
- **Must follow Semantic Versioning**: `vMAJOR.MINOR.PATCH`
- **Optional prerelease**: `v1.0.0-beta.0`, `v1.0.0-rc.1`
- **Invalid**: `v1.0`, `1.0.0`, `version-1.0.0`

## Fallback Behavior

If no releases exist yet:
- Script returns `0.0.0-unknown`
- Useful during initial development
- Once you create first release, it auto-discovers

### For Strict Mode (CI/CD)

```bash
node .github/scripts/get-version.js --strict
# Exits with code 1 if fetch fails
```

## GitHub API Rate Limits

The script respects GitHub's API rate limits:

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour (if `GITHUB_TOKEN` env var set)

For CI/CD, set the token:

```bash
GITHUB_TOKEN=your_token npm run version
```

## When to Use This Approach

✅ **Good for:**
- Open source projects with public releases
- Teams that release regularly
- Reducing merge conflicts on version changes
- Keeping version in one place (GitHub)

❌ **Not ideal for:**
- Private packages without public releases
- High-frequency build systems (performance sensitive)
- Offline-first development (no API access)

## Troubleshooting

### "No releases found"

You haven't created any releases yet. Create the first one:

```bash
# On GitHub: Releases → Draft a new release
# Tag: v1.0.0
# Publish
```

### "GitHub API request timed out"

Network issue or GitHub API is slow. Try again or set `GITHUB_TOKEN` for priority.

### "Invalid version format"

Release tag doesn't match expected format. Use `vMAJOR.MINOR.PATCH` format.

## Alternative: Reading from File

If you prefer storing version in a file instead:

```json
// version.json
{
  "version": "1.0.0"
}
```

But GitHub releases approach is cleaner since releases are already required for distribution.
