import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import copy from 'copy-to-clipboard'
import { CopyIcon } from 'lucide-react'
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { toast } from 'sonner'

export const CopyBtn = ({ code }: { code?: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!code) return toast.error('There\'s no text to copy!')
    copy(code)
    setCopied(true)
    toast.success('Copied to clipboard!');
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="ghost"
              onClick={handleCopy} >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? 'Copied' : 'Copy'}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}