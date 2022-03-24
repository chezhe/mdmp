import isEqual from 'lodash.isequal'
import {
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { ConnectionLineType, MapTree } from '../type'
import { parseBySimpleMarkdown } from '../utils/parser'
import MindMap from './MindMap'

type CanvasState = {
  connections: string[]
}

enum CanvasAction {
  NEW_CONNECTION = 'NEW_CONNECTION',
  RESET_CONNECTION = 'RESET_CONNECTION',
}

type ReducerAction = {
  type: CanvasAction
  payload: string
}

const initialState: CanvasState = {
  connections: [],
}

const reducer: Reducer<CanvasState, ReducerAction> = (state, action) => {
  switch (action.type) {
    case CanvasAction.NEW_CONNECTION:
      return { connections: [...state.connections, action.payload] }
    case CanvasAction.RESET_CONNECTION:
      return { connections: [] }
    default:
      throw new Error()
  }
}

export default function Canvas({
  input,
  lineType = ConnectionLineType.CURVED,
  isAnimate = true,
}: {
  input: string
  isAnimate?: boolean
  lineType?: ConnectionLineType
}) {
  const containerRef = useRef<SVGSVGElement | null>(null)
  const [mapTrees, setMapTrees] = useState<MapTree[]>([])

  const [state, dispatch] = useReducer(reducer, initialState)

  const clearConnections = () =>
    dispatch({ type: CanvasAction.RESET_CONNECTION, payload: '' })

  useMemo(() => {
    clearConnections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineType, isAnimate])

  useEffect(() => {
    const newMapTrees = parseBySimpleMarkdown(input)
    if (!isEqual(newMapTrees, mapTrees)) {
      clearConnections()
      setMapTrees(newMapTrees)
    }
  }, [input, mapTrees])

  return (
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
                type: lineType,
                isAnimate: isAnimate,
                color: '',
              }}
              appendConnection={(connection: string) => {
                dispatch({
                  type: CanvasAction.NEW_CONNECTION,
                  payload: connection,
                })
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
