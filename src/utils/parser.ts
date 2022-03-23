import SimpleMarkdown from 'simple-markdown'

function formatTree(tree: SimpleMarkdown.SingleASTNode) {
  if (tree.type === 'list') {
    return tree.items.map((t: SimpleMarkdown.SingleASTNode) => {
      if (Array.isArray(t)) {
        let title = ''
        const children: any[] = []
        t.forEach((subNode) => {
          if (subNode.type === 'text') {
            title += formatTree(subNode).title
          } else {
            children.push(formatTree(subNode))
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
  const astNodes = SimpleMarkdown.defaultBlockParse(input.trim(), {
    inline: true,
  })
  let result: MapTree[] = []
  astNodes.map(formatTree).forEach((t) => {
    console.log(t)
    if (Array.isArray(t)) {
      result = [...result, ...t]
    }
  })
  console.log('###', input, result)

  return result
}
