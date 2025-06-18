import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Message as AIMessage } from '@ai-sdk/react'
import { useAppContext } from '@/context/app-context'
import { X } from 'lucide-react'
import { Message } from '@/components/message'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

export const ConversationDrawer = ({
  messages,
  loading,
  error
}: {
  messages: AIMessage[]
  loading?: boolean
  error?: Error
}) => {
  const { conversationOpened, setConversationOpened } = useAppContext()
  return (
    <Drawer open={conversationOpened} direction="right">
      <DrawerContent className="md:data-[vaul-drawer-direction=right]:max-w-[500px] data-[vaul-drawer-direction=right]:max-w-sm">
        <div className="mx-auto w-full md:max-w-full max-w-sm flex-col flex h-[100vh]">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex justify-between items-center">
                Generated messages
                <Button
                  onClick={() => {
                    setConversationOpened(false)
                  }}
                  className="rounded-full"
                  variant="ghost"
                  size="icon"
                >
                  <X />
                </Button>
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <div className="pb-10 flex flex-col flex-1 space-y-8 overflow-y-auto">
            {messages.map(message => (
              <Message key={message.id} {...message} />
            ))}
            {loading && !error && (
              <motion.div
                className="px-6 space-y-3"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
              >
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </motion.div>
            )}

            {error && (
              <motion.div
                className="px-6 space-y-3"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
              >
                <div className="text-red-500">{error.message}</div>
              </motion.div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
