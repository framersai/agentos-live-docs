import React from 'react'
import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'

/**
 * Auto-themed image renderer for diagram SVGs.
 *
 * The Docusaurus MDX `img` component is swizzled to use this when the source
 * matches `/img/diagrams/<name>.svg` AND the diagram appears in the registry
 * below. Registered diagrams get routed through Docusaurus's `<ThemedImage>`
 * so they swap between `<name>.svg` (light) and `<name>-dark.svg` (dark)
 * based on the site theme toggle.
 *
 * Diagrams not in the registry fall through to a plain `<img>` so older
 * single-variant SVGs (which rely on their own internal
 * `@media (prefers-color-scheme: dark)` rules) are unaffected by the
 * swizzle.
 *
 * **Rules of Hooks:** `useBaseUrl` is called unconditionally at the top of
 * the component so the hook count is stable across every src this component
 * may render (themed diagram, non-themed image, no src). Conditional hook
 * calls previously caused a hydration mismatch (React errors #418, #423)
 * because the swizzled `img` runs through this component for every image
 * on the site.
 *
 * **Accessibility:** MDX authors should always provide descriptive alt
 * text for diagram images. An empty alt makes the image decorative, which
 * is rarely what we want for an architectural diagram. In development a
 * warning is logged when `alt` is missing or empty.
 */

const DIAGRAM_PATTERN = /^\/img\/diagrams\/([^./]+)\.svg$/
const WEBPACK_ASSET_SVG = /\/assets\/images\/[^/]+\.svg$/
const INLINE_SVG_PREFIX = 'data:image/svg+xml'

/**
 * Whether this img should be treated as a clickable diagram (wrapped with
 * the zoom badge). Docusaurus's webpack img loader can serve the same
 * source file as a public-static path (`/img/diagrams/foo.svg`), a
 * webpack-copied hashed asset (`/assets/images/foo-abcd.svg`), or an
 * inlined data URI when the SVG is small enough — wrap all three so the
 * badge is consistent regardless of which form the build emitted.
 */
function isDiagramSrc(src: string | undefined): boolean {
  if (typeof src !== 'string') return false
  if (DIAGRAM_PATTERN.test(src)) return true
  if (WEBPACK_ASSET_SVG.test(src)) return true
  if (src.startsWith(INLINE_SVG_PREFIX)) return true
  return false
}

/**
 * Diagrams that ship both `<name>.svg` and `<name>-dark.svg` variants.
 * Add to this list when you generate a paired dark file under
 * `static/img/diagrams/`.
 */
const THEMED_DIAGRAMS = new Set<string>([
  // Hero diagrams shipped with paired light/dark variants from the start.
  'rag-memory-pipeline',
  'agent-graph-topology',
  'soul-files-anatomy',
  'citation-verification-flow',
  'hyde-retrieval-flow',
  'multimodal-rag-fanout',
  'document-ingestion-pipeline',
  // Pre-existing diagrams retrofitted from a single @media-based SVG into
  // paired light/dark files. Update this list when you add a new diagram
  // under `static/img/diagrams/` with a matching `-dark.svg` sibling.
  'adaptive-intelligence',
  'agent-communication-bus',
  'cognitive-memory-architecture',
  'emergent-capabilities-forge-loop',
  'gmi-architecture',
  'hexaco-encoding-weights',
  'hexaco-propagation',
  'hexaco-radar',
  'human-in-the-loop',
  'memory-architecture-layers',
  'memory-system-overview',
  'paracosm-divergence',
  'paracosm-turn-flow',
  'paracosm-world-model-split',
  'planning-engine',
  'system-architecture',
  'system-architecture-layers',
])

type Props = React.ImgHTMLAttributes<HTMLImageElement>

export default function DiagramImg(props: Props) {
  const { src, alt, title, className, ...rest } = props

  // Resolve diagram metadata before any hook call so the hook count stays
  // stable across all renders (themed, non-themed, missing src).
  const match = typeof src === 'string' ? src.match(DIAGRAM_PATTERN) : null
  const name = match ? match[1] : null
  const isThemed = name != null && THEMED_DIAGRAMS.has(name)

  // Always call useBaseUrl, even for non-themed images, so the hook order
  // doesn't change. The results are only consumed in the themed branch.
  // Use a stable placeholder path when there's no diagram name to keep
  // the hook input deterministic across renders.
  const lightUrl = useBaseUrl(`/img/diagrams/${name ?? '__noop'}.svg`)
  const darkUrl = useBaseUrl(`/img/diagrams/${name ?? '__noop'}-dark.svg`)

  if (process.env.NODE_ENV !== 'production' && (alt == null || alt === '')) {
    // eslint-disable-next-line no-console
    console.warn(
      `[DiagramImg] missing alt text for ${src ?? '(unknown src)'}; add descriptive alt in the MDX source.`,
    )
  }

  const mergedClassName = ['docDiagram', className].filter(Boolean).join(' ')

  // Render the "Click to expand" badge as part of the React tree rather than
  // reparenting the img into a client-injected wrapper element. The earlier
  // approach in `src/mermaid-zoom.js` (`wrapDiagrams()`) inserted a
  // `<span class="mer-zoom-wrap">` around every diagram img imperatively,
  // which moved a React-owned `<img>` out from under its markdown `<p>`.
  // On the next reconciliation (route change, theme toggle, hydration)
  // React tried to remove the img from the `<p>` and threw
  // `Failed to execute 'removeChild' on 'Node'`, surfacing as React errors
  // #418 / #423 in the prod console.
  //
  // Keeping the wrap inside the component means React owns every node and
  // reconciliation stays consistent. Click-to-zoom in `mermaid-zoom.js`
  // still works because the delegated click handler targets the img by
  // src selector regardless of where it sits in the tree.
  const inner = isThemed ? (
    <ThemedImage
      {...rest}
      alt={alt ?? ''}
      title={title}
      sources={{ light: lightUrl, dark: darkUrl }}
      className={mergedClassName}
    />
  ) : (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...rest} src={src} alt={alt} title={title} className={className} />
  )

  if (!isDiagramSrc(typeof src === 'string' ? src : undefined)) {
    return inner
  }

  return (
    <span className="mer-zoom-wrap">
      {inner}
      <span className="mer-zoom-badge" aria-hidden="true">
        ⊕ Click to expand
      </span>
    </span>
  )
}
