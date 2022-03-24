import { Reducer, useReducer, useState } from 'react'
import { DEFAULT_INPUT } from '../constants'
import { ConnectionLineType } from '../type'
import Controls from './Controls'
import Canvas from './Canvas'

type EditorState = {
  isAnimate: boolean
  lineType: ConnectionLineType
}

enum EditorAction {
  TOGGLE_ANIMATE = 'TOGGLE_ANIMATE',
  UPDATE_LINE_TYPE = 'UPDATE_LINE_TYPE',
}

type ReducerAction = {
  type: EditorAction
  payload?: any
}

const initialState: EditorState = {
  isAnimate: true,
  lineType: ConnectionLineType.CURVED,
}

const reducer: Reducer<EditorState, ReducerAction> = (state, action) => {
  switch (action.type) {
    case EditorAction.TOGGLE_ANIMATE:
      return { ...state, isAnimate: action.payload }
    case EditorAction.UPDATE_LINE_TYPE:
      return { ...state, lineType: action.payload }
    default:
      throw new Error()
  }
}

export default function Editor() {
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [state, dispatch] = useReducer(reducer, initialState)

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
      <Canvas
        input={input}
        lineType={state.lineType}
        isAnimate={state.isAnimate}
      />
    </div>
  )
}
