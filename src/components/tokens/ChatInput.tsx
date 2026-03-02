import { useState } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1200px] mx-auto flex gap-3 p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv ditt meddelande här..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-uu-red focus:ring-2 focus:ring-uu-red/10 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-uu-red-dark text-white rounded-lg text-sm font-medium hover:bg-uu-red-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Skickar...' : 'Skicka'}
        </button>
      </form>
    </div>
  )
}
