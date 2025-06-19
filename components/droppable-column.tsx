'use client'

import React, { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Badge } from '@/components/ui/badge'
import { SortableLeadCard } from './sortable-lead-card'
import type { IClientsListData } from '@/api/client/gen/model'

type Lead = ArrayElement<IClientsListData['data']>

interface Column {
  id: string
  title: string
  leadIds: string[]
}

interface DroppableColumnProps {
  column: Column
  leads: Lead[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'approved':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'sent':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const DroppableColumn = React.memo(function DroppableColumn({
  column,
  leads
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id
  })

  const leadIds = useMemo(() => leads.map(lead => lead.id), [leads])
  const statusColorClass = useMemo(() => getStatusColor(column.id), [column.id])

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-fit">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg capitalize text-gray-900">
            {column.title}
          </h2>
          <Badge variant="secondary" className={statusColorClass}>
            {leads.length}
          </Badge>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`p-4 min-h-[600px] ${isOver ? 'bg-blue-50/50' : ''} transition-colors duration-150`}
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <SortableLeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
})
