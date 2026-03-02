import { Router } from 'express'
import type { Request, Response } from 'express'

export const chatRouter = Router()

interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  temperature: number
}

chatRouter.post('/', async (req: Request, res: Response) => {
  const { messages, temperature } = req.body as ChatRequestBody

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured' })
    return
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required' })
    return
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: temperature ?? 0.7,
        top_p: 0.85,
        frequency_penalty: 0.8,
        presence_penalty: 0.6,
        logprobs: true,
        top_logprobs: 5,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      res.status(response.status).json({
        error: (errorData as Record<string, unknown>).error || 'OpenAI API error',
      })
      return
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
})
