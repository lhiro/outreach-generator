import { useAppContext } from '@/context/app-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { HistoryIcon } from 'lucide-react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export const FloatBtn = () => {
  const { setConversationOpened } = useAppContext()

  return (
    <motion.div
      className="fixed bottom-10 right-10"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
    >
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full"
              size="icon"
              onClick={() => setConversationOpened(true)}
            >
              <HistoryIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Recent History</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  )
}
