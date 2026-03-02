interface ChatCompletionRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  temperature: number
}

export async function fetchChat(request: ChatCompletionRequest) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(
      (errorData as { error?: string }).error || `HTTP ${response.status}`,
    )
  }

  return response.json()
}
