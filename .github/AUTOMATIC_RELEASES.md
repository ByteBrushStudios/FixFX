# Automatic Release System

FixFX uses automated versioning and changelog generation based on commit messages. When you push to `develop` or `master`, the system automatically:

1. **Analyzes commits** since the last release
2. **Determines the next version** (semantic versioning)
3. **Updates CHANGELOG.md**
4. **Creates a GitHub release** with auto-generated notes

No manual intervention needed!

## Commit Message Format (Conventional Commits)

The automation works by analyzing commit messages in this format:

```
type: description

type(scope): description

type!: description (with breaking change)
```

### Types

- **`feat`** - New feature → Minor version bump (1.0.0 → 1.1.0)
- **`fix`** - Bug fix → Patch version bump (1.0.0 → 1.0.1)
- **`breaking`** or **`feat!`** - Breaking change → Major version bump (1.0.0 → 2.0.0)
- **`chore`** - Build, deps, config changes (NOT included in release)
- **`docs`** - Documentation only (NOT included in release)
- **`test`** - Test changes (NOT included in release)

### Examples

```bash
# Feature
git commit -m "feat: add hosting provider directory structure"

# Fix
git commit -m "fix: correct provider validation schema reference"

# With scope
git commit -m "feat(providers): add guidelines documentation"

# Breaking change (using !)
git commit -m "feat!: reorganize provider file structure"

# Breaking change (using breaking keyword)
git commit -m "breaking: remove deprecated API endpoints"

# Chore (won't trigger release)
git commit -m "chore: update dependencies"
git commit -m "docs: improve README"
```

## Workflow Triggers

### ✅ Runs Automatically On

- **Direct pushes to `develop` branch** - Analyzes commits, updates changelog, creates release
- **Direct pushes to `master` branch** - Same as develop
- **Merges to `develop`/`master`** - Same as direct pushes
- **Changes to frontend files** - Only triggers when frontend code changes

### ❌ Does NOT Run On

- **Pull requests** - Prevents duplicate automation when merging
- **Non-frontend changes** - Ignores changes to backend, docs, etc.
- **Manual `chore:`, `docs:`, `test:` commits** - No version bump needed

## What Gets Released

The system looks at commits since the **last GitHub release tag** and:

- Counts **breaking changes** → Major version bump
- Counts **features** → Minor version bump  
- Counts **fixes** → Patch version bump
- Ignores **chore/docs/test** commits

### Examples

```
Last Release: v1.0.0

Commits since:
  ✅ feat: add new feature
  ✅ fix: fix a bug

Next Release: v1.1.0 (minor bump for feature)
```

```
Last Release: v1.0.0

Commits since:
  ✅ breaking: remove old API
  ✅ feat: add new feature
  ✅ fix: fix a bug

Next Release: v2.0.0 (major bump for breaking change)
```

## Automatic Changelog Generation

The changelog is automatically generated from your commit messages:

```markdown
## [1.1.0] - 2026-01-26

### Breaking Changes
- Remove deprecated authentication method

### Added
- Add hosting provider directory structure
- Add provider guidelines documentation

### Fixed
- Correct schema validation reference
```

This appears in:
1. **CHANGELOG.md** - Updated automatically
2. **GitHub Release Notes** - Added automatically

## Disabling Auto-Release

If you need to prevent a release for a particular push:

```bash
# Use [skip-release] in commit message
git commit -m "feat: add feature [skip-release]"

# Or use non-conventional commit format (will be listed as "Other Changes")
git commit -m "Update something random"
```

Note: Non-feature/fix/breaking commits are grouped as "Other Changes" and don't trigger version bumps.

## Manual Releases

For complete control, you can still create releases manually:

1. Push your commits with conventional messages
2. Manually create a release on GitHub with tag `v1.2.3`
3. The system will recognize it as the latest version
4. Next auto-release will calculate from this version

## Troubleshooting

### "No pending changes that require a release"

Your commits don't include `feat:`, `fix:`, or `breaking:` prefixes.

**Solution:** Use proper conventional commit format

```bash
# Wrong
git commit -m "added new provider support"

# Right
git commit -m "feat: add new provider support"
```

### Release created but CHANGELOG not updated

The CHANGELOG update happens in the workflow. Check:
1. Workflow logs in GitHub Actions
2. That commits use conventional format
3. That at least one `feat:`, `fix:`, or `breaking:` commit exists

### Version not incrementing correctly

Check the last release tag:

```bash
git tag  # List all tags
git describe --tags --abbrev=0  # Show latest tag
```

Make sure the tag follows `vMAJOR.MINOR.PATCH` format.

## Commit Message Guidelines

For the best auto-generated changelogs:

### Good commit messages
```
feat: add provider guidelines documentation
feat(providers): reorganize directory structure
fix: resolve schema validation issue
breaking: remove deprecated API endpoints
```

### Bad commit messages
```
update stuff
fixed things
WIP: feature
various improvements
```

The commit message after the type/scope is included in the changelog, so keep them clear and descriptive!

## GitHub Actions Secrets

No additional secrets needed! The workflow uses the default `GITHUB_TOKEN` which has permission to:
- Read commits and tags
- Create releases
- Push changes back to the repository

## Next Steps

1. **Start using conventional commits** in your workflow
2. **Push to develop/master** when ready to release
3. **Let the automation handle** changelog and release creation
4. **Monitor GitHub Actions** to verify successful releases

That's it! No more manual version tracking.
