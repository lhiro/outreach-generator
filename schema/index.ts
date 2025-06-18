import { createRoute } from '@hono/zod-openapi'
import { z } from 'zod'

export const agent = createRoute({
  method: 'post',
  path: '/agent/{id}',
  description: 'chat to agent',
  request: {
    params: z.object({
      id: z
        .string()
        .openapi({
          description: 'conversation id',
          example: '',
          param: {
            in: 'path'
          }
        })
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.string().openapi({
              description: 'message id'
            }),
            messages: z.array(z.object({
              role: z.enum(['data', 'system', 'user', 'assistant']),
              content: z.string().openapi({
                description: 'user message'
              }),
              parts: z.array(z.object({
                type: z.string(),
                text: z.string().optional()
              })).optional(),
            })),
            name: z.string().openapi({
              description: 'user name'
            }).optional(),
            role: z.string().openapi({
              description: 'user role'
            }).optional(),
            company: z.string().openapi({
              description: 'user company'
            }).optional(),
            linkedinUrl: z.string().openapi({
              description: 'user linkedin url'
            }).optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'answer'
    }
  }
})

