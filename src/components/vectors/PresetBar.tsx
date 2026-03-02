interface Preset {
  label: string
  start: string
  subtract: string
  add: string
}

const PRESETS: Preset[] = [
  { label: 'Kungligheter', start: 'king', subtract: 'man', add: 'woman' },
  { label: 'Huvudstäder', start: 'paris', subtract: 'france', add: 'sweden' },
  { label: 'Pronomen', start: 'he', subtract: 'man', add: 'woman' },
  { label: 'Verbform', start: 'walking', subtract: 'walk', add: 'run' },
  { label: 'Tempus', start: 'think', subtract: 'thought', add: 'bought' },
  { label: 'Geografi', start: 'italy', subtract: 'rome', add: 'berlin' },
]

interface PresetBarProps {
  onSelect: (start: string, subtract: string, add: string) => void
}

export function PresetBar({ onSelect }: PresetBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-xs text-gray-400 self-center mr-1">Exempel:</span>
      {PRESETS.map(({ label, start, subtract, add }) => (
        <button
          key={label}
          onClick={() => onSelect(start, subtract, add)}
          className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white hover:bg-gray-50 hover:border-uu-red/30 text-gray-600 hover:text-uu-red transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
