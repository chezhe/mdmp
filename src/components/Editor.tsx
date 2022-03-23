import { useEffect, useReducer, useRef, useState } from 'react'
import { DEFAULT_INPUT } from '../constants'
import { parseBySimpleMarkdown } from '../utils/parser'
import MindMap from './MindMap'
import isEqual from 'lodash.isequal'

const initialState = { connections: [] }

type State = {
  connections: string[]
}

enum ConnectionAction {
  new = 'new',
  clear = 'clear',
}
type Action = {
  type: ConnectionAction
  payload: string
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'new':
      return { connections: [...state.connections, action.payload] }
    case 'clear':
      return { connections: [] }
    default:
      throw new Error()
  }
}

export default function Editor() {
  const containerRef = useRef<SVGSVGElement | null>(null)
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [mapTrees, setMapTrees] = useState<MapTree[]>([])

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const newMapTrees = parseBySimpleMarkdown(input)
    if (!isEqual(newMapTrees, mapTrees)) {
      setMapTrees(newMapTrees)
      dispatch({ type: ConnectionAction.clear, payload: '' })
    }
  }, [input, mapTrees])

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
                    type: ConnectionAction.new,
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
