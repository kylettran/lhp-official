'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type ImpactSegment = {
  name: string
  attendees: number
  href: string
  color: string
  percent: number
}

type ImpactDonutChartProps = {
  segments: ImpactSegment[]
  total: number
}

const radius = 90
const circumference = 2 * Math.PI * radius

export default function ImpactDonutChart({ segments, total }: ImpactDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const enrichedSegments = useMemo(() => {
    let cursor = 0
    return segments.map((segment) => {
      const startPercent = cursor
      const percent = segment.percent || 0
      cursor += percent
      return {
        ...segment,
        startPercent,
        percent,
      }
    })
  }, [segments])

  const handlePointerDown = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index))
  }

  const handlePointerEnter = (index: number) => {
    setActiveIndex(index)
  }

  const handlePointerLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="impact-visual" role="presentation">
      <div
        className="impact-donut"
        role="img"
        aria-label={`${total} total attendees across ${segments.length} events`}
      >
        <svg viewBox="0 0 220 220" className="impact-donut-chart">
          <g transform="rotate(-90 110 110)">
            <circle
              cx="110"
              cy="110"
              r={radius}
              strokeWidth="22"
              className="impact-donut-track"
              fill="none"
            />
            {enrichedSegments.map((segment, index) => {
              const dashLength = (segment.percent / 100) * circumference
              const offset =
                circumference - (segment.startPercent / 100) * circumference
              return (
                <circle
                  strokeLinecap="round"
                  key={segment.name}
                  className={`impact-segment ${
                    activeIndex === index ? 'impact-segment--active' : ''
                  }`}
                  cx="110"
                  cy="110"
                  r={radius}
                  strokeWidth="22"
                  stroke={segment.color}
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={offset}
                  fill="none"
                  onMouseEnter={() => handlePointerEnter(index)}
                  onMouseLeave={handlePointerLeave}
                  onClick={() => handlePointerDown(index)}
                  onPointerDown={() => handlePointerDown(index)}
                />
              )
            })}
          </g>
        </svg>
        <div className="impact-donut-inner">
          <p className="impact-donut-number">{total}+</p>
          <p className="impact-donut-subtext">Attendees</p>
        </div>
      </div>
      <div className="impact-legend">
        {segments.map((segment, index) => (
          <Link
            key={segment.name}
            href={segment.href}
            className={`impact-legend-row ${
              activeIndex === index ? 'impact-legend-row--active' : ''
            }`}
            onMouseEnter={() => handlePointerEnter(index)}
            onMouseLeave={handlePointerLeave}
            onPointerDown={() => handlePointerDown(index)}
          >
            <span
              className="impact-legend-swatch"
              style={{ backgroundColor: segment.color }}
            />
            <div>
              <p className="impact-legend-name">{segment.name}</p>
              <p className="impact-legend-count">{segment.attendees} attendees</p>
            </div>
            <span className="impact-legend-percent">
              {segment.percent.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
