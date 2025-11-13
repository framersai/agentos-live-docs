#!/usr/bin/env node
/**
 * Post-process TypeDoc HTML files to inject AgentOS header/footer.
 * Removes TypeDoc's default chrome and wraps with our static fragments.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { glob } from 'glob'

async function main() {
  const [head, header, footer] = await Promise.all([
    fs.readFile('head.html', 'utf8').catch(() => ''),
    fs.readFile('header.html', 'utf8').catch(() => ''),
    fs.readFile('footer.html', 'utf8').catch(() => '')
  ])

  if (!header || !footer) {
    console.warn('⚠️  Missing header.html or footer.html; skipping wrap')
    return
  }

  const files = await glob('docs/**/*.html', { nodir: true })
  
  console.log(`📦 Wrapping ${files.length} TypeDoc HTML files...`)
  
  for (const file of files) {
    let html = await fs.readFile(file, 'utf8')
    
    // Remove TypeDoc's default header/footer if present
    html = html.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    html = html.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    
    // Inject head tags before </head>
    if (head && html.includes('</head>')) {
      html = html.replace('</head>', `${head}\n</head>`)
    }
    
    // Inject header after <body>
    if (html.includes('<body')) {
      html = html.replace(/(<body[^>]*>)/i, `$1\n${header}\n`)
    }
    
    // Inject footer before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `\n${footer}\n</body>`)
    }
    
    await fs.writeFile(file, html, 'utf8')
  }
  
  console.log('✅ All TypeDoc pages wrapped with AgentOS chrome')
}

main().catch((err) => {
  console.error('❌ Wrap failed:', err)
  process.exit(1)
})

