import { getProbabilityColor } from '../../lib/colors.ts'

interface TokenControlsProps {
  temperature: number
  onTemperatureChange: (t: number) => void
  stepMode: boolean
  onStepModeChange: (s: boolean) => void
  currentStep: number
  totalTokens: number
  onPrev: () => void
  onNext: () => void
}

export function TokenControls({
  temperature,
  onTemperatureChange,
  stepMode,
  onStepModeChange,
  currentStep,
  totalTokens,
  onPrev,
  onNext,
}: TokenControlsProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex flex-wrap items-center gap-6">
        {/* Temperature */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-600">
            Temperatur
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-40 accent-uu-red"
          />
          <span className="text-xs font-mono text-gray-500 w-6 text-right">
            {temperature.toFixed(1)}
          </span>
        </div>

        {/* Step mode */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={stepMode}
              onChange={(e) => onStepModeChange(e.target.checked)}
              className="accent-uu-red"
            />
            Steg-läge
          </label>
          {stepMode && totalTokens > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr;
              </button>
              <span className="text-xs font-mono text-gray-500 min-w-[60px] text-center">
                {currentStep + 1} / {totalTokens}
              </span>
              <button
                onClick={onNext}
                disabled={currentStep >= totalTokens - 1}
                className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-gray-400">Säkerhet:</span>
          {[
            { label: 'Låg', prob: 0.1 },
            { label: 'Medel', prob: 0.5 },
            { label: 'Hög', prob: 0.9 },
          ].map(({ label, prob }) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: getProbabilityColor(prob) }}
              />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
