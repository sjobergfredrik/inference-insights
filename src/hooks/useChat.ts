import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, ProcessedToken } from '../types/tokens.ts'
import { fetchChat } from '../lib/api.ts'

interface OpenAILogprob {
  token: string
  logprob: number
  top_logprobs: Array<{ token: string; logprob: number }>
}

interface OpenAIResponse {
  choices: Array<{
    message: { content: string }
    logprobs: { content: OpenAILogprob[] }
  }>
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.3)
  const [stepMode, setStepMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const idCounter = useRef(0)

  const lastAssistantMessage = messages.filter((m) => m.type === 'assistant').at(-1) ?? null

  // Reset step when new message arrives
  useEffect(() => {
    if (lastAssistantMessage) {
      setCurrentStep(0)
    }
  }, [lastAssistantMessage?.id])

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isLoading) return

      setError(null)

      const userMessage: ChatMessage = {
        id: `msg-${++idCounter.current}`,
        type: 'user',
        content: prompt.trim(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const messagesForApi = [...messages, userMessage].map((m) => ({
          role: m.type === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }))

        const data = (await fetchChat({
          messages: messagesForApi,
          temperature,
        })) as OpenAIResponse

        const choice = data.choices[0]
        const logprobs = choice.logprobs.content

        const processedTokens: ProcessedToken[] = logprobs.map((lp) => ({
          token: lp.token,
          probability: Math.exp(lp.logprob),
          logprob: lp.logprob,
          alternatives: lp.top_logprobs.map((alt) => ({
            token: alt.token,
            probability: Math.exp(alt.logprob),
            logprob: alt.logprob,
          })),
        }))

        const assistantMessage: ChatMessage = {
          id: `msg-${++idCounter.current}`,
          type: 'assistant',
          content: choice.message.content,
          tokens: processedTokens,
          temperature,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Något gick fel')
      } finally {
        setIsLoading(false)
      }
    },
    [messages, temperature, isLoading],
  )

  return {
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
  }
}
