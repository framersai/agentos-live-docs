#!/usr/bin/env node
/**
 * Convert markdown documentation files to styled HTML pages.
 * Uses the same header/footer templates as TypeDoc output for consistency.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import hljs from 'highlight.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Source markdown files (from packages/agentos/docs)
const MD_SOURCE_DIR = path.resolve(ROOT, '../../packages/agentos/docs')
// Output directory (docs/ in agentos-live-docs)
const OUTPUT_DIR = path.resolve(ROOT, 'docs')

// Configure marked with syntax highlighting
marked.setOptions({
    highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value
            } catch (err) {
                console.warn(`Highlight error for ${lang}:`, err.message)
            }
        }
        return hljs.highlightAuto(code).value
    },
    gfm: true,
    breaks: false
})

/**
 * Extract title from markdown content (first H1)
 */
function extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m)
    return match ? match[1] : 'Documentation'
}

/**
 * Convert internal .md links to .html
 */
function convertLinks(html) {
    // Convert relative .md links to .html
    return html.replace(/href="([^"]+)\.md"/g, 'href="$1.html"')
}

/**
 * Generate the full HTML page
 */
function generatePage(title, content, head, header, footer) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - AgentOS Documentation</title>
  <link rel="stylesheet" href="assets/style.css">
  <link rel="stylesheet" href="assets/highlight.css">
  ${head}
  <style>
    .md-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }
    .md-content h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; border-bottom: 2px solid var(--color-border-subtle); padding-bottom: 0.75rem; }
    .md-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; }
    .md-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; }
    .md-content p { line-height: 1.7; margin-bottom: 1rem; }
    .md-content ul, .md-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    .md-content li { margin-bottom: 0.5rem; line-height: 1.6; }
    .md-content pre { overflow-x: auto; margin: 1.5rem 0; }
    .md-content code { font-family: 'SF Mono', 'Consolas', monospace; font-size: 0.875em; }
    .md-content blockquote { border-left: 4px solid var(--color-accent-primary); padding-left: 1rem; margin: 1.5rem 0; color: var(--color-text-secondary); }
    .md-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    .md-content th, .md-content td { padding: 0.75rem; border: 1px solid var(--color-border-subtle); text-align: left; }
    .md-content th { background: var(--color-background-secondary); font-weight: 600; }
    .md-content img { max-width: 100%; height: auto; border-radius: 0.5rem; }
    .md-content a { color: var(--color-accent-primary); text-decoration: none; }
    .md-content a:hover { text-decoration: underline; }
    .md-content hr { border: none; border-top: 1px solid var(--color-border-subtle); margin: 2rem 0; }
    /* Mermaid diagram support */
    .mermaid { background: var(--color-background-secondary); padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0; }
  </style>
</head>
<body>
${header}
<main class="md-content">
${content}
</main>
${footer}
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({ startOnLoad: true, theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default' });
</script>
</body>
</html>`
}

/**
 * Process mermaid code blocks
 */
function processMermaid(html) {
    // Convert ```mermaid code blocks to <div class="mermaid">
    return html.replace(
        /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
        '<div class="mermaid">$1</div>'
    )
}

async function main() {
    console.log('📄 Converting markdown files to HTML...\n')

    // Load template fragments
    const [head, header, footer] = await Promise.all([
        fs.readFile(path.join(ROOT, 'head.html'), 'utf8').catch(() => ''),
        fs.readFile(path.join(ROOT, 'header.html'), 'utf8').catch(() => ''),
        fs.readFile(path.join(ROOT, 'footer.html'), 'utf8').catch(() => '')
    ])

    if (!header || !footer) {
        console.error('❌ Missing header.html or footer.html templates')
        process.exit(1)
    }

    // Find all markdown files in source directory
    let mdFiles = []
    try {
        const files = await fs.readdir(MD_SOURCE_DIR)
        mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md')
    } catch (err) {
        console.error(`❌ Could not read source directory: ${MD_SOURCE_DIR}`)
        console.error(err.message)
        process.exit(1)
    }

    if (mdFiles.length === 0) {
        console.log('⚠️  No markdown files found to convert')
        return
    }

    console.log(`Found ${mdFiles.length} markdown files:\n`)

    // Process each file
    for (const file of mdFiles) {
        const inputPath = path.join(MD_SOURCE_DIR, file)
        const outputFile = file.replace('.md', '.html')
        const outputPath = path.join(OUTPUT_DIR, outputFile)

        try {
            // Read and convert markdown
            const markdown = await fs.readFile(inputPath, 'utf8')
            const title = extractTitle(markdown)
            let html = marked.parse(markdown)

            // Post-process
            html = convertLinks(html)
            html = processMermaid(html)

            // Generate full page
            const page = generatePage(title, html, head, header, footer)

            // Write output
            await fs.writeFile(outputPath, page, 'utf8')
            console.log(`  ✅ ${file} → ${outputFile}`)
        } catch (err) {
            console.error(`  ❌ ${file}: ${err.message}`)
        }
    }

    console.log('\n✨ Markdown conversion complete!')
}

main().catch((err) => {
    console.error('❌ Conversion failed:', err)
    process.exit(1)
})
