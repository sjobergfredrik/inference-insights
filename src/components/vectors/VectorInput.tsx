interface VectorInputProps {
  startWord: string
  subtractWord: string
  addWord: string
  onStartChange: (v: string) => void
  onSubtractChange: (v: string) => void
  onAddChange: (v: string) => void
  onSubmit: () => void
  isLoading: boolean
  hasWord: (word: string) => boolean
  ready: boolean
}

export function VectorInput({
  startWord,
  subtractWord,
  addWord,
  onStartChange,
  onSubtractChange,
  onAddChange,
  onSubmit,
  isLoading,
  hasWord,
  ready,
}: VectorInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const inputClass = (word: string) => {
    const base =
      'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-uu-red/20'
    if (!ready || !word.trim()) return `${base} border-gray-300 focus:border-uu-red`
    if (hasWord(word)) return `${base} border-green-300 focus:border-green-500`
    return `${base} border-red-300 focus:border-red-500`
  }

  const wordStatus = (word: string) => {
    if (!ready || !word.trim()) return null
    if (hasWord(word)) return null
    return (
      <span className="text-xs text-red-500 mt-0.5 block">
        Finns inte i ordlistan
      </span>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Start (+)
          </label>
          <input
            type="text"
            value={startWord}
            onChange={(e) => onStartChange(e.target.value)}
            placeholder="t.ex. king"
            className={inputClass(startWord)}
          />
          {wordStatus(startWord)}
        </div>

        <span className="text-xl font-bold text-uu-red pb-2 hidden md:block">
          &minus;
        </span>

        <div className="flex-1 min-w-[120px]">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Subtrahera (&minus;)
          </label>
          <input
            type="text"
            value={subtractWord}
            onChange={(e) => onSubtractChange(e.target.value)}
            placeholder="t.ex. man"
            className={inputClass(subtractWord)}
          />
          {wordStatus(subtractWord)}
        </div>

        <span className="text-xl font-bold text-uu-dark pb-2 hidden md:block">
          +
        </span>

        <div className="flex-1 min-w-[120px]">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Addera (+)
          </label>
          <input
            type="text"
            value={addWord}
            onChange={(e) => onAddChange(e.target.value)}
            placeholder="t.ex. woman"
            className={inputClass(addWord)}
          />
          {wordStatus(addWord)}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            !startWord.trim() ||
            !subtractWord.trim() ||
            !addWord.trim()
          }
          className="px-6 py-2 bg-uu-dark text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Beräknar...' : 'Beräkna'}
        </button>
      </div>
    </form>
  )
}
