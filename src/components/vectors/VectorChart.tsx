import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import type { WordPoint } from '../../types/vectors.ts'
import { NodeType } from '../../types/vectors.ts'

interface VectorChartProps {
  points: WordPoint[]
  isLoading: boolean
  startWord: string
  subtractWord: string
  addWord: string
  resultWord: string
}

// Node styling per type
const NODE_STYLE: Record<
  NodeType,
  {
    fill: string
    stroke: string
    r: number
    labelSize: number
    labelWeight: number
    emoji: string
  }
> = {
  [NodeType.START]: {
    fill: '#fef2f2',
    stroke: '#c60c30',
    r: 8,
    labelSize: 14,
    labelWeight: 700,
    emoji: '',
  },
  [NodeType.SUBTRACT]: {
    fill: '#fef2f2',
    stroke: '#c60c30',
    r: 8,
    labelSize: 14,
    labelWeight: 700,
    emoji: '',
  },
  [NodeType.ADD]: {
    fill: '#f0fdf4',
    stroke: '#16a34a',
    r: 8,
    labelSize: 14,
    labelWeight: 700,
    emoji: '',
  },
  [NodeType.RESULT]: {
    fill: '#222222',
    stroke: '#222222',
    r: 10,
    labelSize: 15,
    labelWeight: 800,
    emoji: '',
  },
  [NodeType.CONTEXT]: {
    fill: '#f3f4f6',
    stroke: '#d1d5db',
    r: 4,
    labelSize: 10,
    labelWeight: 400,
    emoji: '',
  },
}

