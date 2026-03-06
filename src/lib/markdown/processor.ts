import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { remarkEmbeds } from './remarkEmbeds'
import { rehypeMermaid } from './rehypeMermaid'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkEmoji)
  .use(remarkGithubBlockquoteAlert)
  .use(remarkEmbeds)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeMermaid)
  .use(rehypeHighlight, { detect: false, ignoreMissing: true })
  .use(rehypeSlug)
  .use(rehypeStringify)

export async function processMarkdown(source: string): Promise<string> {
  const result = await processor.process(source)
  return String(result)
}
