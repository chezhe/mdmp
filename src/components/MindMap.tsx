import { RefObject, useEffect, useRef } from 'react'
import connect from '../utils/connect'

export default function MindMap({
  mapTree,
  parentRef,
  containerRef,
  level,
  index = 0,
  appendConnection,
}: {
  mapTree: MapTree
  parentRef: RefObject<HTMLDivElement> | null
  containerRef: RefObject<SVGSVGElement> | null
  level: number
  index?: number
  appendConnection: (connection: string) => void
}) {
  const selfRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const connection = connect({
      selfRef,
      parentRef,
      containerRef,
    })
    if (connection) {
      appendConnection(connection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfRef, parentRef, containerRef, mapTree])

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
