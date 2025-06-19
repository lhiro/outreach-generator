import { createRoute } from '@hono/zod-openapi'
import { conversations, messages, clients } from '@/db/schema'
import { z } from 'zod'
import { toZod } from '@/utils/schema'

const overwrite = {
  createdAt: z.date().openapi({
    format: 'date-time'
  })
}

export const agent = createRoute({
  method: 'post',
  path: '/agent/{id}',
  description: 'chat to agent',
  request: {
    params: z.object({
      id: z.string().openapi({
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
            messages: z.array(
              z.object({
                role: z.enum(['data', 'system', 'user', 'assistant']),
                content: z.string().openapi({
                  description: 'user message'
                }),
                parts: z
                  .array(
                    z.object({
                      type: z.string(),
                      text: z.string().optional()
                    })
                  )
                  .optional()
              })
            ),
            name: z
              .string()
              .openapi({
                description: 'user name'
              })
              .optional(),
            role: z
              .string()
              .openapi({
                description: 'user role'
              })
              .optional(),
            company: z
              .string()
              .openapi({
                description: 'user company'
              })
              .optional(),
            linkedinUrl: z
              .string()
              .openapi({
                description: 'user linkedin url'
              })
              .optional()
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

export const getConversations = createRoute({
  path: '/conversations',
  method: 'get',
  description: 'get conversations',
  request: {
    query: z.object({
      page: z.string().openapi({
        description: 'page number',
        example: '1'
      }),
      pageSize: z.string().openapi({
        description: 'page size',
        example: '10'
      })
    })
  },
  responses: {
    200: {
      description: 'success to get conversation list',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z
              .array(
                toZod(conversations, {
                  omit: ['userId'],
                  overwrite
                })
              )
              .optional(),
            message: z.string().optional(),
            pagination: z
              .object({
                page: z.number(),
                pageSize: z.number(),
                total: z.number()
              })
              .optional()
          })
        }
      }
    }
  }
})

export const getClients = createRoute({
  method: 'get',
  path: '/clients',
  request: {},
  responses: {
    200: {
      description: 'get all clients',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z
              .array(
                toZod(clients, {
                  omit: ['userId'],
                  overwrite: {
                    ...overwrite,
                    linkedin: z.string().optional(),
                    status: z.enum(['draft', 'approved', 'sent'])
                  }
                })
              )
              .optional()
          })
        }
      }
    }
  }
})

export const getMessages = createRoute({
  method: 'get',
  path: '/conversation/{id}',
  description: 'get all messages by conversation id',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'conversation id',
        example: '',
        param: {
          in: 'path'
        }
      })
    })
  },
  responses: {
    200: {
      description: 'get all messages by conversation id',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z
              .array(
                toZod(messages, {
                  omit: ['conversationId'],
                  overwrite
                })
              )
              .optional()
          })
        }
      }
    }
  }
})


export const updateClientStatus = createRoute({
  method: 'put',
  path: '/client/{id}',
  description: 'update client status',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'client id',
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
            status: z.enum(['draft', 'approved','sent'])
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'update client status',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean()
          })
        }
      }
    }
  }
})