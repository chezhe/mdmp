import { render, screen } from '@testing-library/react'
import App from './App'
import { parseBySimpleMarkdown } from './utils/parser'
import { DEFAULT_INPUT } from './constants'
import { MapTree } from './type'

test('detect nodes render', () => {
  render(<App />)

  let path = 0
  function detectNode(nodes: MapTree[], level: number) {
    nodes.forEach((mapTree) => {
      const title = mapTree.title
      expect(screen.getByTestId(title)).toBeInTheDocument()

      if (level > 0) {
        path++
      }
      // eslint-disable-next-line testing-library/no-node-access
      detectNode(mapTree.children, level + 1)
    })
  }

  const nodes = parseBySimpleMarkdown(DEFAULT_INPUT)
  detectNode(nodes, 0)

  expect(screen.getAllByRole('connection').length).toEqual(path)
})
