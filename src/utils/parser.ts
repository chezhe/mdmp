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

type MapTreeTemp = {
  title: string
  children: MapTreeTemp[]
  whitespace: number
  parent?: MapTreeTemp
}

const closetParent = (node: MapTreeTemp, target?: MapTreeTemp) => {
  let _parent = target
  while (_parent && node.whitespace < _parent.whitespace) {
    _parent = _parent.parent!
  }
  return _parent?.parent
}

export const parseByCustom = (input: string) => {
  const lines = input.split('\n')
  const _result: MapTreeTemp[] = []
  let prevNode = null
  for (let index = 0; index < lines.length; index++) {
    const result = /^\s{0,}-\s{0,}.*/g.exec(lines[index])
    if (result) {
      const [left, right] = result[0].split('-')
      const whitespace = left.length
      const title = right.trim()

      const current: MapTreeTemp = {
        title,
        children: [],
        whitespace,
      }
      console.log(lines[index], prevNode, current)

      if (!prevNode) {
        _result.push(current)
      } else if (current.whitespace === prevNode.whitespace) {
        current.parent = prevNode.parent
        if (prevNode.parent) {
          prevNode.parent?.children.push(current)
        } else {
          _result.push(current)
        }
      } else if (current.whitespace > prevNode.whitespace) {
        current.parent = prevNode
        prevNode.children.push(current)
      } else if (current.whitespace < prevNode.whitespace) {
        const closet = closetParent(current, prevNode.parent)
        console.log('###', closet)
        if (closet) {
          current.parent = closet
          closet.children.push(current)
        } else {
          _result.push(current)
        }
      }
      prevNode = current
    }
  }
  return cleanMapTreeTemp(_result)
}

function cleanMapTreeTemp(trees: MapTreeTemp[]): MapTree[] {
  return trees.map((t) => {
    return {
      title: t.title,
      children: cleanMapTreeTemp(t.children),
    }
  })
}
