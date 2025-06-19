import { OpenAPIHono } from '@hono/zod-openapi'
import { db } from '@/db'
import { getConversations, getMessages } from '@/schema'
import { eq, desc } from 'drizzle-orm'
import { conversations, messages } from '@/db/schema'

const app = new OpenAPIHono()
app.openapi(getConversations, async c => {
  try {
    const { page, pageSize } = c.req.valid('query')
    const offset = (parseInt(page) - 1) * parseInt(pageSize)
    const result = await db.query.conversations.findMany({
      columns: {
        userId: false
      },
      limit: parseInt(pageSize),
      offset: offset,
      where: eq(conversations.userId, 'public'),
      orderBy: desc(conversations.createdAt)
    })

    return c.json({
      success: true,
      data: result,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: result.length
      }
    })
  } catch (err) {
    console.log(err)
    return c.json({
      success: false,
      message: 'error to get conversation list'
    })
  }
})

app.openapi(getMessages, async c => {
  try {
    const { id } = c.req.valid('param')
    const result = await db.query.messages.findMany({
      columns: {
        conversationId: false
      },
      where: eq(messages.conversationId, id),
      orderBy: desc(messages.createdAt)
    })

    return c.json({
      success: true,
      data: result
    })
  } catch (err) {
    console.log(err)
    return c.json({
      success: false,
      message: 'error to get messages'
    })
  }
})

export default app
