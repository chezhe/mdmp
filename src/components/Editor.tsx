import { useReducer, useRef, useState } from 'react'
import { DEFAULT_INPUT } from '../constants'
import { parseBySimpleMarkdown } from '../utils/parser'
import MindMap from './MindMap'

const initialState = { connections: [] }

type State = {
  connections: string[]
}
type Action = {
  type: 'new'
  payload: string
}
function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'new':
      return { connections: [...state.connections, action.payload] }
    default:
      throw new Error()
  }
}

export default function Editor() {
  const containerRef = useRef<SVGSVGElement | null>(null)
  const [input, setInput] = useState(DEFAULT_INPUT)
  console.log(input)
  const mapTrees = parseBySimpleMarkdown(input)

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="editor-wrap">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="map-wrap">
        <div>
          {mapTrees.map((tree, idx) => {
            return (
              <MindMap
                key={idx}
                mapTree={tree}
                parentRef={null}
                level={0}
                containerRef={containerRef}
                appendConnection={(connection: string) => {
                  dispatch({
                    type: 'new',
                    payload: connection,
                  })
                }}
              />
            )
          })}
        </div>

        <div className="map-overlay">
          <svg ref={containerRef} width="100%" height="100%">
            <g
              dangerouslySetInnerHTML={{
                __html: state.connections.join(''),
              }}
            ></g>
          </svg>
        </div>
      </div>
    </div>
  )
}
