'use client'

import { cn } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useState,
  CSSProperties,
  useCallback,
  memo, useEffect
} from 'react'
import { motion } from 'framer-motion'
import { eventBus } from '@/utils/event'

interface Props {
  onSubmit: (data: { query: string }) => void
  loading?: boolean
  placeholder?: string
  tabStyle?: CSSProperties
  onTab?: () => void
  onChange?: (value: string) => void
  tabValue?: string
  className?: string
}

export const FormSchema = z.object({
  query: z.string().nonempty('Please enter a query')
})

export const ChatInput = memo(
  function ChatInput(props: Props) {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema)
    })
    const input = form.watch('query')
    const [focus, setFocus] = useState(false)
    const handleFocus = useCallback(() => {
      form.setFocus('query')
    }, [form])

    useEffect(() => {
      return eventBus.on('ChatInput:reset', () => {
        form.setValue('query', '')
      })
    }, [])

    return (
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
        onClick={handleFocus}
        className="w-full max-w-3xl cursor-text mx-auto"
      >
        <div
          className={cn(
            'relative bg-gray-50 border rounded-[24px] p-2 flex items-center',
            {
              'ring-2 ring-gray-500': focus
            }
          )}
        >
          <Form {...form}>
            <form
              onSubmit={(...rest) => {
                form.handleSubmit(props.onSubmit!)(...rest)
              }}
              className="w-full"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={props.placeholder}
                          className={cn(
                            'resize-none w-full shadow-none focus-visible:ring-0 border-none overflow-auto h-16'
                          )}
                          onFocus={() => setFocus(true)}
                          onKeyDown={ev => {
                            if (props.loading) return
                            if (ev.key === 'Enter' && !ev.shiftKey) {
                              ev.preventDefault()
                              ev.stopPropagation()
                              if (input?.length > 0) {
                                form.handleSubmit(props.onSubmit!)()
                              }
                            } else if (ev.key === 'Tab') {
                              if (!input?.length) {
                                ev.preventDefault()
                                ev.stopPropagation()
                                form.setValue('query', props?.tabValue || '')
                                props?.onTab?.()
                              }
                            }
                          }}
                          {...field}
                          onBlur={() => {
                            setFocus(false)
                            field.onBlur()
                          }}
                          onChange={ev => {
                            field.onChange(ev)
                            props?.onChange?.(ev.target.value)
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <div className="flex justify-end">
                <Button
                  disabled={!input || props.loading}
                  onClick={ev => ev.stopPropagation()}
                  className="rounded-full size-8 gap-1"
                  size="icon"
                  type="submit"
                >
                  {props.loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ArrowUp />
                  )}
                </Button>
              </div>
              {props.tabStyle && (
                <span
                  className="border-border text-foreground absolute top-[18px] inline-flex items-center rounded-md border px-1 py-0 text-xs font-medium"
                  style={props.tabStyle}
                >
                  tab
                </span>
              )}
            </form>
          </Form>
        </div>
      </motion.div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.tabStyle === nextProps.tabStyle &&
      prevProps.tabValue === nextProps.tabValue
    )
  }
)
