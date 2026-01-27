#!/usr/bin/env node

/**
 * Analyze commits since the last release
 *
 * Determines the next version based on commit messages using
 * conventional commits format (feat:, fix:, breaking:)
 *
 * Usage:
 *   node analyze-commits.js
 *   node analyze-commits.js --json
 */

const { execSync } = require("child_process");

const REPO_OWNER = "CodeMeAPixel";
const REPO_NAME = "FixFX";

function exec(command) {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function getLastTag() {
  try {
    return exec('git describe --tags --abbrev=0 2>/dev/null || echo ""');
  } catch {
    return "";
  }
}

function getCommitsSinceTag(tag) {
  try {
    if (!tag) {
      // No tags yet, get all commits
      return exec("git log --oneline --all");
    }
    return exec(`git log ${tag}..HEAD --oneline`);
  } catch (error) {
    return "";
  }
}

function parseVersion(versionString) {
  // Remove 'v' prefix if present
  const version = versionString.replace(/^v/, "");
  const parts = version.split(".");

  return {
    major: parseInt(parts[0]) || 0,
    minor: parseInt(parts[1]) || 0,
    patch: parseInt(parts[2]) || 0,
    prerelease: parts[3] ? parts.slice(3).join(".") : null,
  };
}

function parseCommits(commitLog) {
  const commits = commitLog.split("\n").filter(Boolean);

  const analysis = {
    features: [],
    fixes: [],
    breaking: [],
    other: [],
  };

  for (const commit of commits) {
    const match = commit.match(
      /^([a-f0-9]+)\s+(.+?):\s*(.+?)(?:\s*\((.+?)\))?$/,
    );

    if (!match) {
      analysis.other.push(commit);
      continue;
    }

    const [, hash, type, message, scope] = match;
    const commitData = {
      hash: hash.substring(0, 7),
      type,
      message: message.trim(),
      scope: scope || null,
      full: commit,
    };

    if (type === "feat") {
      analysis.features.push(commitData);
    } else if (type === "fix") {
      analysis.fixes.push(commitData);
    } else if (type === "breaking" || message.includes("BREAKING CHANGE")) {
      analysis.breaking.push(commitData);
    } else {
      analysis.other.push(commitData);
    }
  }

  return analysis;
}

function calculateNextVersion(currentVersion, analysis) {
  const current = parseVersion(currentVersion || "0.0.0");

  // Breaking changes = major version bump
  if (analysis.breaking.length > 0) {
    return {
      major: current.major + 1,
      minor: 0,
      patch: 0,
    };
  }

  // Features = minor version bump
  if (analysis.features.length > 0) {
    return {
      major: current.major,
      minor: current.minor + 1,
      patch: 0,
    };
  }

  // Fixes only = patch version bump
  if (analysis.fixes.length > 0) {
    return {
      major: current.major,
      minor: current.minor,
      patch: current.patch + 1,
    };
  }

  // No relevant commits
  return null;
}

function formatVersion(versionObj) {
  if (!versionObj) return null;
  return `${versionObj.major}.${versionObj.minor}.${versionObj.patch}`;
}

function generateChangelogEntry(version, analysis) {
  const date = new Date().toISOString().split("T")[0];
  let entry = `## [${version}] - ${date}\n\n`;

  if (analysis.breaking.length > 0) {
    entry += `### Breaking Changes\n`;
    for (const commit of analysis.breaking) {
      entry += `- ${commit.message}${commit.scope ? ` (${commit.scope})` : ""} (${commit.hash})\n`;
    }
    entry += "\n";
  }

  if (analysis.features.length > 0) {
    entry += `### Added\n`;
    for (const commit of analysis.features) {
      entry += `- ${commit.message}${commit.scope ? ` (${commit.scope})` : ""} (${commit.hash})\n`;
    }
    entry += "\n";
  }

  if (analysis.fixes.length > 0) {
    entry += `### Fixed\n`;
    for (const commit of analysis.fixes) {
      entry += `- ${commit.message}${commit.scope ? ` (${commit.scope})` : ""} (${commit.hash})\n`;
    }
    entry += "\n";
  }

  if (analysis.other.length > 0) {
    entry += `### Other Changes\n`;
    for (const commit of analysis.other) {
      entry += `- ${commit}\n`;
    }
    entry += "\n";
  }

  return entry;
}

async function analyzeCommits() {
  try {
    // Get the last tag
    const lastTag = getLastTag();
    const currentVersion = lastTag ? lastTag.replace(/^v/, "") : "0.0.0";

    // Get commits since last tag
    const commitLog = getCommitsSinceTag(lastTag);

    if (!commitLog) {
      return {
        hasPendingChanges: false,
        currentVersion,
        nextVersion: null,
        analysis: null,
        changelog: null,
      };
    }

    // Parse commits
    const analysis = parseCommits(commitLog);

    // Calculate next version
    const nextVersion = calculateNextVersion(currentVersion, analysis);

    if (!nextVersion) {
      return {
        hasPendingChanges: false,
        currentVersion,
        nextVersion: null,
        analysis,
        changelog: null,
      };
    }

    const nextVersionString = formatVersion(nextVersion);
    const changelog = generateChangelogEntry(nextVersionString, analysis);

    return {
      hasPendingChanges: true,
      currentVersion,
      nextVersion: nextVersionString,
      analysis,
      changelog,
      tag: `v${nextVersionString}`,
    };
  } catch (error) {
    console.error(`Error analyzing commits: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const useJson = args.includes("--json");

  const result = await analyzeCommits();

  if (useJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Current Version: ${result.currentVersion}`);
    if (result.nextVersion) {
      console.log(`Next Version: ${result.nextVersion}`);
      console.log(`Tag: ${result.tag}`);
      console.log(`\nPending Changes:`);
      console.log(`  - Features: ${result.analysis.features.length}`);
      console.log(`  - Fixes: ${result.analysis.fixes.length}`);
      console.log(`  - Breaking: ${result.analysis.breaking.length}`);
      console.log(`  - Other: ${result.analysis.other.length}`);
    } else {
      console.log("No pending changes that require a release");
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
  });
}

module.exports = {
  analyzeCommits,
  parseCommits,
  calculateNextVersion,
  generateChangelogEntry,
};
