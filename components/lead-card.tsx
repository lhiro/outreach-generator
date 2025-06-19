import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building, User } from 'lucide-react'
import type { IClientsListData } from '@/api/client/gen/model'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

type Lead = ArrayElement<IClientsListData['data']>
interface LeadCardProps {
  lead: Lead
  isDragging?: boolean
}

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export const LeadCard = React.memo(function LeadCard({
  lead,
  isDragging = false
}: LeadCardProps) {
  return (
    <Card
      className={`mb-3 cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg opacity-95' : 'shadow-sm hover:shadow-md'
      } transition-shadow duration-150`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {lead.name}
              </CardTitle>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{lead.company}</span>
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-3 h-3 mr-2 flex-shrink-0" />
          <span className="truncate">{lead.role}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs">
                linkedin
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <a href={lead.linkedin} target="_blank">
                {lead.linkedin}
              </a>
            </TooltipContent>
          </Tooltip>
          <span className="text-xs text-gray-500">
            Created {formatDate(lead.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
})