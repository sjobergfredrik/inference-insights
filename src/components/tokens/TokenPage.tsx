import { useChat } from '../../hooks/useChat.ts'
import { TokenControls } from './TokenControls.tsx'
import { ConversationView } from './ConversationView.tsx'
import { ChatInput } from './ChatInput.tsx'
import { ProbabilityChart } from './ProbabilityChart.tsx'
import { TemperatureViz } from './TemperatureViz.tsx'
import { ErrorMessage } from '../shared/ErrorMessage.tsx'

export function TokenPage() {
  const {
    messages,
    isLoading,
    error,
    temperature,
    setTemperature,
    stepMode,
    setStepMode,
    currentStep,
    setCurrentStep,
    sendMessage,
    lastAssistantMessage,
  } = useChat()

  const totalTokens = lastAssistantMessage?.tokens?.length ?? 0
  const currentToken =
    stepMode && lastAssistantMessage?.tokens
      ? lastAssistantMessage.tokens[currentStep]
      : null

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <TokenControls
        temperature={temperature}
        onTemperatureChange={setTemperature}
        stepMode={stepMode}
        onStepModeChange={setStepMode}
        currentStep={currentStep}
        totalTokens={totalTokens}
        onPrev={() => setCurrentStep(Math.max(0, currentStep - 1))}
        onNext={() =>
          setCurrentStep(Math.min(totalTokens - 1, currentStep + 1))
        }
      />

      {error && (
        <div className="px-6 pt-3">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <ConversationView
          messages={messages}
          isLoading={isLoading}
          stepMode={stepMode}
          currentStep={currentStep}
          onClickToken={stepMode ? setCurrentStep : undefined}
        />

        {stepMode && currentToken && (
          <div className="w-[380px] shrink-0 border-l border-gray-200 bg-gray-50/50 p-4 overflow-y-auto flex flex-col gap-6">
            <ProbabilityChart
              token={currentToken}
              currentStep={currentStep}
            />
            <TemperatureViz token={currentToken} />
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  )
}
