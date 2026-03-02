import { useRef, useEffect } from 'react'
import type { ChatMessage } from '../../types/tokens.ts'
import { UserMessage } from './UserMessage.tsx'
import { AssistantMessage } from './AssistantMessage.tsx'

interface ConversationViewProps {
  messages: ChatMessage[]
  isLoading: boolean
  stepMode: boolean
  currentStep: number
  onClickToken?: (index: number) => void
}

export function ConversationView({
  messages,
  isLoading,
  stepMode,
  currentStep,
  onClickToken,
}: ConversationViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, currentStep])

  const lastAssistantIdx = messages
    .map((m, i) => (m.type === 'assistant' ? i : -1))
    .filter((i) => i >= 0)
    .at(-1)

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <p className="text-lg mb-2">Skriv ett meddelande för att börja</p>
          <p className="text-sm">
            Varje ord i svaret kommer att färgkodas efter hur säker modellen var.
          </p>
        </div>
      )}
      {messages.map((msg, i) =>
        msg.type === 'user' ? (
          <UserMessage key={msg.id} content={msg.content} />
        ) : (
          <AssistantMessage
            key={msg.id}
            message={msg}
            isLastMessage={i === lastAssistantIdx}
            stepMode={stepMode}
            currentStep={currentStep}
            onClickToken={onClickToken}
          />
        ),
      )}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-white px-4 py-3 rounded-xl shadow-sm text-gray-400 italic text-sm">
            Tänker...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
