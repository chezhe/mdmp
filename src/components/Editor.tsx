import { useEffect, useReducer, useRef, useState } from 'react'
import { DEFAULT_INPUT } from '../constants'
import { parseBySimpleMarkdown } from '../utils/parser'
import MindMap from './MindMap'
import isEqual from 'lodash.isequal'
import { ConnectionLineType, MapTree } from '../type'
import Controls from './Controls'

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
  const [lineType, setLineType] = useState<ConnectionLineType>(
    ConnectionLineType.CURVED
  )
  const [isAnimate, setIsAnimate] = useState(true)

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
      <div className="textarea-wrap">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <Controls
          lineType={lineType}
          setLineType={(lineType) => {
            setLineType(lineType)
            dispatch({ type: ConnectionAction.clear, payload: '' })
          }}
          isAnimate={isAnimate}
          setIsAnimate={setIsAnimate}
        />
      </div>
      <div className="map-wrap">
        <div className="maptree-wrap">
          <div className="svg-overlay">
            <svg ref={containerRef} width="100%" height="100%">
              <g
                dangerouslySetInnerHTML={{
                  __html: state.connections.join(''),
                }}
              ></g>
            </svg>
          </div>
          {mapTrees.map((tree, idx) => {
            return (
              <MindMap
                key={idx}
                mapTree={tree}
                parentRef={null}
                containerRef={containerRef}
                level={0}
                line={{ type: lineType, isAnimate, color: '' }}
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
      </div>
    </div>
  )
}
