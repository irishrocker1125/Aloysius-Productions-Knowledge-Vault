# Security Guidelines

This knowledge base is publicly deployed to GitHub Pages. Follow these guidelines to prevent sensitive data exposure.

## What NOT to Include

### Never Commit These

| Category                        | Examples                               | Why                             |
| ------------------------------- | -------------------------------------- | ------------------------------- |
| **API Keys**                    | `sk-abc123...`, `ghp_token`, `AKIA...` | Attackers scan public repos     |
| **Passwords**                   | `password: "mypassword"`               | Credential exposure             |
| **Private URLs**                | `https://192.168.1.1/api`              | Reveals internal infrastructure |
| **PII**                         | SSNs, full names with emails           | Privacy violations              |
| **Internal Hostnames**          | `internal.company.local`               | Information disclosure          |
| **Database Connection Strings** | `mongodb://user:pass@host/db`          | Direct database access          |

### Acceptable Patterns

These patterns are allowlisted and safe to use in documentation:

```
# Placeholders (safe)
API_KEY=your-api-key-here
API_KEY=<YOUR_API_KEY>
API_KEY=XXXXXXXXXXXXXXXX

# Example domains (safe)
https://example.com/api
https://api.example.org

# Redacted values (safe)
password: "***redacted***"
token: sk-xxxxxxxxxx
```

## Pre-Commit Checks

This repository uses pre-commit hooks to catch sensitive data before it enters git history.

### Setup

```bash
npm install
# Husky hooks are installed automatically via "prepare" script
```

### What Gets Scanned

- All `.md` files in `obsidian/` directory
- Scans for API keys, credentials, PII, private URLs

### If Your Commit is Blocked

1. **Review the error message** - It shows the file, line, and pattern detected
2. **Remove or redact** the sensitive content
3. **Add to allowlist** if it's a false positive:
   - Add the specific pattern to `.security-allowlist`
   - Or use placeholder syntax: `<YOUR_API_KEY>` instead of actual key

### Bypassing Hooks (Emergency Only)

```bash
git commit --no-verify -m "message"
```

**Warning**: This skips security checks. The CI will still block deployment if secrets are detected.

## CI Security Gate

The deploy workflow includes a security gate that:

1. Runs TruffleHog for verified secret detection
2. Runs custom content pattern scanning
3. **Blocks deployment** if any security issues are found

This is the last line of defense - pre-commit hooks are the first.

## Reporting Security Issues

If you discover sensitive data in the repository:

1. Do NOT create a public issue
2. Contact the repository owner directly
3. The data will need to be removed from git history (force push)

## Related

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)
