import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LeadCard } from './lead-card'
import type { IClientsListData } from '@/api/client/gen/model'

type Lead = ArrayElement<IClientsListData['data']>

interface SortableLeadCardProps {
  lead: Lead
}

export const SortableLeadCard = React.memo(function SortableLeadCard({
  lead
}: SortableLeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: lead.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <LeadCard lead={lead} isDragging={isDragging} />
    </div>
  )
})
