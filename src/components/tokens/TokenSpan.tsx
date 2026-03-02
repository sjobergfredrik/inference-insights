import { useState } from 'react'
import type { ProcessedToken } from '../../types/tokens.ts'
import {
  getProbabilityColor,
  getProbabilityBorder,
  getProbabilityFontWeight,
} from '../../lib/colors.ts'

interface TokenSpanProps {
  token: ProcessedToken
  index: number
  isActiveStep: boolean
  stepMode: boolean
  onClickToken?: (index: number) => void
}

export function TokenSpan({
  token,
  index,
  isActiveStep,
  stepMode,
  onClickToken,
}: TokenSpanProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const hasStrongAlternatives = token.alternatives.some(
    (alt) => alt.probability > token.probability * 0.8,
  )

  const displayToken = token.token.replace(/Ġ/g, ' ')
  const pct = Math.round(token.probability * 100)

  return (
    <span
      className="relative inline-block px-0.5 mx-px rounded cursor-pointer transition-all duration-200 font-mono hover:brightness-90 hover:-translate-y-px"
      style={{
        backgroundColor: getProbabilityColor(token.probability),
        border: getProbabilityBorder(token.probability, hasStrongAlternatives),
        fontWeight: getProbabilityFontWeight(token.probability),
        textDecoration:
          token.probability < 0.2 ? 'underline wavy #dc2626' : 'none',
        boxShadow:
          token.probability < 0.4
            ? '0 0 4px rgba(220, 38, 38, 0.5)'
            : 'none',
        outline: isActiveStep ? '2px solid #2563eb' : 'none',
        outlineOffset: '1px',
      }}
      onClick={() => onClickToken?.(index)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {displayToken}
      {(isActiveStep || stepMode) && (
        <sup
          className="text-[0.55em] font-bold ml-0.5 opacity-90"
          style={{ color: pct < 50 ? '#dc2626' : '#16a34a' }}
        >
          {pct}
        </sup>
      )}
      {hasStrongAlternatives && (
        <sup className="text-[0.6em] text-red-600 ml-0.5">&#9889;</sup>
      )}

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-[180px] pointer-events-none">
          <div className="mb-1">
            <span className="font-semibold">Token:</span>{' '}
            <span className="font-mono">{displayToken}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Sannolikhet:</span>{' '}
            {(token.probability * 100).toFixed(1)}%
          </div>
          {token.alternatives.length > 0 && (
            <div>
              <div className="font-semibold mb-1">Alternativ:</div>
              {token.alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-2"
                  style={{
                    color:
                      alt.probability > token.probability * 0.8
                        ? '#ff6b6b'
                        : 'inherit',
                  }}
                >
                  <span className="font-mono truncate">
                    {alt.token.replace(/Ġ/g, ' ')}
                  </span>
                  <span>{(alt.probability * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  )
}
