# 📚 Knowledge Vault: Organizational Memory

> *"The bridge between thinking and sharing"*

This repository is the **Memory Layer** for Aloysius Productions. It captures knowledge from daily work (via Obsidian) and transforms it into shareable content (via WordPress).

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        KNOWLEDGE FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   📝 CAPTURE          →    🔄 REFINE         →    🌐 PUBLISH    │
│   (Obsidian)               (Review)               (WordPress)   │
│                                                                 │
│   ┌─────────────┐     ┌─────────────┐      ┌─────────────┐     │
│   │ Daily Notes │     │ Draft Posts │      │ Live Blog   │     │
│   │ Project Docs│ ──► │ Edit/Polish │ ──►  │ Archive     │     │
│   │ Research    │     │ SEO Review  │      │ Analytics   │     │
│   └─────────────┘     └─────────────┘      └─────────────┘     │
│                                                                 │
│   /obsidian/          /blog/drafts/        /blog/published/    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
knowledge-vault/
├── README.md                    # You are here
├── .gitignore
│
├── obsidian/                    # Your Obsidian vault
│   ├── daily/                   # Daily notes (YYYY-MM-DD.md)
│   ├── projects/                # Project-specific documentation
│   ├── references/              # Research, bookmarks, resources
│   ├── ideas/                   # Raw ideas, shower thoughts
│   └── templates/               # Obsidian note templates
│
├── blog/                        # WordPress publishing pipeline
│   ├── drafts/                  # Work in progress
│   ├── review/                  # Ready for final review
│   ├── published/               # Archive of published posts
│   └── content-calendar.json    # Tracking and planning
│
├── scripts/
│   └── publish_to_wordpress.py  # WordPress API integration
│
└── .github/
    └── workflows/
        └── wordpress-sync.yml   # Auto-sync on push (optional)
```

## Workflows

### Daily Capture (Obsidian)

1. Open Obsidian pointed at `/obsidian/` folder
2. Use daily note template for quick capture
3. Link related notes using `[[wiki-links]]`
4. Tag content: `#blog-idea`, `#reference`, `#project/name`

### Content Pipeline (Obsidian → WordPress)

```
1. IDEATION
   └─► Tag a note with #blog-idea in Obsidian

2. DRAFT
   └─► Move/copy to /blog/drafts/
   └─► Add frontmatter (title, slug, tags, status)

3. REVIEW
   └─► Move to /blog/review/
   └─► Final polish, SEO check, image optimization

4. PUBLISH
   └─► Run publish script (or manual upload)
   └─► Move to /blog/published/ with publish date

5. TRACK
   └─► Update content-calendar.json
```

### Content Calendar

The `content-calendar.json` tracks all blog content:

```json
{
  "posts": [
    {
      "slug": "building-a-gtd-system",
      "title": "Building a GTD System with AI",
      "status": "draft|review|published",
      "created": "2026-01-11",
      "published": null,
      "wordpress_id": null,
      "tags": ["productivity", "ai", "gtd"],
      "seo_keywords": ["gtd system", "ai productivity"]
    }
  ]
}
```

## Obsidian Setup

### Recommended Plugins

- **Obsidian Git** — Sync vault to this repo
- **Templater** — Advanced templates
- **Dataview** — Query your notes
- **Calendar** — Daily note navigation

### Vault Configuration

1. Open Obsidian
2. "Open folder as vault" → select `/knowledge-vault/obsidian/`
3. Install recommended plugins
4. Configure daily notes to save in `/daily/`

### Git Sync Options

**Option A: Obsidian Git Plugin (Recommended)**
- Auto-commit every X minutes
- Push/pull on open/close

**Option B: Manual Git**
- Commit when you want to preserve state
- More control, more friction

## WordPress Integration

### Setup (One-time)

1. Generate WordPress Application Password:
   - WordPress Admin → Users → Your Profile
   - Scroll to "Application Passwords"
   - Create new password, copy it

2. Add secrets to GitHub:
   - `WORDPRESS_URL`: Your site URL
   - `WORDPRESS_USER`: Your username
   - `WORDPRESS_APP_PASSWORD`: The generated password

### Publishing Flow

**Manual (Current):**
```bash
python scripts/publish_to_wordpress.py blog/review/my-post.md
```

**Automated (Future):**
- Push to `blog/review/` triggers workflow
- Workflow creates draft in WordPress
- You review and publish in WordPress admin

## Frontmatter Schema

All blog posts should include this frontmatter:

```yaml
---
title: "Your Post Title"
slug: "url-friendly-slug"
status: draft | review | published
created: 2026-01-11
modified: 2026-01-11
published: null  # Set when published
tags:
  - tag1
  - tag2
categories:
  - category1
seo:
  description: "Meta description for search engines"
  keywords:
    - keyword1
    - keyword2
featured_image: null  # Path or URL
wordpress_id: null  # Set after first sync
---
```

## Linking to Other Systems

### From Obsidian to Linear

When a note becomes actionable:
1. Create Linear issue from the note content
2. Add Linear issue link to the note
3. Tag note with `#has-linear-issue`

### From Obsidian to ops-core

When documenting a process:
1. Polish the note
2. Copy to `ops-core/runbooks/` if it's a procedure
3. Link back from both locations

## Maintenance

| Task | Frequency | Notes |
|------|-----------|-------|
| Review daily notes | Weekly | Archive or link to projects |
| Process `#blog-idea` tags | Weekly | Move promising ideas to drafts |
| Update content calendar | When status changes | Keep tracking current |
| Prune stale drafts | Monthly | Archive or delete abandoned drafts |
| Backup vault | Automatic (Git) | Verify commits are pushing |

---

*This vault is synced to GitHub and aggregated into the ops-core dashboard.*
