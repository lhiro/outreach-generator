import { cn } from '@/lib/utils'
import { SparklesIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { MarkdownRender } from '@/components/markdown'
import { Message as AIMessage } from '@ai-sdk/react'
import { CopyBtn } from '@/components/copy-btn'

export const Message = (message: AIMessage) => {
  const { role, parts, id } = message
  const skips = parts
    ?.filter(part => part.type !== 'text' || (part.type === 'text' && part.text))

  if (!skips?.length) return;

  return (
    <motion.div
      data-testid={`message-${role}`}
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={role}
    >
      <div
        className={cn(
          'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit'
        )}
      >
        {role === 'assistant' && (
          <div className="size-8 -mt-1 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
            <div className="translate-y-px">
              <SparklesIcon size={14} />
            </div>
          </div>
        )}

        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: role === 'assistant' ? 0.3 : 0
          }}
          className={cn('flex flex-col gap-4 w-full')}
        >
          {parts
            ?.map((part, index) => {
              const { type } = part
              const key = `message-${id}-part-${index}`

              if (type === 'reasoning') {
                return part.reasoning
              }

              if (type === 'text' && part.text) {
                return (
                  <div key={key} className="flex flex-row gap-2 items-start">
                    <div
                      data-testid="message-content"
                      className={cn('flex flex-col gap-4', {
                        'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                          role === 'user'
                      })}
                    >
                      <MarkdownRender>{part.text}</MarkdownRender>
                    </div>
                  </div>
                )
              }

              if (type === 'tool-invocation') {
                const { toolInvocation } = part
                const { toolName, toolCallId, state } = toolInvocation

                if (state === 'call') {
                  const { args } = toolInvocation

                  return (
                    <div
                      key={toolCallId}
                      className={cn({
                        skeleton: ['getWeather'].includes(toolName)
                      })}
                    >
                      {toolName}
                    </div>
                  )
                }

                if (state === 'result') {
                  const { result } = toolInvocation

                  return <div key={toolCallId}>{result}</div>
                }
              }
            })}
        </motion.div>
      </div>
      {role === 'assistant' && (
        <motion.div
          className="mt-3 pl-10"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.5
          }}
        >
          <CopyBtn
            code={message.parts
              ?.filter(part => part.type === 'text')
              .map(part => part.text)
              .join('\n')
              .trim()}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
