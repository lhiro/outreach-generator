import { customProvider } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY
})

export const provider = customProvider({
  languageModels: {
    chat: openai('gpt-4o-mini')
  }
})