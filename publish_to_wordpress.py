#!/usr/bin/env python3
"""
WordPress Publishing Script

Publishes or updates a blog post from Markdown to WordPress.

Usage:
    python scripts/publish_to_wordpress.py <markdown_file> [--publish]

Arguments:
    markdown_file   Path to the markdown file to publish
    --publish       Publish immediately (default: create as draft)

Environment Variables:
    WORDPRESS_URL           Your WordPress site URL (e.g., https://yourblog.com)
    WORDPRESS_USER          Your WordPress username
    WORDPRESS_APP_PASSWORD  Application password from WordPress

Setup:
    1. In WordPress: Users → Your Profile → Application Passwords
    2. Create new password, copy it
    3. Set environment variables or create .env file
"""

import os
import sys
import json
import re
import argparse
import requests
from datetime import datetime
from pathlib import Path

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False
    print("Warning: PyYAML not installed. Install with: pip install pyyaml")


# Configuration
WORDPRESS_URL = os.environ.get('WORDPRESS_URL', '').rstrip('/')
WORDPRESS_USER = os.environ.get('WORDPRESS_USER', '')
WORDPRESS_APP_PASSWORD = os.environ.get('WORDPRESS_APP_PASSWORD', '')

CONTENT_CALENDAR = Path(__file__).parent.parent / 'blog' / 'content-calendar.json'


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """
    Parse YAML frontmatter from markdown content.
    
    Returns:
        Tuple of (frontmatter dict, body content)
    """
    if not content.startswith('---'):
        return {}, content
    
    # Find the closing ---
    end_match = re.search(r'\n---\n', content[3:])
    if not end_match:
        return {}, content
    
    frontmatter_str = content[3:end_match.start() + 3]
    body = content[end_match.end() + 3 + 1:]
    
    if YAML_AVAILABLE:
        try:
            frontmatter = yaml.safe_load(frontmatter_str)
        except yaml.YAMLError as e:
            print(f"Warning: Could not parse frontmatter: {e}")
            frontmatter = {}
    else:
        # Basic parsing without YAML
        frontmatter = {}
        for line in frontmatter_str.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                frontmatter[key.strip()] = value.strip().strip('"\'')
    
    return frontmatter or {}, body


def markdown_to_html(markdown: str) -> str:
    """
    Convert markdown to HTML.
    
    Note: For production, consider using a proper markdown library.
    WordPress can also accept markdown directly with certain plugins.
    """
    # Basic conversion - WordPress handles most markdown
    # For better conversion, install: pip install markdown
    try:
        import markdown as md
        return md.markdown(markdown, extensions=['fenced_code', 'tables'])
    except ImportError:
        # Return as-is; WordPress may handle it
        return markdown


def create_or_update_post(frontmatter: dict, content: str, publish: bool = False) -> dict:
    """
    Create or update a WordPress post via REST API.
    
    Args:
        frontmatter: Post metadata from markdown frontmatter
        content: Post body content (HTML or markdown)
        publish: If True, publish immediately; otherwise create as draft
        
    Returns:
        API response as dict
    """
    if not all([WORDPRESS_URL, WORDPRESS_USER, WORDPRESS_APP_PASSWORD]):
        raise ValueError(
            "WordPress credentials not configured.\n"
            "Set WORDPRESS_URL, WORDPRESS_USER, and WORDPRESS_APP_PASSWORD environment variables."
        )
    
    api_url = f"{WORDPRESS_URL}/wp-json/wp/v2/posts"
    
    # Prepare post data
    post_data = {
        'title': frontmatter.get('title', 'Untitled'),
        'content': content,
        'status': 'publish' if publish else 'draft',
        'slug': frontmatter.get('slug', ''),
    }
    
    # Add excerpt/description if available
    if frontmatter.get('seo', {}).get('description'):
        post_data['excerpt'] = frontmatter['seo']['description']
    
    # Handle tags (need to be IDs or will be created)
    if frontmatter.get('tags'):
        post_data['tags'] = frontmatter['tags']  # WordPress will handle
    
    # Check if updating existing post
    wordpress_id = frontmatter.get('wordpress_id')
    
    if wordpress_id:
        # Update existing post
        response = requests.post(
            f"{api_url}/{wordpress_id}",
            json=post_data,
            auth=(WORDPRESS_USER, WORDPRESS_APP_PASSWORD)
        )
    else:
        # Create new post
        response = requests.post(
            api_url,
            json=post_data,
            auth=(WORDPRESS_USER, WORDPRESS_APP_PASSWORD)
        )
    
    if response.status_code not in [200, 201]:
        raise Exception(f"WordPress API error: {response.status_code} - {response.text}")
    
    return response.json()


