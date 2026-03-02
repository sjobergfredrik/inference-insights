interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%]">
        <div className="text-xs text-gray-400 text-right mb-1">Du</div>
        <div className="bg-uu-red-dark text-white px-4 py-3 rounded-xl shadow-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  )
}
