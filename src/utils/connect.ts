import { RefObject } from 'react'
import { LineType } from '../type'

type Point = {
  left: number
  top: number
}

const computeMidPoint = (fromPoint: Point, toPoint: Point) => ({
  left:
    fromPoint.left > toPoint.left
      ? toPoint.left + (fromPoint.left - toPoint.left) / 2
      : fromPoint.left + (toPoint.left - fromPoint.left) / 2,
  top:
    fromPoint.top > toPoint.top
      ? toPoint.top + (fromPoint.top - toPoint.top) / 2
      : fromPoint.top + (toPoint.top - fromPoint.top) / 2,
})

const COMMANDS = {
  curved: (
    fromPoint: Point,
    toPoint: Point,
    offset: number,
    anchor = 'center'
  ) => {
    const midPoint = computeMidPoint(fromPoint, toPoint)
    let cmds = `M ${fromPoint.left + offset},${fromPoint.top + offset} `
    if (anchor === 'horizontal') {
      cmds +=
        `C ${midPoint.left + offset},${fromPoint.top + offset} ` +
        `${midPoint.left + offset},${toPoint.top + offset} `
    } else {
      cmds +=
        `C ${fromPoint.left + offset},${midPoint.top + offset} ` +
        `${midPoint.left + offset},${midPoint.top + offset} `
    }
    cmds += ` ${toPoint.left + offset},${toPoint.top + offset}`
    return cmds
  },
  direct: (
    fromPoint: Point,
    toPoint: Point,
    offset: number,
    anchor = 'center'
  ) =>
    `M ${fromPoint.left + offset},${fromPoint.top + offset} ` +
    `L ${toPoint.left + offset},${toPoint.top + offset}`,
  rectilinear: (
    fromPoint: Point,
    toPoint: Point,
    offset: number,
    anchor = 'center'
  ) => {
    const midPoint = computeMidPoint(fromPoint, toPoint)
    let cmds = `M ${fromPoint.left + offset},${fromPoint.top + offset} `
    if (anchor === 'horizontal') {
      cmds +=
        `L ${midPoint.left + offset},${fromPoint.top + offset} ` +
        `L ${midPoint.left + offset},${toPoint.top + offset} `
    } else {
      cmds +=
        `L ${fromPoint.left + offset},${midPoint.top + offset} ` +
        `L ${toPoint.left + offset},${midPoint.top + offset} `
    }
    cmds += `L ${toPoint.left + offset},${toPoint.top + offset}`
    return cmds
  },
}

export default function connect({
  anchor = 'horizontal',
  line,
  selfRef,
  parentRef,
  containerRef,
}: {
  anchor?: 'center' | 'horizontal'
  line: LineType
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
    const containerRect = containerRef.current.getBoundingClientRect()
    const fromRect = parentRef.current.getBoundingClientRect()
    const toRect = selfRef.current.getBoundingClientRect()
    const fromPoint = {
      left: fromRect.left - containerRect.left || 0,
      top: fromRect.top - containerRect.top || 0,
    }
    const toPoint = {
      left: toRect.left - containerRect.left || 0,
      top: toRect.top - containerRect.top || 0,
    }
    if (anchor === 'horizontal') {
      fromPoint.top += fromRect.height / 2
      toPoint.top += toRect.height / 2
      if (fromRect.left < toRect.left) {
        fromPoint.left += fromRect.width
      } else {
        toPoint.left += toRect.width
      }
    } else {
      // center
      fromPoint.left += fromRect.width / 2
      fromPoint.top += fromRect.height / 2
      toPoint.left += toRect.width / 2
      toPoint.top += toRect.height / 2
    }
    return `
        <path
          role="connection"
          class="${line.isAnimate ? 'animate' : ''}"
          stroke="${line.color || '#FD6FFF'}"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="miter"
          fill="none"
          d="${COMMANDS[line.type || 'curved'](fromPoint, toPoint, 0, anchor)}"
        />
    `
  }
  return ''
}
