import { visit } from 'unist-util-visit'
import type { Root, Paragraph, Text, Link } from 'mdast'

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/

export function remarkEmbeds() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || index === undefined) return
      if (node.children.length !== 1) return

      const child = node.children[0]

      // Check for a plain text YouTube URL
      if (child.type === 'text') {
        const match = (child as Text).value.trim().match(YOUTUBE_REGEX)
        if (match) {
          const videoId = match[1]
          ;(parent.children as any)[index] = {
            type: 'html',
            value: `<div class="embed-responsive"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`,
          }
          return
        }
      }

      // Check for a link-only paragraph with YouTube URL
      if (child.type === 'link') {
        const link = child as Link
        const match = link.url.match(YOUTUBE_REGEX)
        if (match && link.children.length === 1 && link.children[0].type === 'text') {
          const linkText = (link.children[0] as Text).value
          // Only auto-embed if the link text IS the URL (autolink)
          if (linkText === link.url || linkText === link.url.replace(/^https?:\/\//, '')) {
            const videoId = match[1]
            ;(parent.children as any)[index] = {
              type: 'html',
              value: `<div class="embed-responsive"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`,
            }
          }
        }
      }
    })
  }
}
