#!/usr/bin/env node

/**
 * Validator for trusted-hosts.json
 * Ensures the file conforms to the schema and contains valid data
 */

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const TRUSTED_HOSTS_FILE = path.join(
  __dirname,
  "..",
  "..",
  "packages",
  "providers",
  "trusted-hosts.json",
);
const SCHEMA_FILE = path.join(
  __dirname,
  "..",
  "..",
  "packages",
  "providers",
  "trusted-hosts-schema.json",
);

try {
  // Load files
  const trustedHosts = JSON.parse(fs.readFileSync(TRUSTED_HOSTS_FILE, "utf8"));
  let schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, "utf8"));

  // Remove $schema to avoid AJV trying to fetch it from the web
  delete schema.$schema;

  // Initialize AJV validator with format support
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);

  // Validate against schema
  const isValid = validate(trustedHosts);

  if (!isValid) {
    console.error("❌ Schema validation failed:\n");
    validate.errors.forEach((error) => {
      console.error(`  ${error.instancePath || "root"}: ${error.message}`);
    });
    process.exit(1);
  }

  // Additional validations
  const errors = [];
  const warnings = [];

  // Check for duplicate IDs
  const ids = new Set();
  for (const host of trustedHosts.hosts) {
    if (ids.has(host.id)) {
      errors.push(`Duplicate provider ID: ${host.id}`);
    }
    ids.add(host.id);
  }

  // Check for duplicate URLs
  const urls = new Set();
  for (const host of trustedHosts.hosts) {
    const normalizedUrl = new URL(host.url).href;
    if (urls.has(normalizedUrl)) {
      warnings.push(`Duplicate URL detected: ${host.url}`);
    }
    urls.add(normalizedUrl);
  }

  // Check lastUpdated is recent (within 30 days)
  const lastUpdated = new Date(trustedHosts.lastUpdated);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  if (lastUpdated < thirtyDaysAgo) {
    warnings.push(
      "List was last updated more than 30 days ago. Consider running the scraper.",
    );
  }

  // Report results
  if (errors.length > 0) {
    console.error("❌ Validation errors:\n");
    errors.forEach((error) => console.error(`  • ${error}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn("⚠️  Validation warnings:\n");
    warnings.forEach((warning) => console.warn(`  • ${warning}`));
  }

  console.log("✅ trusted-hosts.json validation passed");
  console.log(`   Total providers: ${trustedHosts.hosts.length}`);
  console.log(
    `   Last updated: ${new Date(trustedHosts.lastUpdated).toLocaleString()}`,
  );
  console.log(`   Source: ${trustedHosts.source}`);

  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
