#!/usr/bin/env node

/**
 * Get the current version from GitHub releases
 *
 * This script fetches the latest release from the FixFX repository
 * and extracts the version from the tag name.
 *
 * Usage:
 *   node get-version.js                 # outputs to stdout
 *   node get-version.js --file <path>   # writes to file
 *   node get-version.js --json          # outputs as JSON object
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const REPO_OWNER = "CodeMeAPixel";
const REPO_NAME = "FixFX";
const DEFAULT_VERSION = "0.0.0-unknown";

async function fetchLatestRelease() {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

    const options = {
      hostname: "api.github.com",
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      method: "GET",
      headers: {
        "User-Agent": "FixFX-Version-Script",
        Accept: "application/vnd.github.v3+json",
      },
      timeout: 5000,
    };

    // Use GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      options.headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          if (res.statusCode === 404) {
            // No releases found
            resolve(null);
            return;
          }

          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API returned ${res.statusCode}: ${data}`));
            return;
          }

          const release = JSON.parse(data);
          resolve(release);
        } catch (error) {
          reject(
            new Error(`Failed to parse GitHub API response: ${error.message}`),
          );
        }
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("GitHub API request timed out"));
    });

    req.on("error", reject);
    req.end();
  });
}

function extractVersion(tagName) {
  // Remove leading 'v' if present (e.g., 'v1.0.0' → '1.0.0')
  let version = tagName.replace(/^v/, "");

  // Validate semver format (basic check)
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Invalid version format: ${tagName}`);
  }

  return version;
}

async function getVersion(options = {}) {
  try {
    const release = await fetchLatestRelease();

    if (!release) {
      console.warn(
        `No releases found for ${REPO_OWNER}/${REPO_NAME}, using default version`,
      );
      return DEFAULT_VERSION;
    }

    const version = extractVersion(release.tag_name);
    return version;
  } catch (error) {
    if (options.strict) {
      console.error(`Error fetching version: ${error.message}`);
      process.exit(1);
    } else {
      console.warn(
        `Error fetching version: ${error.message}, using default version`,
      );
      return DEFAULT_VERSION;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file") {
      options.file = args[i + 1];
      i++;
    } else if (args[i] === "--json") {
      options.json = true;
    } else if (args[i] === "--strict") {
      options.strict = true;
    }
  }

  const version = await getVersion(options);

  if (options.json) {
    console.log(
      JSON.stringify({ version, repo: `${REPO_OWNER}/${REPO_NAME}` }, null, 2),
    );
  } else if (options.file) {
    try {
      fs.writeFileSync(options.file, version, "utf-8");
      console.log(`Version written to ${options.file}: ${version}`);
    } catch (error) {
      console.error(`Failed to write version to file: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log(version);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
  });
}

module.exports = { fetchLatestRelease, extractVersion, getVersion };
