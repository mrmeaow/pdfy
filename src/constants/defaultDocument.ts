export const DEFAULT_MARKDOWN = `# Welcome to PDFy

A powerful markdown editor with live preview and PDF export.

---

## Text Formatting

**Bold text**, *italic text*, ~~strikethrough~~, and \`inline code\`.

## Lists

### Unordered
- First item
- Second item
  - Nested item
  - Another nested item

### Ordered
1. First step
2. Second step
3. Third step

### Task List
- [x] Create the editor
- [x] Add live preview
- [ ] Export to PDF
- [ ] Share with the world

## Links & Images

[Visit GitHub](https://github.com)

![Placeholder Image](https://via.placeholder.com/600x200/0969da/ffffff?text=PDFy+Markdown+Editor)

## Table

| Feature | Status | Notes |
|---------|--------|-------|
| GFM Tables | :white_check_mark: | Full support |
| Code Blocks | :white_check_mark: | Syntax highlighted |
| Mermaid | :white_check_mark: | Diagrams render live |
| Callouts | :white_check_mark: | 5 types supported |

## Emojis :rocket:

Supports GitHub-style emoji shortcodes: :heart: :fire: :star: :tada: :sparkles:

## Callouts

> [!NOTE]
> This is a note callout. Use it for additional information.

> [!TIP]
> This is a tip callout. Use it for helpful suggestions.

> [!IMPORTANT]
> This is an important callout. Use it for critical information.

> [!WARNING]
> This is a warning callout. Use it for potential issues.

> [!CAUTION]
> This is a caution callout. Use it for dangerous actions.

## Code Blocks

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
}

// Usage
const users = await fetchUsers();
console.log(\`Found \${users.length} users\`);
\`\`\`

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n numbers."""
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

# Print first 10 numbers
print(fibonacci(10))
\`\`\`

## Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[Write Markdown] --> B[Live Preview]
    B --> C{Looks Good?}
    C -->|Yes| D[Export to PDF]
    C -->|No| A
    D --> E[Share Document]
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant E as Editor
    participant P as Preview
    U->>E: Type markdown
    E->>P: Process & render
    P-->>U: Live preview
    U->>E: Export PDF
    E-->>U: Download file
\`\`\`

## Blockquote

> "The best way to predict the future is to invent it."
> -- Alan Kay

## Horizontal Rule

---

## Embedded Video

https://www.youtube.com/watch?v=dQw4w9WgXcQ

## Raw HTML

<details>
<summary>Click to expand</summary>

This content is hidden by default. You can use HTML elements directly in your markdown!

</details>

---

*Made with PDFy* :heart:
`
