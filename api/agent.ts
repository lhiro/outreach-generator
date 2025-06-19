import { OpenAPIHono } from '@hono/zod-openapi'
import {
  generateText,
  streamText,
  smoothStream,
  generateObject,
  generateId
} from 'ai'
import { provider } from '@/lib/ai/providers'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { conversations, messages as dbMessages, clients } from '@/db/schema'
import { agent } from '@/schema'
import { z } from 'zod'

const app = new OpenAPIHono()

app.openapi(agent, async c => {
  const { id } = c.req.valid('param')
  const { messages, ...client } = c.req.valid('json')

  let isChat = false
  const clientData = { ...client }

  if (!client?.name) {
    isChat = true
    const { object } = await generateObject({
      model: provider.languageModel('chat'),
      system:
        'Generate a object with the following properties: name, role, company, linkedinUrl',
      prompt: messages[messages.length - 1].content,
      schema: z.object({
        name: z.string(),
        role: z.string(),
        company: z.string(),
        linkedinUrl: z.string().optional()
      })
    })
    if (object.name) {
      clientData.name = object.name
      clientData.role = object.role
      clientData.company = object.company
      clientData.linkedinUrl = object.linkedinUrl
    }
  }

  const clientPrompt = `
      name: ${clientData?.name}
      role: ${clientData?.role}
      company: ${clientData?.company}
      linkedin: ${clientData?.linkedinUrl}
  `

  console.log('conversation id -> ', id)
  const chatId = await db.query.conversations.findFirst({
    where: eq(conversations.id, id)
  })

  if (!chatId) {
    const { text: title } = await generateText({
      model: provider.languageModel('chat'),
      system: `you will generate a short title based on the first message
  ensure it is not more than 80 characters long
  the title should be a summary of the message
  do not use quotes or colons`,
      prompt: `friendly LinkedIn outreach message
        ${clientPrompt}
      `
    })
    await db.insert(conversations).values({
      id,
      title,
      userId: 'public'
    })
  }

  const result = streamText({
    model: provider.languageModel('chat'),
    prompt: clientPrompt,
    system: `Write a short, friendly LinkedIn outreach message to {{name}}, who is a {{role}} at {{company}}. Make it casual and under 500 characters.`,
    experimental_transform: smoothStream(),
    onFinish(res) {
      const { role, id: msgId } = res.response.messages[0]
      db.insert(dbMessages)
        .values({
          id: msgId,
          conversationId: id,
          role,
          content: res.text
        })
        .catch(err => {
          console.log('message insert error', err)
        })

      db.insert(clients)
        .values({
          id: generateId(32),
          userId: 'public',
          name: clientData?.name || 'unknown',
          role: clientData?.role || 'unknown',
          company: clientData?.company || 'unknown',
          linkedin: clientData?.linkedinUrl || '',
          conversationId: id
        })
        .catch(err => {
          console.log('client insert error', err)
        })
    }
  })

  return result.toDataStreamResponse({
    sendUsage: false,
    sendReasoning: true,
    sendSources: true,
    headers: {
      'content-type': 'text/event-stream;',
      'content-encoding': 'identity'
    }
  })
})

export default app
