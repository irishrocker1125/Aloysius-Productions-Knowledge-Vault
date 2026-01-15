---
title: "Ops-Core Patterns"
created: 2026-01-15
updated: 2026-01-15
type: reference
tags:
  - infrastructure
  - ops-core
  - patterns
  - reliability
source: "aloysiusproductions-ops-core/.management/knowledge.md"
---

# Ops-Core Patterns

Infrastructure patterns from the ops-core governance system.

## Data Preservation Pattern

**Problem**: Scripts that aggregate data from multiple sources fail when some sources are unavailable, corrupting the final output.

**Solution**: Preserve last-known-good values when accurate calculation is impossible.

```python
def get_metrics(sources):
    """Calculate metrics, preserving previous values when sources unavailable."""

    # Check if we can calculate accurately
    available_sources = [s for s in sources if s.is_available()]

    if len(available_sources) < len(sources):
        # Cannot calculate accurately - preserve previous values
        previous = get_previous_totals()
        return {
            **previous,
            'stale': True,
            'stale_reason': f'Missing {len(sources) - len(available_sources)} sources'
        }

    # All sources available - calculate fresh
    return calculate_from_sources(available_sources)
```

**Key Points:**
- Check if data sources are COMPLETE before calculating
- Preserve previous values when accurate calculation is impossible
- Never overwrite known-good data with known-incomplete data
- Add visual indicator (†) when showing preserved/stale data

## Environment-Aware Scripts

**Problem**: Scripts with hardcoded local paths break in CI environments.

**Solution**: Detect execution context and degrade gracefully.

```python
def is_local_workspace_available():
    """Check if running in local environment with full workspace."""
    workspace_path = os.environ.get('WORKSPACE_PATH', '/Users/gordie/cc')
    return os.path.isdir(workspace_path)

def sync_dashboards():
    """Sync dashboards, skipping local-only operations in CI."""

    if is_local_workspace_available():
        # Full local sync
        for project in get_local_projects():
            sync_project(project)
    else:
        # CI mode - use cached data
        logger.info("Running in CI mode - using cached data")
        return load_cached_dashboard()
```

**Key Points:**
- Use environment variables or detection for context
- Check if directories exist before iterating
- Design scripts to work in both local and CI contexts
- Graceful degradation must maintain data integrity

## Threshold-Based Alerting

**Problem**: Resource limits (API quotas, disk space, etc.) need proactive monitoring before hitting limits.

**Solution**: Use percentage-based thresholds with escalating alerts.

```python
THRESHOLDS = {
    'warning': 0.50,   # 50% - yellow warning
    'critical': 0.80,  # 80% - red alert, create issue
}

def check_quota(current, limit, resource_name):
    """Check quota and return status with appropriate alert level."""

    usage_pct = current / limit

    if usage_pct >= THRESHOLDS['critical']:
        status = 'critical'
        emoji = '🔴'
        # Create Linear issue for critical alerts
        create_issue(f"CRITICAL: {resource_name} at {usage_pct:.0%}")
    elif usage_pct >= THRESHOLDS['warning']:
        status = 'warning'
        emoji = '🟡'
    else:
        status = 'ok'
        emoji = '🟢'

    return {
        'resource': resource_name,
        'usage': usage_pct,
        'status': status,
        'emoji': emoji
    }
```

**Key Points:**
- 50% warning gives time to react
- 80% critical triggers automated issue creation
- Emoji indicators for quick visual scanning
- Works for any quota/limit monitoring

## GitHub Rate Limit Awareness

**Lesson**: GitHub has 13+ separate rate limit categories, each with independent limits.

| Resource | Limit | Notes |
|----------|-------|-------|
| REST API (core) | 5000/hr | Most common |
| GraphQL | 5000/hr | Points-based |
| Search API | 30/min | Very limited |
| Code Search | 10/min | Extremely limited |

**Solution**: Track all resource limits, not just core:

```python
def get_all_rate_limits():
    """Get comprehensive rate limit status from GitHub."""

    response = github_api.get('/rate_limit')

    limits = {}
    for resource, data in response['resources'].items():
        limits[resource] = {
            'limit': data['limit'],
            'remaining': data['remaining'],
            'reset': data['reset'],
            'usage_pct': 1 - (data['remaining'] / data['limit'])
        }

    return limits
```

## Incident Learning

From the 2026-01-12 dashboard metrics corruption incident:

| What Happened | Root Cause | Prevention |
|--------------|------------|------------|
| Dashboard showed 11k LOC instead of 147k | Script ran in CI without local projects | Data preservation pattern |
| All planning metrics showed 0 | Incomplete source calculation | Environment detection |

## Related

- [[references/infrastructure/ci-cd-patterns|CI/CD Patterns]]
- [[references/infrastructure/gas-deep-dive|GAS Framework Deep Dive]]
