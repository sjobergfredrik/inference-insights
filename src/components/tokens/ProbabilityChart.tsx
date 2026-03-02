import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ProcessedToken } from '../../types/tokens.ts'

interface ProbabilityChartProps {
  token: ProcessedToken
  currentStep: number
}

export function ProbabilityChart({ token, currentStep }: ProbabilityChartProps) {
  const data = [
    {
      token: token.token.replace(/Ġ/g, ' ').trim() || '(space)',
      probability: token.probability,
      isSelected: true,
    },
    ...token.alternatives
      .filter((alt) => alt.token !== token.token)
      .map((alt) => ({
        token: alt.token.replace(/Ġ/g, ' ').trim() || '(space)',
        probability: alt.probability,
        isSelected: false,
      })),
  ].sort((a, b) => b.probability - a.probability)

  const otherMass = Math.max(
    0,
    1 - data.reduce((sum, d) => sum + d.probability, 0),
  )

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-600 mb-3">
        Token-sannolikheter (steg {currentStep + 1})
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            type="category"
            dataKey="token"
            width={80}
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
          />
          <Tooltip
            formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
            labelStyle={{ fontFamily: 'monospace' }}
          />
          <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isSelected ? '#af272f' : '#9ca3af'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <VocabContext otherMass={otherMass} shownCount={data.length} />
    </div>
  )
}

function VocabContext({
  otherMass,
  shownCount,
}: {
  otherMass: number
  shownCount: number
}) {
  return (
    <div className="mt-3 text-xs text-gray-400 text-center">
      Visar {shownCount} av ~100 000 möjliga tokens
      {otherMass > 0.001 && (
        <span> ({(otherMass * 100).toFixed(1)}% fördelat på resten)</span>
      )}
    </div>
  )
}
