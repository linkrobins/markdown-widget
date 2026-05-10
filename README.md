# Link Robins Markdown Widget

A simple Markdown widget for [Flarum 2.0](https://flarum.org), built as a widget for [`fof/forum-widgets-core`](https://packagist.org/packages/fof/forum-widgets-core). Same skeleton as [`linkrobins/html-widget`](https://packagist.org/packages/linkrobins/html-widget), with a Markdown renderer in front of the body.

## What it does

Adds one configurable Markdown widget to the FoF Forum Widgets placement editor. Admin sets:

- **Title** — optional, shown above the body
- **Icon** — FontAwesome class (e.g. `fab fa-markdown`)
- **Markdown body** — standard GitHub-flavored Markdown, rendered to HTML on the client

Drag and place it from the FoF Forum Widgets admin page like any other widget.

## Requirements

- Flarum **2.0** or later
- [`fof/forum-widgets-core`](https://packagist.org/packages/fof/forum-widgets-core) installed and enabled
- Browser must be able to load `cdnjs.cloudflare.com` — the Markdown renderer ([marked.js](https://marked.js.org/)) is loaded from CDN at runtime

## Installation

```
composer require linkrobins/markdown-widget
php flarum cache:clear
```

In Flarum admin → **Extensions**, find **Link Robins Markdown** under the **Forum Widgets** category and enable it. Configure title/icon/body, then go to FoF Forum Widgets settings and place it where you want it.

## Markdown features

Supports the full Markdown syntax that marked.js handles, including:

- Headings (`# H1`, `## H2`, ...)
- Bold (`**bold**`) and italic (`*italic*`)
- Lists (ordered and unordered)
- Links and images
- Code spans and fenced code blocks
- Blockquotes
- Tables (GFM)
- Horizontal rules
- Inline HTML (passes through unchanged)

The widget styles headings, lists, code, blockquotes, and tables to fit cleanly in any placement.

## Security note

The body is rendered without sanitization — inline HTML in the Markdown source will run on the forum, including any `<script>` or `<iframe>` tags. Only enable this extension if you trust everyone with admin access.

## License

MIT