def update_content_calendar(file_path: Path, wordpress_response: dict, publish: bool):
    """
    Update the content calendar with WordPress post info.
    """
    if not CONTENT_CALENDAR.exists():
        print(f"Warning: Content calendar not found at {CONTENT_CALENDAR}")
        return
    
    with open(CONTENT_CALENDAR, 'r') as f:
        calendar = json.load(f)
    
    slug = wordpress_response.get('slug', '')
    
    # Find existing entry or create new
    existing = next((p for p in calendar['posts'] if p['slug'] == slug), None)
    
    if existing:
        existing['wordpress_id'] = wordpress_response['id']
        existing['wordpress_url'] = wordpress_response['link']
        existing['modified'] = datetime.now().strftime('%Y-%m-%d')
        if publish:
            existing['status'] = 'published'
            existing['published'] = datetime.now().strftime('%Y-%m-%d')
    else:
        calendar['posts'].append({
            'id': f"post-{wordpress_response['id']}",
            'slug': slug,
            'title': wordpress_response['title']['rendered'],
            'status': 'published' if publish else 'draft',
            'created': datetime.now().strftime('%Y-%m-%d'),
            'modified': datetime.now().strftime('%Y-%m-%d'),
            'published': datetime.now().strftime('%Y-%m-%d') if publish else None,
            'wordpress_id': wordpress_response['id'],
            'wordpress_url': wordpress_response['link'],
            'file_path': str(file_path),
            'tags': [],
            'categories': [],
            'seo': {'description': '', 'keywords': []},
            'notes': 'Auto-added by publish script'
        })
    
    calendar['metadata']['last_updated'] = datetime.now().strftime('%Y-%m-%d')
    
    with open(CONTENT_CALENDAR, 'w') as f:
        json.dump(calendar, f, indent=2)
    
    print(f"✅ Updated content calendar")


def main():
    parser = argparse.ArgumentParser(description='Publish markdown to WordPress')
    parser.add_argument('file', type=Path, help='Markdown file to publish')
    parser.add_argument('--publish', action='store_true', help='Publish immediately (default: draft)')
    parser.add_argument('--dry-run', action='store_true', help='Parse and show what would be sent')
    
    args = parser.parse_args()
    
    if not args.file.exists():
        print(f"Error: File not found: {args.file}")
        sys.exit(1)
    
    print(f"📄 Reading: {args.file}")
    
    with open(args.file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    frontmatter, body = parse_frontmatter(content)
    
    print(f"📝 Title: {frontmatter.get('title', 'Untitled')}")
    print(f"🔗 Slug: {frontmatter.get('slug', 'no-slug')}")
    print(f"📊 Status: {'publish' if args.publish else 'draft'}")
    
    if args.dry_run:
        print("\n--- DRY RUN ---")
        print(f"Frontmatter: {json.dumps(frontmatter, indent=2)}")
        print(f"Body length: {len(body)} characters")
        print("No changes made.")
        return
    
    # Convert markdown to HTML
    html_content = markdown_to_html(body)
    
    print("\n🚀 Sending to WordPress...")
    
    try:
        response = create_or_update_post(frontmatter, html_content, args.publish)
        
        print(f"\n✅ Success!")
        print(f"   ID: {response['id']}")
        print(f"   URL: {response['link']}")
        print(f"   Status: {response['status']}")
        
        # Update content calendar
        update_content_calendar(args.file, response, args.publish)
        
        # Suggest updating frontmatter
        if not frontmatter.get('wordpress_id'):
            print(f"\n💡 Add this to your frontmatter:")
            print(f"   wordpress_id: {response['id']}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
