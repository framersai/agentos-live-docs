import React from 'react'
import MDXComponents from '@theme-original/MDXComponents'
import DiagramImg from '@site/src/components/DiagramImg'

/**
 * Swizzle of the default Docusaurus MDX component map.
 *
 * Overrides the `img` component to route `/img/diagrams/<name>.svg` references
 * through {@link DiagramImg}, which renders a Docusaurus `<ThemedImage>` with
 * matching light/dark SVG variants so the diagram tracks the site theme
 * toggle rather than only the OS-level `prefers-color-scheme`.
 *
 * Non-diagram images pass through untouched.
 */
export default {
  ...MDXComponents,
  img: DiagramImg,
}
