import React from 'react'
import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'

/**
 * Auto-themed image renderer for diagram SVGs.
 *
 * The Docusaurus MDX `img` component is swizzled to use this when the source
 * matches `/img/diagrams/<name>.svg`. It swaps in the matching
 * `<name>-dark.svg` variant when the site is in dark mode, so diagrams track
 * the Docusaurus theme toggle rather than just the OS-level
 * `prefers-color-scheme`.
 *
 * Any other image path falls through to a plain `<img>`.
 */

const DIAGRAM_PATTERN = /^\/img\/diagrams\/([^./]+)\.svg$/

type Props = React.ImgHTMLAttributes<HTMLImageElement>

export default function DiagramImg(props: Props) {
  const { src, alt, title, ...rest } = props

  if (typeof src === 'string') {
    const match = src.match(DIAGRAM_PATTERN)
    if (match) {
      const name = match[1]
      // Skip the wrap if this is already a -dark file (avoid infinite suffixing)
      if (!name.endsWith('-dark')) {
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
