import SimpleMarkdown from 'simple-markdown'
import { MapTree } from '../type'

const stripString = (str: string) => str.replace(/\n*/gm, '').trim()

function formatTree(tree: SimpleMarkdown.SingleASTNode) {
  if (tree.type === 'list') {
    return tree.items.map((t: SimpleMarkdown.SingleASTNode) => {
      if (Array.isArray(t)) {
        let title = ''
        const children: any[] = []
        t.forEach((subNode) => {
          if (subNode.type === 'list') {
            children.push(formatTree(subNode))
          } else {
            title += stripString(formatTree(subNode).title)
          }
        })
        return {
          title,
          children: children.length === 1 ? children[0] : children,
        }
      }
      return formatTree(t)
    })
  } else if (tree.type === 'text') {
    return {
      title: tree.content,
      children: [],
    }
  }
  return null
}

export const parseBySimpleMarkdown = (input: string): MapTree[] => {
  const astNodes = SimpleMarkdown.defaultBlockParse(
    input.trim().replace(/^\s*\n/gm, ''),
    {
      inline: true,
    }
  )
  let result: MapTree[] = []
  astNodes.map(formatTree).forEach((t) => {
    if (Array.isArray(t)) {
      result = [...result, ...t]
    }
  })

  return result
}
