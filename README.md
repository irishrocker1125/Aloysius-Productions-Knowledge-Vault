# Knowledge Vault

Personal knowledge base for Aloysius Productions. Built with [Quartz](https://quartz.jzhao.xyz/) and deployed to GitHub Pages.

## Live Site

https://irishrocker1125.github.io/Aloysius-Productions-Knowledge-Vault/

## Structure

```
knowledge-vault/
├── obsidian/                    # Obsidian vault (content source)
│   ├── daily/                   # Daily notes
│   ├── ideas/                   # Ideas to explore
│   ├── projects/                # Project documentation
│   ├── references/              # Technical references and guides
│   └── templates/               # Note templates
│
├── quartz/                      # Quartz static site generator
├── quartz.config.ts             # Site configuration
└── .github/workflows/deploy.yml # GitHub Pages deployment
```

## Local Development

```bash
# Install dependencies
npm ci

# Build the site
npm run build

# Preview locally
npm run serve
```

## Workflow

1. **Capture** - Use Obsidian to write notes in `obsidian/`
2. **Commit** - Push changes to master
3. **Deploy** - GitHub Actions builds and deploys to Pages automatically

## Templates

Located in `obsidian/templates/`:

- `daily-note.md` - Daily capture template
- `reference.md` - Technical documentation template
- `idea.md` - Idea capture template

## Deployment

On push to `master`, GitHub Actions:
1. Builds the Quartz site from `obsidian/` content
2. Deploys to GitHub Pages

First-time setup: Enable GitHub Pages in repository settings with source "GitHub Actions".

---

*Part of the Aloysius Productions ecosystem.*
