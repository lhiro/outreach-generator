import { OpenAPIHono } from '@hono/zod-openapi'
const app = new OpenAPIHono()
import { db } from '@/db'
import { getClients, updateClientStatus } from '@/schema'
import { eq, desc } from 'drizzle-orm'
import { clients } from '@/db/schema'

app.openapi(getClients, async c => {
  try {
    const result = await db.query.clients.findMany({
      orderBy: desc(clients.createdAt),
      where: eq(clients.userId, 'public'),
      columns: {
        userId: false
      }
    })
    return c.json({
      success: true,
      data: result
    })
  } catch (err) {
    console.log(err)
    return c.json({
      success: false,
      message: 'error to get client list'
    })
  }
})

app.openapi(updateClientStatus, async c => {
  try {
    const { id } = c.req.valid('param')
    const { status } = c.req.valid('json')
    await db.update(clients).set({
      status
    }).where(eq(clients.id, id))
    return c.json({
      success: true
    })
  } catch(err) {
    return c.json({
      success: false,
      message: 'error to update client status'
    })
  }
})

export default app