export function VectorChart({
  points,
  isLoading,
  startWord,
  subtractWord,
  addWord,
  resultWord,
}: VectorChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || points.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = containerRef.current.clientWidth
    const height = 480
    const margin = { top: 20, right: 30, bottom: 20, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.attr('width', width).attr('height', height)

    // Background
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#fafafa')
      .attr('rx', 8)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales — no visible axes (the numbers are meaningless to students)
    const xExtent = d3.extent(points, (d) => d.x) as [number, number]
    const yExtent = d3.extent(points, (d) => d.y) as [number, number]
    const xPad = (xExtent[1] - xExtent[0]) * 0.25 || 2
    const yPad = (yExtent[1] - yExtent[0]) * 0.25 || 2

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - xPad, xExtent[1] + xPad])
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPad, yExtent[1] + yPad])
      .range([innerHeight, 0])

    // Subtle dot grid instead of axis lines
    const xTicks = xScale.ticks(12)
    const yTicks = yScale.ticks(10)
    xTicks.forEach((x) => {
      yTicks.forEach((y) => {
        g.append('circle')
          .attr('cx', xScale(x))
          .attr('cy', yScale(y))
          .attr('r', 0.8)
          .attr('fill', '#e5e7eb')
      })
    })

    // Arrow marker definitions
    const defs = svg.append('defs')

    // Drop shadow filter for result node
    const filter = defs.append('filter').attr('id', 'shadow')
    filter
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 1)
      .attr('stdDeviation', 3)
      .attr('flood-opacity', 0.15)

    const addMarker = (id: string, color: string) => {
      defs
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)
        .attr('refY', 5)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 1 L 8 5 L 0 9 z')
        .attr('fill', color)
    }
    addMarker('arrow-red', '#c60c30')
    addMarker('arrow-green', '#16a34a')

    const getPoint = (type: NodeType) => points.find((p) => p.type === type)
    const pStart = getPoint(NodeType.START)
    const pSub = getPoint(NodeType.SUBTRACT)
    const pAdd = getPoint(NodeType.ADD)
    const pRes = getPoint(NodeType.RESULT)

    // Helper: draw an arrow between two points, shortened to avoid overlapping nodes
    const drawArrow = (
      from: WordPoint,
      to: WordPoint,
      color: string,
      strokeWidth: number,
      dash: string | null,
      markerId: string,
    ) => {
      const x1 = xScale(from.x)
      const y1 = yScale(from.y)
      const x2 = xScale(to.x)
      const y2 = yScale(to.y)
      // Shorten line by node radius to avoid overlap
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.sqrt(dx * dx + dy * dy)
      const shortenStart = 12
      const shortenEnd = 16
      const sx = x1 + (dx / len) * shortenStart
      const sy = y1 + (dy / len) * shortenStart
      const ex = x2 - (dx / len) * shortenEnd
      const ey = y2 - (dy / len) * shortenEnd

      const line = g
        .append('line')
        .attr('x1', sx)
        .attr('y1', sy)
        .attr('x2', ex)
        .attr('y2', ey)
        .attr('stroke', color)
        .attr('stroke-width', strokeWidth)
        .attr('marker-end', `url(#${markerId})`)

      if (dash) line.attr('stroke-dasharray', dash)
      return line
    }

    // Arrow 1: Subtract → Start (red, dashed) — "the relationship we're extracting"
    if (pSub && pStart) {
      drawArrow(pSub, pStart, '#c60c30', 2, '6,4', 'arrow-red')

      // Label on the arrow
      const mx = (xScale(pSub.x) + xScale(pStart.x)) / 2
      const my = (yScale(pSub.y) + yScale(pStart.y)) / 2
      g.append('text')
        .attr('x', mx)
        .attr('y', my - 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#c60c30')
        .attr('font-size', 10)
        .attr('font-weight', 500)
        .attr('font-style', 'italic')
        .style('text-shadow', '1px 1px 3px white, -1px -1px 3px white')
        .text(`${subtractWord} → ${startWord}`)
    }

    // Arrow 2: Add → Result (green, solid) — "the same relationship applied"
    if (pAdd && pRes) {
      drawArrow(pAdd, pRes, '#16a34a', 2.5, null, 'arrow-green')

      const mx = (xScale(pAdd.x) + xScale(pRes.x)) / 2
      const my = (yScale(pAdd.y) + yScale(pRes.y)) / 2
      g.append('text')
        .attr('x', mx)
        .attr('y', my - 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#16a34a')
        .attr('font-size', 10)
        .attr('font-weight', 500)
        .attr('font-style', 'italic')
        .style('text-shadow', '1px 1px 3px white, -1px -1px 3px white')
        .text(`${addWord} → ${resultWord}`)
    }

    // Draw "same direction" indicator — a small "=" between the two arrow midpoints
    if (pSub && pStart && pAdd && pRes) {
      const m1x = (xScale(pSub.x) + xScale(pStart.x)) / 2
      const m1y = (yScale(pSub.y) + yScale(pStart.y)) / 2
      const m2x = (xScale(pAdd.x) + xScale(pRes.x)) / 2
      const m2y = (yScale(pAdd.y) + yScale(pRes.y)) / 2
      const cx = (m1x + m2x) / 2
      const cy = (m1y + m2y) / 2

      // Connecting thin dotted line between midpoints
      g.append('line')
        .attr('x1', m1x)
        .attr('y1', m1y)
        .attr('x2', m2x)
        .attr('y2', m2y)
        .attr('stroke', '#9ca3af')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,3')

      // "samma riktning" label
      g.append('text')
        .attr('x', cx)
        .attr('y', cy)
        .attr('dy', -6)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6b7280')
        .attr('font-size', 9)
        .attr('font-weight', 500)
        .style('text-shadow', '1px 1px 3px white, -1px -1px 3px white')
        .text('samma riktning')
    }

    // Draw nodes (context first, then main nodes on top)
    const sortedPoints = [...points].sort((a, b) => {
      const order = { CONTEXT: 0, SUBTRACT: 1, ADD: 2, START: 3, RESULT: 4 }
      return (order[a.type] ?? 0) - (order[b.type] ?? 0)
    })

    sortedPoints.forEach((point) => {
      const cx = xScale(point.x)
      const cy = yScale(point.y)
      const style = NODE_STYLE[point.type]
      const isContext = point.type === NodeType.CONTEXT

      // Node group
      const nodeG = g.append('g').attr('transform', `translate(${cx},${cy})`)

      // Circle
      const circle = nodeG
        .append('circle')
        .attr('r', style.r)
        .attr('fill', style.fill)
        .attr('stroke', style.stroke)
        .attr('stroke-width', isContext ? 1 : 2.5)

      if (point.type === NodeType.RESULT) {
        circle.attr('filter', 'url(#shadow)')
      }

      // Role badge for main nodes
      if (!isContext) {
        const badgeText =
          point.type === NodeType.START
            ? startWord
            : point.type === NodeType.SUBTRACT
              ? `−${subtractWord}`
              : point.type === NodeType.ADD
                ? `+${addWord}`
                : `= ${point.word}`

        const badgeColor =
          point.type === NodeType.ADD ? '#16a34a' : style.stroke

        // Word label (bold, above)
        nodeG
          .append('text')
          .attr('y', -style.r - 14)
          .attr('text-anchor', 'middle')
          .attr('fill', '#111827')
          .attr('font-size', style.labelSize)
          .attr('font-weight', style.labelWeight)
          .attr('font-family', 'Inter, sans-serif')
          .style(
            'text-shadow',
            '2px 2px 4px white, -2px -2px 4px white, 0 0 8px white',
          )
          .text(point.word)

        // Role tag (smaller, below)
        nodeG
          .append('text')
          .attr('y', style.r + 16)
          .attr('text-anchor', 'middle')
          .attr('fill', badgeColor)
          .attr('font-size', 10)
          .attr('font-weight', 600)
          .attr('font-family', 'Inter, sans-serif')
          .style(
            'text-shadow',
            '1px 1px 3px white, -1px -1px 3px white',
          )
          .text(badgeText)
      } else {
        // Context word — just a small label
        nodeG
          .append('text')
          .attr('y', -8)
          .attr('text-anchor', 'middle')
          .attr('fill', '#9ca3af')
          .attr('font-size', style.labelSize)
          .attr('font-weight', style.labelWeight)
          .attr('font-family', 'Inter, sans-serif')
          .style('text-shadow', '1px 1px 2px white, -1px -1px 2px white')
          .text(point.word)
      }
    })
  }, [points, startWord, subtractWord, addWord, resultWord])

  return (
    <div ref={containerRef} className="relative rounded-xl border border-gray-200 overflow-hidden">
      <svg ref={svgRef} className="w-full" />

      {/* Legend */}
      {points.length > 0 && (
        <div className="absolute bottom-3 left-3 flex gap-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-[10px] text-gray-500 border border-gray-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#c60c30] bg-red-50 inline-block" />
            Start / Subtrahera
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#16a34a] bg-green-50 inline-block" />
            Addera
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#222] inline-block" />
            Resultat
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 inline-block" />
            Grannar
          </span>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-uu-red rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Beräknar vektorer...</span>
          </div>
        </div>
      )}
    </div>
  )
}
