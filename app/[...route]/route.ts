import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/vercel'

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[]
    <T>(id: string): T
  }
}
const apiContext = require.context('@/api', false, /\.ts$/)

const app = new OpenAPIHono()

apiContext.keys().forEach((key: string) => {
  const m = apiContext<{ default: OpenAPIHono }>(key)
  if (m.default) {
    app.route('/api', m.default)
  }
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Outreach Generator API'
  }
})
app.get('/ui', swaggerUI({ url: '/doc' }))

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)
