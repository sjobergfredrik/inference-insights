export interface TokenAlternative {
  token: string
  probability: number
  logprob: number
}

export interface ProcessedToken {
  token: string
  probability: number
  logprob: number
  alternatives: TokenAlternative[]
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  tokens?: ProcessedToken[]
  temperature?: number
}
