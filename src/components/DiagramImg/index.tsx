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
 */

const DIAGRAM_PATTERN = /^\/img\/diagrams\/([^./]+)\.svg$/

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
  const { src, alt, title, ...rest } = props

  if (typeof src === 'string') {
    const match = src.match(DIAGRAM_PATTERN)
    if (match) {
      const name = match[1]
      if (THEMED_DIAGRAMS.has(name)) {
        return (
          <ThemedImage
            alt={alt ?? ''}
            title={title}
            sources={{
              light: useBaseUrl(`/img/diagrams/${name}.svg`),
              dark: useBaseUrl(`/img/diagrams/${name}-dark.svg`),
            }}
            className="docDiagram"
          />
        )
      }
    }
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={src} alt={alt} title={title} {...rest} />
}
