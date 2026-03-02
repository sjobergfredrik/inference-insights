import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ProcessedToken } from '../../types/tokens.ts'
import { applySoftmax } from '../../lib/temperature.ts'

interface TemperatureVizProps {
  token: ProcessedToken
}

export function TemperatureViz({ token }: TemperatureVizProps) {
  const logprobs = [
    token.logprob,
    ...token.alternatives
      .filter((a) => a.token !== token.token)
      .map((a) => a.logprob),
  ]
  const labels = [
    token.token.replace(/Ġ/g, ' ').trim() || '(space)',
    ...token.alternatives
      .filter((a) => a.token !== token.token)
      .map((a) => a.token.replace(/Ġ/g, ' ').trim() || '(space)'),
  ]

  const lowTemp = applySoftmax(logprobs, 0.3)
  const highTemp = applySoftmax(logprobs, 1.0)

  const data = labels.map((label, i) => ({
    token: label,
    low: lowTemp[i],
    high: highTemp[i],
  }))

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-600 mb-3">
        Temperaturens effekt
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <MiniChart data={data} dataKey="low" label="T = 0.3 (fokuserad)" color="#af272f" />
        <MiniChart data={data} dataKey="high" label="T = 1.0 (kreativ)" color="#9ca3af" />
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Lägre temperatur = modellen väljer säkrare. Högre = mer slumpmässigt.
      </p>
    </div>
  )
}

function MiniChart({
  data,
  dataKey,
  label,
  color,
}: {
  data: Array<Record<string, string | number>>
  dataKey: string
  label: string
  color: string
}) {
  return (
    <div>
      <div className="text-[10px] text-gray-500 text-center mb-1">{label}</div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 5 }}>
          <XAxis type="number" domain={[0, 1]} hide />
          <YAxis
            type="category"
            dataKey="token"
            width={55}
            tick={{ fontSize: 8, fontFamily: 'monospace' }}
          />
          <Bar dataKey={dataKey} radius={[0, 2, 2, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? color : '#d1d5db'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
