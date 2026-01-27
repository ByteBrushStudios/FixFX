#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Load both versions
const currentPath = "tsconfig.json";
const basePath = "base-branch/tsconfig.json";

let currentConfig, baseConfig;

try {
  currentConfig = JSON.parse(fs.readFileSync(currentPath, "utf8"));
  baseConfig = JSON.parse(fs.readFileSync(basePath, "utf8"));
} catch (error) {
  console.error("Error parsing JSON files:", error.message);
  process.exit(1);
}

let hasErrors = false;
const errors = [];

// Check for removed keys in compilerOptions
if (currentConfig.compilerOptions && baseConfig.compilerOptions) {
  for (const key in baseConfig.compilerOptions) {
    if (!(key in currentConfig.compilerOptions)) {
      errors.push(`❌ Removed compiler option: "${key}"`);
      hasErrors = true;
    }
  }
}

// Check for modified values in compilerOptions
if (currentConfig.compilerOptions && baseConfig.compilerOptions) {
  for (const key in baseConfig.compilerOptions) {
    const baseValue = JSON.stringify(baseConfig.compilerOptions[key]);
    const currentValue = JSON.stringify(currentConfig.compilerOptions[key]);

    if (baseValue !== currentValue && key in currentConfig.compilerOptions) {
      errors.push(
        `❌ Modified compiler option "${key}": "${baseValue}" → "${currentValue}"`,
      );
      hasErrors = true;
    }
  }
}

// Check for removed keys in paths
if (currentConfig.compilerOptions?.paths && baseConfig.compilerOptions?.paths) {
  for (const key in baseConfig.compilerOptions.paths) {
    if (!(key in currentConfig.compilerOptions.paths)) {
      errors.push(`❌ Removed path alias: "${key}"`);
      hasErrors = true;
    }
  }
}

// Check for modified paths values
if (currentConfig.compilerOptions?.paths && baseConfig.compilerOptions?.paths) {
  for (const key in baseConfig.compilerOptions.paths) {
    const baseValue = JSON.stringify(baseConfig.compilerOptions.paths[key]);
    const currentValue = JSON.stringify(
      currentConfig.compilerOptions.paths[key],
    );

    if (
      baseValue !== currentValue &&
      key in currentConfig.compilerOptions.paths
    ) {
      errors.push(
        `❌ Modified path alias "${key}": ${baseValue} → ${currentValue}`,
      );
      hasErrors = true;
    }
  }
}

// Check for removed keys in include
if (currentConfig.include && baseConfig.include) {
  const baseIncludes = new Set(baseConfig.include);
  for (const item of baseIncludes) {
    if (!currentConfig.include.includes(item)) {
      errors.push(`❌ Removed include pattern: "${item}"`);
      hasErrors = true;
    }
  }
}

// Check for removed keys in exclude
if (currentConfig.exclude && baseConfig.exclude) {
  const baseExcludes = new Set(baseConfig.exclude);
  for (const item of baseExcludes) {
    if (!currentConfig.exclude.includes(item)) {
      errors.push(`❌ Removed exclude pattern: "${item}"`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.log("\n❌ tsconfig.json validation FAILED\n");
  console.log("Critical Configuration Protection:\n");
  errors.forEach((error) => console.log(error));
  console.log("\n⚠️  Only ADDITIONS to tsconfig.json are allowed.");
  console.log(
    "Removing or modifying existing configurations will break the site.\n",
  );
  process.exit(1);
} else {
  console.log("✅ tsconfig.json validation PASSED");
  console.log(
    "Only additions detected (or no changes to existing configuration).\n",
  );
  process.exit(0);
}
