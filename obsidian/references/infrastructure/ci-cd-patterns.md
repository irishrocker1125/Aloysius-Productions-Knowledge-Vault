---
title: "CI/CD Patterns"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - infrastructure
  - ci-cd
  - github-actions
  - automation
---

# CI/CD Patterns

GitHub Actions patterns for automated builds, tests, and deployments.

## Security-Gated Deployment

Block deployment if security checks fail:

```yaml
jobs:
  security-gate:
    name: Security Gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: TruffleHog Secret Scan
        uses: trufflesecurity/trufflehog@v3.88.0
        with:
          path: ./
          extra_args: --only-verified

      - name: Content Security Scan
        run: |
          # Custom pattern scanning
          if grep -rPn 'sk-[a-zA-Z0-9]{48}' content/; then
            echo "::error::API key detected"
            exit 1
          fi

  build:
    needs: security-gate # Must pass first
    runs-on: ubuntu-latest
    # ... build steps
```

## Reusable Workflow Pattern

Centralize common workflows:

```yaml
# .github/workflows/security-sentinel.yml (reusable)
name: Security Sentinel

on:
  workflow_call:
    inputs:
      scan_path:
        type: string
        default: "./"
      fail_on_finding:
        type: boolean
        default: false

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run scans
        run: |
          # TruffleHog, Trivy, Semgrep
        continue-on-error: ${{ !inputs.fail_on_finding }}
```

```yaml
# Project workflow calling the reusable one
jobs:
  security:
    uses: org/ops-core/.github/workflows/security-sentinel.yml@main
    with:
      scan_path: "./src"
      fail_on_finding: true
```

## Static Site Deployment

Pattern for GitHub Pages with Quartz/Jekyll:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history for git dates

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## iOS Testing Workflow

Test multiple Xcode schemes:

```yaml
name: iOS Tests

on:
  push:
    paths:
      - "**/*.swift"
      - "**/project.pbxproj"

jobs:
  test:
    runs-on: macos-latest
    strategy:
      matrix:
        scheme: [Poker, MadLibs, Quest-Forge]
    steps:
      - uses: actions/checkout@v4

      - name: Test ${{ matrix.scheme }}
        run: |
          xcodebuild test \
            -scheme "${{ matrix.scheme }}" \
            -destination "platform=iOS Simulator,name=iPhone 15" \
            -resultBundlePath "results/${{ matrix.scheme }}"
```

## Scheduled Dashboard Updates

Run workflows on schedule:

```yaml
name: Update Dashboards

on:
  schedule:
    - cron: "0 */6 * * *" # Every 6 hours
  workflow_dispatch: # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run aggregation
        run: python scripts/aggregate.py

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --staged --quiet || git commit -m "chore: update dashboards"
          git push
```

## Pre-Commit Integration

Use Husky for local hooks, CI for enforcement:

```yaml
# In CI - verify what pre-commit should have caught
- name: Lint check
  run: npm run lint

- name: Security scan
  run: npm run security:scan
```

## Best Practices

| Practice                   | Why                              |
| -------------------------- | -------------------------------- |
| Pin action versions        | Reproducible builds              |
| Use `fetch-depth: 0`       | Need full git history            |
| Separate build/deploy jobs | Can retry deploy without rebuild |
| Use environments           | Track deployment status          |
| Cache node_modules         | Faster builds                    |

## Related

- [[references/infrastructure/ops-core-patterns|Ops-Core Patterns]]
- [[references/infrastructure/gas-deep-dive|GAS Framework Deep Dive]]
