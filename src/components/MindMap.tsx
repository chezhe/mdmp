import { RefObject, useEffect, useRef } from 'react'
import { COLOR_PALETTES, LINE_COLORS } from '../constants'
import { MapTree, LineType } from '../type'
import connect from '../utils/connect'

const getNodeColor = (level: number) =>
  COLOR_PALETTES[level % COLOR_PALETTES.length]

const getLineColor = (level: number, idx: number) =>
  level === 0 ? LINE_COLORS[idx % LINE_COLORS.length] : undefined

export default function MindMap({
  mapTree,
  parentRef,
  containerRef,
  level,
  appendConnection,
  line,
}: {
  line: LineType
  mapTree: MapTree
  parentRef: RefObject<HTMLDivElement> | null
  containerRef: RefObject<SVGSVGElement> | null
  level: number
  appendConnection: (connection: string) => void
}) {
  const selfRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const connection = connect({
      line,
      selfRef,
      parentRef,
      containerRef,
    })
    if (connection) {
      appendConnection(connection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfRef, parentRef, containerRef, mapTree, line.isAnimate, line.type])

  return (
    <div className="mindmap-node" data-testid={`${mapTree.title}`}>
      <div
        ref={selfRef}
        className="node-label"
        style={{ backgroundColor: getNodeColor(level) }}
      >
        <span>{mapTree.title}</span>
      </div>
      <div className="mindmap-children">
        {(mapTree.children || []).map((child, idx) => {
          return (
            <MindMap
              key={idx}
              mapTree={child}
              parentRef={selfRef}
              containerRef={containerRef}
              line={{
                ...line,
                color: getLineColor(level, idx) || line.color,
              }}
              level={level + 1}
              appendConnection={appendConnection}
            />
          )
        })}
      </div>
    </div>
  )
}
