'use client'

import React, { useRef } from 'react'
import { ChatInput } from '@/components/chat-input'
import { LeadForm } from '@/components/lead-form'
import { ConversationDrawer } from '@/components/conversation-drawer'
import { useChat } from '@ai-sdk/react'
import { useSuggestionTab } from '@/hooks/suggestion-tab'
import { useAppContext } from '@/context/app-context'
import { toast } from 'sonner'
import { eventBus } from '@/utils/event'
import { FloatBtn } from '@/components/float-btn'

const ChatInputWithSuggestion = React.memo(
  function ChatInputWithSuggestion({
    onSubmit,
    onChange,
    loading,
    input
  }: {
    onChange: (input: string) => void
    input: string
    onSubmit: (data: { query: string }) => void
    loading?: boolean
  }) {
    const { typingText, handleTab, placeholder, tabStyle } = useSuggestionTab({
      loading,
      onTab(placeholder) {
        onChange(placeholder)
      },
      input
    })
    return (
      <ChatInput
        tabValue={placeholder}
        placeholder={typingText}
        onTab={handleTab}
        onChange={onChange}
        onSubmit={onSubmit}
        tabStyle={tabStyle}
        loading={loading}
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.input === nextProps.input &&
      prevProps.loading === nextProps.loading
    )
  }
)

export const Content = () => {
  const { currentConversationId, setConversationOpened, conversationOpened } =
    useAppContext()

  const { handleSubmit, setInput, input, messages, status, error } = useChat({
    api: `/api/agent/${currentConversationId}`,
    initialMessages: [],
    onFinish: () => {
      eventBus.emit('ChatInput:reset')
    },
    onError() {
      toast.error('Ops, something went wrong')
      eventBus.emit('ChatInput:reset')
    }
  })

  const onSubmit = async (data: {
    query?: string
    name?: string
    role?: string
    company?: string
    linkedinUrl?: string
  }) => {
    setConversationOpened(true)
    if (data.query) {
      handleSubmit(undefined, {
        body: {
          id: currentConversationId
        }
      })
    } else {
      handleSubmit(undefined, {
        body: {
          id: currentConversationId,
          ...data
        },
        allowEmptySubmit: true
      })
    }
  }
  const isLoading = status !== 'ready' && status !== 'error'

  return (
    <>
      <ChatInputWithSuggestion
        onChange={setInput}
        onSubmit={onSubmit}
        input={input}
        loading={isLoading}
      />
      <LeadForm loading={isLoading} onSubmit={onSubmit} />
      <ConversationDrawer
        error={error}
        loading={status !== 'streaming' && status !== 'ready'}
        messages={messages}
      />
      {Boolean(messages.length) && <FloatBtn />}
    </>
  )
}
