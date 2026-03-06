// import { useEffect } from 'react'

// type MermaidAPI = typeof import('mermaid').default

// let mermaidPromise: Promise<MermaidAPI> | null = null

// function getMermaid(): Promise<MermaidAPI> {
//   if (!mermaidPromise) {
//     mermaidPromise = import('mermaid').then((m) => m.default)
//   }
//   return mermaidPromise
// }

// export function useMermaid(
//   containerRef: React.RefObject<HTMLElement | null>,
//   html: string,
//   theme: 'light' | 'dark'
// ) {
//   useEffect(() => {
//     let cancelled = false

//     const rafId = requestAnimationFrame(() => {
//       const container = containerRef.current
//       if (!container) return

//       const nodes = Array.from(container.querySelectorAll<HTMLElement>('div.mermaid'))
//       if (nodes.length === 0) return

//       ;(async () => {
//         try {
//           const mermaid = await getMermaid()
//           if (cancelled) return

//           mermaid.initialize({
//             startOnLoad: false,
//             theme: theme === 'dark' ? 'dark' : 'default',
//             securityLevel: 'loose',
//           })

//           for (let i = 0; i < nodes.length; i += 1) {
//             if (cancelled) return
//             const node = nodes[i]
//             const source = (node.textContent || '').trim()
//             if (!source) continue

//             try {
//               const id = `mermaid-${Date.now()}-${i}`
//               const { svg } = await mermaid.render(id, source)
//               if (cancelled) return

//               const wrapper = document.createElement('div')
//               wrapper.className = 'mermaid-rendered'
//               wrapper.innerHTML = svg
//               node.replaceWith(wrapper)
//             } catch (err) {
//               if (cancelled) return
//               const errorDiv = document.createElement('div')
//               errorDiv.className = 'mermaid-error'
//               errorDiv.textContent = `Mermaid error: ${err instanceof Error ? err.message : String(err)}`
//               node.replaceWith(errorDiv)
//             }
//           }
//         } catch (err) {
//           if (cancelled) return
//           for (const node of nodes) {
//             const errorDiv = document.createElement('div')
//             errorDiv.className = 'mermaid-error'
//             errorDiv.textContent = `Mermaid error: ${err instanceof Error ? err.message : String(err)}`
//             node.replaceWith(errorDiv)
//           }
//         }
//       })()
//     })

//     return () => {
//       cancelled = true
//       cancelAnimationFrame(rafId)
//     }
//   }, [html, theme, containerRef])
// }

// user-mermaid.ts
import { useEffect } from 'react'

type MermaidAPI = typeof import('mermaid').default

let mermaidPromise: Promise<MermaidAPI> | null = null

function getMermaid(): Promise<MermaidAPI> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default)
  }
  return mermaidPromise
}

export function useMermaid(
  containerRef: React.RefObject<HTMLElement | null>,
  html: string,
  theme: 'light' | 'dark'
) {
  useEffect(() => {
    let cancelled = false
    let rafId: number

    const renderMermaid = async () => {
      const container = containerRef.current
      if (!container) return

      const nodes = Array.from(container.querySelectorAll<HTMLElement>('div.mermaid'))
      if (nodes.length === 0) return

      try {
        const mermaid = await getMermaid()
        if (cancelled) return

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
          // ✅ Add fontFamily for better rendering consistency
          fontFamily: 'inherit',
        })

        for (let i = 0; i < nodes.length; i += 1) {
          if (cancelled) return
          const node = nodes[i]
          const source = (node.textContent || '').trim()
          if (!source) continue

          try {
            const id = `mermaid-${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`
            const { svg } = await mermaid.render(id, source)
            if (cancelled) return

            const wrapper = document.createElement('div')
            wrapper.className = 'mermaid-rendered'
            wrapper.innerHTML = svg
            node.replaceWith(wrapper)
          } catch (err) {
            if (cancelled) return
            console.error('Mermaid render error:', err) // ✅ Add logging
            const errorDiv = document.createElement('div')
            errorDiv.className = 'mermaid-error'
            errorDiv.textContent = `Mermaid error: ${err instanceof Error ? err.message : String(err)}`
            // ✅ Show source for debugging
            errorDiv.title = source
            node.replaceWith(errorDiv)
          }
        }
      } catch (err) {
        if (cancelled) return
        console.error('Mermaid load error:', err) // ✅ Add logging
        for (const node of nodes) {
          const errorDiv = document.createElement('div')
          errorDiv.className = 'mermaid-error'
          errorDiv.textContent = `Mermaid error: ${err instanceof Error ? err.message : String(err)}`
          node.replaceWith(errorDiv)
        }
      }
    }

    // eslint-disable-next-line prefer-const
    rafId = requestAnimationFrame(() => {
      if (!cancelled) {
        renderMermaid()
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [html, theme, containerRef]) // ✅ Dependencies look correct
}