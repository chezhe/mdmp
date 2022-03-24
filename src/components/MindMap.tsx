import { RefObject, useEffect, useRef } from 'react'
import { ConnectionLineType } from '../type'
import connect from '../utils/connect'

export default function MindMap({
  mapTree,
  parentRef,
  containerRef,
  level,
  lineType,
  index = 0,
  isAnimate = true,
  appendConnection,
}: {
  mapTree: MapTree
  lineType: ConnectionLineType
  parentRef: RefObject<HTMLDivElement> | null
  containerRef: RefObject<SVGSVGElement> | null
  level: number
  index?: number
  isAnimate?: boolean
  appendConnection: (connection: string) => void
}) {
  const selfRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const connection = connect({
      connectionType: lineType,
      isAnimate,
      selfRef,
      parentRef,
      containerRef,
    })
    if (connection) {
      appendConnection(connection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfRef, parentRef, containerRef, mapTree, lineType, isAnimate])

  return (
    <div className="mindmap-node">
      <div ref={selfRef} className="node-label">
        <span>{mapTree?.title}</span>
      </div>
      <div className="mindmap-children">
        {(mapTree?.children || []).map((child, idx) => {
          return (
            <MindMap
              key={idx}
              mapTree={child}
              parentRef={selfRef}
              index={index}
              isAnimate={isAnimate}
              lineType={lineType}
              containerRef={containerRef}
              level={level + 1}
              appendConnection={appendConnection}
            />
          )
        })}
      </div>
    </div>
  )
}
