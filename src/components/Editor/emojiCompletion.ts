import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { EMOJI_LIST } from '../../constants/emojiMap'

export function emojiCompletion(context: CompletionContext): CompletionResult | null {
  const match = context.matchBefore(/:[a-zA-Z0-9_+-]{2,}$/)
  if (!match) return null

  const query = match.text.slice(1).toLowerCase()

  const options = EMOJI_LIST
    .filter(([name]) => name.includes(query))
    .slice(0, 30)
    .map(([name, emoji]) => ({
      label: `:${name}:`,
      displayLabel: `${emoji} :${name}:`,
      apply: `:${name}:`,
      type: 'text' as const,
    }))

  if (options.length === 0) return null

  return {
    from: match.from,
    options,
    validFor: /^:[a-zA-Z0-9_+-]*$/,
  }
}
