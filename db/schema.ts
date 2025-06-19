import { pgTable, text, varchar, timestamp, index } from 'drizzle-orm/pg-core'

export type Role = 'data' | 'system' | 'user' | 'assistant' | 'tool'
export type Status = 'draft' | 'approved' | 'sent'

export const messages = pgTable(
  'messages',
  {
    id: varchar('id', { length: 256 }).primaryKey(),
    conversationId: varchar('conversation_id', { length: 256 })
      .notNull()
      .references(() => conversations.id),
    role: varchar('role', { length: 256 }).$type<Role>(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  table => ({
    idxMessagesConversationId: index('idx_messages_conversation_id').on(
      table.conversationId
    )
  })
)

export const conversations = pgTable('conversations', {
  id: varchar('id', { length: 256 }).primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  title: varchar('title', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const clients = pgTable('clients', {
  id: varchar('id', { length: 256 }).primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  role: varchar('role', { length: 256 }).notNull(),
  company: varchar('company', { length: 256 }).notNull(),
  linkedin: varchar('linkedin', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  conversationId: varchar('conversation_id', { length: 256 }).notNull(),
  status: varchar('status', { length: 256 })
    .default('draft')
    .$type<Status>()
    .notNull()
})
