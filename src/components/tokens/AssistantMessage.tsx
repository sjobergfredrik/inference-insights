import type { ChatMessage } from '../../types/tokens.ts'
import { TokenSpan } from './TokenSpan.tsx'

interface AssistantMessageProps {
  message: ChatMessage
  isLastMessage: boolean
  stepMode: boolean
  currentStep: number
  onClickToken?: (index: number) => void
}

export function AssistantMessage({
  message,
  isLastMessage,
  stepMode,
  currentStep,
  onClickToken,
}: AssistantMessageProps) {
  const tokens = message.tokens ?? []
  // Only slice tokens on the last message when in step mode
  const visibleTokens =
    isLastMessage && stepMode ? tokens.slice(0, currentStep + 1) : tokens

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="text-xs text-gray-400 mb-1">Assistent</div>
        <div className="bg-white px-4 py-3 rounded-xl shadow-sm">
          <div className="leading-[1.8] whitespace-pre-wrap">
            {visibleTokens.map((token, i) => (
              <TokenSpan
                key={i}
                token={token}
                index={i}
                isActiveStep={isLastMessage && stepMode && i === currentStep}
                stepMode={isLastMessage && stepMode}
                onClickToken={isLastMessage ? onClickToken : undefined}
              />
            ))}
            {isLastMessage && stepMode && visibleTokens.length < tokens.length && (
              <span className="text-gray-300 ml-1">|</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
