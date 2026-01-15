#!/usr/bin/env node
/**
 * Security scan script for Knowledge Vault content
 * Runs during pre-commit to catch sensitive data before it enters git history
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Patterns that should BLOCK commit
const BLOCKING_PATTERNS = [
  // API Keys
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48}/g },
  { name: 'Anthropic API Key', regex: /sk-ant-[a-zA-Z0-9-]{40,}/g },
  { name: 'GitHub PAT', regex: /ghp_[a-zA-Z0-9]{36}/g },
  { name: 'GitHub OAuth', regex: /gho_[a-zA-Z0-9]{36}/g },
  { name: 'GitHub Fine-Grained PAT', regex: /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g },
  { name: 'Slack Token', regex: /xox[baprs]-[a-zA-Z0-9-]+/g },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },

  // Credentials
  { name: 'Inline Password', regex: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{8,}["']/gi },
  { name: 'Inline Secret', regex: /(?:secret|api[_-]?key|token)\s*[:=]\s*["'][^"']{8,}["']/gi },

  // Private URLs
  { name: 'Private IP URL', regex: /https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/g },
  { name: 'Localhost URL', regex: /https?:\/\/localhost:\d+/g },

  // PII
  { name: 'SSN Pattern', regex: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g },
];

// Patterns to WARN but not block (for review)
const WARNING_PATTERNS = [
  { name: 'Email Address', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: 'Phone Number', regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g },
];

// Allowlist patterns (if line contains these, skip detection)
const ALLOWLIST_PATTERNS = [
  /YOUR[_-]?API[_-]?KEY/i,
  /EXAMPLE/i,
  /PLACEHOLDER/i,
  /your-.*-here/i,
  /xxx+/i,
  /<[A-Z_]+>/,  // Placeholder brackets like <API_KEY>
  /```/,        // Code block markers (examples)
  /sk-xxxxxxxx/i,
  /\*\*\*redacted\*\*\*/i,
];

// Load custom allowlist if exists
function loadAllowlist() {
  const allowlistPath = resolve(projectRoot, '.security-allowlist');
  if (existsSync(allowlistPath)) {
    const content = readFileSync(allowlistPath, 'utf-8');
    return content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  }
  return [];
}

function isAllowlisted(line, customAllowlist) {
  // Check built-in patterns
  for (const pattern of ALLOWLIST_PATTERNS) {
    if (pattern.test(line)) {
      return true;
    }
  }
  // Check custom allowlist
  for (const allowed of customAllowlist) {
    if (line.includes(allowed)) {
      return true;
    }
  }
  return false;
}

function scanFile(filePath, customAllowlist) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];
  const warnings = [];

  lines.forEach((line, index) => {
    if (isAllowlisted(line, customAllowlist)) {
      return; // Skip allowlisted lines
    }

    // Check blocking patterns
    for (const pattern of BLOCKING_PATTERNS) {
      // Reset regex lastIndex
      pattern.regex.lastIndex = 0;
      const matches = line.match(pattern.regex);
      if (matches) {
        issues.push({
          file: filePath,
          line: index + 1,
          pattern: pattern.name,
          match: matches[0].substring(0, 20) + (matches[0].length > 20 ? '...' : ''),
        });
      }
    }

    // Check warning patterns
    for (const pattern of WARNING_PATTERNS) {
      pattern.regex.lastIndex = 0;
      const matches = line.match(pattern.regex);
      if (matches) {
        warnings.push({
          file: filePath,
          line: index + 1,
          pattern: pattern.name,
          match: matches[0],
        });
      }
    }
  });

  return { issues, warnings };
}

// Main execution
const files = process.argv.slice(2);
if (files.length === 0) {
  console.log('No files to scan');
  process.exit(0);
}

const customAllowlist = loadAllowlist();
let hasErrors = false;
let allWarnings = [];

for (const file of files) {
  if (!existsSync(file)) {
    continue;
  }

  const { issues, warnings } = scanFile(file, customAllowlist);

  if (issues.length > 0) {
    hasErrors = true;
    console.error(`\n\x1b[31mSECURITY ISSUES in ${file}:\x1b[0m`);
    for (const issue of issues) {
      console.error(`  Line ${issue.line}: ${issue.pattern} - "${issue.match}"`);
    }
  }

  allWarnings.push(...warnings);
}

if (allWarnings.length > 0) {
  console.warn(`\n\x1b[33mSECURITY WARNINGS (review recommended):\x1b[0m`);
  for (const warning of allWarnings) {
    console.warn(`  ${warning.file}:${warning.line} - ${warning.pattern}: "${warning.match}"`);
  }
}

if (hasErrors) {
  console.error('\n\x1b[31mCommit blocked: Security issues detected.\x1b[0m');
  console.error('To add an allowlist exception, add the pattern to .security-allowlist');
  process.exit(1);
}

console.log('\n\x1b[32mSecurity scan passed.\x1b[0m');
process.exit(0);
