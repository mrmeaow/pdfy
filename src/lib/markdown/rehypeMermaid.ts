// import { visit } from 'unist-util-visit'
// import type { Node, Parent } from 'unist'

// type ElementNode = Node & {
//   type: 'element'
//   tagName?: string
//   properties?: { className?: unknown }
//   children?: Node[]
// }

// type TextNode = Node & {
//   type: 'text'
//   value?: string
// }

// export function rehypeMermaid() {
//   return (tree: Node) => {
//     visit(tree, 'element', (node: Node, index, parent: Parent | undefined) => {
//       if (!parent || index === undefined) return
//       const preNode = node as ElementNode
//       if (preNode.tagName !== 'pre') return

//       const codeNode = preNode.children?.[0] as ElementNode | undefined
//       if (!codeNode || codeNode.type !== 'element' || codeNode.tagName !== 'code') return

//       const classNames = Array.isArray(codeNode.properties?.className)
//         ? (codeNode.properties?.className as string[])
//         : []
//       const isMermaid = classNames.some(
//         (name) => name === 'language-mermaid' || name === 'lang-mermaid'
//       )
//       if (!isMermaid) return

//       const source = (codeNode.children ?? [])
//         .filter((child): child is TextNode => child.type === 'text')
//         .map((child) => child.value ?? '')
//         .join('')

//       const textNode: TextNode = { type: 'text', value: source }
//       const mermaidNode: ElementNode = {
//         type: 'element',
//         tagName: 'div',
//         properties: { className: ['mermaid'] },
//         children: [textNode as Node],
//       }
//       ;(parent.children as Node[])[index] = mermaidNode
//     })
//   }
// }


// rehype-mermaid.ts - FINAL VERSION
import { visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'

// Robust text extraction that preserves all whitespace/newlines
function extractText(node: Node): string {
  if (node.type === 'text') {
    return (node as any).value || ''
  }
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractText).join('')
  }
  return ''
}

export function rehypeMermaid() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Node, index: number | undefined, parent: Parent | undefined) => {
      if (parent === undefined || index === undefined) return
      
      const preNode = node as any
      if (preNode.tagName !== 'pre') return

      const codeNode = preNode.children?.[0] as any | undefined
      if (!codeNode || codeNode.type !== 'element' || codeNode.tagName !== 'code') return

      // Handle className flexibly (string, array, or undefined)
      const classNameProp = codeNode.properties?.className
      const classNames: string[] = Array.isArray(classNameProp)
        ? classNameProp
        : typeof classNameProp === 'string'
          ? [classNameProp]
          : []

      const isMermaid = classNames.some(
        (name) => name === 'language-mermaid' || name === 'lang-mermaid'
      )
      if (!isMermaid) return

      // ✅ Extract source with preserved newlines
      const source = extractText(codeNode).trimEnd()
      if (!source) return

      // Create the replacement <div class="mermaid"> with text child
      const mermaidNode: any = {
        type: 'element',
        tagName: 'div',
        properties: { 
          className: ['mermaid'],
          // Optional: embed source for debugging in dev
          ...({ 'data-source': source })
        },
        children: [{ type: 'text', value: source }],
      }
      
      // Replace <pre><code> with <div.mermaid>
      ;(parent.children as any[])[index] = mermaidNode
    })
  }
}