import { RefObject } from 'react'

type Point = number[]

const computeMidPoint = (fromPoint: Point, toPoint: Point) => [
  fromPoint[0] > toPoint[0]
    ? toPoint[0] + (fromPoint[0] - toPoint[0]) / 2
    : fromPoint[0] + (toPoint[0] - fromPoint[0]) / 2,
  fromPoint[1] > toPoint[1]
    ? toPoint[1] + (fromPoint[1] - toPoint[1]) / 2
    : fromPoint[1] + (toPoint[1] - fromPoint[1]) / 2,
]

function renderLine(
  fromPoint: Point,
  toPoint: Point,
  offset = 0,
  anchor = 'center'
) {
  const midPoint = computeMidPoint(fromPoint, toPoint)
  let cmds = `M ${fromPoint[0] + offset},${fromPoint[1] + offset} `
  if (anchor === 'horizontal') {
    cmds +=
      `L ${midPoint[0] + offset},${fromPoint[1] + offset} ` +
      `L ${midPoint[0] + offset},${toPoint[1] + offset} `
  } else {
    cmds +=
      `L ${fromPoint[0] + offset},${midPoint[1] + offset} ` +
      `L ${toPoint[0] + offset},${midPoint[1] + offset} `
  }
  cmds += `L ${toPoint[0] + offset},${toPoint[1] + offset}`
  return cmds
}

export default function connect({
  selfRef,
  parentRef,
  containerRef,
}: {
  selfRef: RefObject<HTMLDivElement> | null
  parentRef: RefObject<HTMLDivElement> | null
  containerRef: RefObject<SVGSVGElement> | null
}) {
  if (
    selfRef &&
    selfRef.current &&
    parentRef &&
    parentRef.current &&
    containerRef &&
    containerRef.current
  ) {
    const anchor = 'horizontal'
    const containerRect = containerRef.current.getBoundingClientRect()
    const fromRect = parentRef.current.getBoundingClientRect()
    const toRect = selfRef.current.getBoundingClientRect()
    const fromPoint: Point = [
      fromRect.left - containerRect.left || 0,
      fromRect.top - containerRect.top || 0,
    ]
    const toPoint: Point = [
      toRect.left - containerRect.left || 0,
      toRect.top - containerRect.top || 0,
    ]
    if (anchor === 'horizontal') {
      fromPoint[1] += fromRect.height / 2
      toPoint[1] += toRect.height / 2
      if (fromRect.left < toRect.left) {
        fromPoint[0] += fromRect.width
      } else {
        toPoint[0] += toRect.width
      }
    } else {
      // center
      fromPoint[0] += fromRect.width / 2
      fromPoint[1] += fromRect.height / 2
      toPoint[0] += toRect.width / 2
      toPoint[1] += toRect.height / 2
    }
    return `
        <path
          stroke="#FD6FFF"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="miter"
          fill="none"
          d="${renderLine(fromPoint, toPoint, 0, anchor)}"
        />
    `
  }
  return ''
}