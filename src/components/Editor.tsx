import { Reducer, useEffect, useReducer, useRef, useState } from 'react'
import { DEFAULT_INPUT } from '../constants'
import { parseBySimpleMarkdown } from '../utils/parser'
import MindMap from './MindMap'
import isEqual from 'lodash.isequal'
import { ConnectionLineType, MapTree } from '../type'
import Controls from './Controls'

type EditorState = {
  connections: string[]
  isAnimate: boolean
  lineType: ConnectionLineType
}

enum EditorAction {
  NEW_CONNECTION = 'NEW_CONNECTION',
  RESET_CONNECTION = 'RESET_CONNECTION',
  TOGGLE_ANIMATE = 'TOGGLE_ANIMATE',
  UPDATE_LINE_TYPE = 'UPDATE_LINE_TYPE',
}

type ReducerAction = {
  type: EditorAction
  payload?: any
}

const initialState: EditorState = {
  connections: [],
  isAnimate: true,
  lineType: ConnectionLineType.CURVED,
}

const reducer: Reducer<EditorState, ReducerAction> = (state, action) => {
  switch (action.type) {
    case EditorAction.NEW_CONNECTION:
      return { ...state, connections: [...state.connections, action.payload] }
    case EditorAction.RESET_CONNECTION:
      return { ...state, connections: [] }
    case EditorAction.TOGGLE_ANIMATE:
      return { ...state, isAnimate: action.payload, connections: [] }
    case EditorAction.UPDATE_LINE_TYPE:
      return { ...state, lineType: action.payload, connections: [] }
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
      dispatch({ type: EditorAction.RESET_CONNECTION })
      setMapTrees(newMapTrees)
    }
  }, [input, mapTrees])

  return (
    <div className="editor-wrap">
      <div className="textarea-wrap">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <Controls
          lineType={state.lineType}
          setLineType={(lineType) => {
            dispatch({
              type: EditorAction.UPDATE_LINE_TYPE,
              payload: lineType,
            })
          }}
          isAnimate={state.isAnimate}
          setIsAnimate={(isAnimate) => {
            dispatch({
              type: EditorAction.TOGGLE_ANIMATE,
              payload: isAnimate,
            })
          }}
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
                line={{
                  type: state.lineType,
                  isAnimate: state.isAnimate,
                  color: '',
                }}
                appendConnection={(connection: string) => {
                  dispatch({
                    type: EditorAction.NEW_CONNECTION,
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
