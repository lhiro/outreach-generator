'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { DroppableColumn } from './droppable-column'
import { LeadCard } from './lead-card'
import {
  IClientsListData,
  IClientUpdatePayloadStatusEnum,
  IDataStatusEnum
} from '@/api/client/gen/model'
import api from '@/api/client/api'
import { toast } from 'sonner'

type StatusKey = `${IDataStatusEnum}`

interface Column {
  id: StatusKey
  title: string
  leadIds: string[]
}

type Lead = ArrayElement<IClientsListData['data']>

const buildInitialColumns = (): Record<IDataStatusEnum, Column> => ({
  draft: { id: 'draft', title: 'Draft', leadIds: [] },
  approved: { id: 'approved', title: 'Approved', leadIds: [] },
  sent: { id: 'sent', title: 'Sent', leadIds: [] }
})

export const LeadManagement = () => {
  const [leads, setLeads] = useState<Record<string, Lead>>({})
  const [columns, setColumns] =
    useState<Record<IDataStatusEnum, Column>>(buildInitialColumns)
  const [activeId, setActiveId] = useState<string | null>(null)
  const startContainerRef = useRef<IDataStatusEnum | null>(null)

  const updateStatus = useCallback(
    async (id: string, status: IDataStatusEnum) => {
      try {
        const {
          data: { success }
        } = await api.clientUpdate(id, {
          status: status as unknown as IClientUpdatePayloadStatusEnum
        })
        if (success) {
          toast.success('Status updated successfully')
        } else {
          toast.error('Status update failed')
        }
      } catch {
        toast.error('Ops, something went wrong')
      }
    },
    []
  )

  useEffect(() => {
    api.clientsList().then(res => {
      const data = res.data.data ?? []
      const freshColumns = buildInitialColumns()
      const freshLeads: Record<string, Lead> = {}
      data.forEach(lead => {
        freshColumns[lead.status].leadIds.push(lead.id)
        freshLeads[lead.id] = lead
      })
      setColumns(freshColumns)
      setLeads(freshLeads)
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  )

  const containerMap = useMemo(() => {
    const map: Record<string, IDataStatusEnum> = {}
    Object.values(columns).forEach(col =>
      col.leadIds.forEach(id => (map[id] = col.id as IDataStatusEnum))
    )
    return map
  }, [columns])

  const findContainer = useCallback(
    (id: string) =>
      id in columns ? (id as IDataStatusEnum) : containerMap[id],
    [columns, containerMap]
  )

  const handleDragStart = useCallback(
    (e: DragStartEvent) => {
      setActiveId(e.active.id as string)
      startContainerRef.current = findContainer(e.active.id as string)
    },
    [findContainer]
  )

  const handleDragOver = useCallback(
    (e: DragOverEvent) => {
      const { active, over } = e
      if (!over) return
      const activeId = active.id as string
      const overId = over.id as string
      const activeContainer = findContainer(activeId)
      const overContainer =
        findContainer(overId) ?? (overId as IDataStatusEnum)
      if (!activeContainer || !overContainer) return
      if (activeContainer !== overContainer) return

      setColumns(prev => {
        const next = { ...prev }
        const items = next[activeContainer].leadIds
        const oldIndex = items.indexOf(activeId)
        const newIndex = items.indexOf(overId)
        if (oldIndex !== newIndex) {
          next[activeContainer].leadIds = arrayMove(items, oldIndex, newIndex)
        }
        return next
      })
    },
    [findContainer]
  )

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e
      if (!over) {
        setActiveId(null)
        startContainerRef.current = null
        return
      }
      const activeId = active.id as string
      const overId = over.id as string
      const startContainer = startContainerRef.current
      const endContainer = findContainer(overId) ?? (overId as IDataStatusEnum)

      if (!startContainer || !endContainer) {
        setActiveId(null)
        startContainerRef.current = null
        return
      }

      if (startContainer === endContainer) {
        const activeIndex = columns[endContainer].leadIds.indexOf(activeId)
        const overIndex = columns[endContainer].leadIds.indexOf(overId)
        if (activeIndex !== overIndex) {
          setColumns(prev => ({
            ...prev,
            [endContainer]: {
              ...prev[endContainer],
              leadIds: arrayMove(
                prev[endContainer].leadIds,
                activeIndex,
                overIndex
              )
            }
          }))
        }
      } else {
        setColumns(prev => ({
          ...prev,
          [startContainer]: {
            ...prev[startContainer],
            leadIds: prev[startContainer].leadIds.filter(id => id !== activeId)
          },
          [endContainer]: {
            ...prev[endContainer],
            leadIds: [...prev[endContainer].leadIds, activeId]
          }
        }))
        setLeads(prev => ({
          ...prev,
          [activeId]: { ...prev[activeId], status: endContainer }
        }))
        updateStatus(activeId, endContainer)
      }
      setActiveId(null)
      startContainerRef.current = null
    },
    [findContainer, columns, updateStatus]
  )

  const activeLead = useMemo(
    () => (activeId ? leads[activeId] : null),
    [activeId, leads]
  )

  const columnsWithLeads = useMemo(
    () =>
      Object.values(IDataStatusEnum).map((id: IDataStatusEnum) => ({
        column: columns[id],
        leads: columns[id].leadIds.map(lid => leads[lid])
      })),
    [columns, leads]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-2">
            Organize and track your sales leads by dragging them between columns
          </p>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columnsWithLeads.map(({ column, leads }) => (
              <DroppableColumn key={column.id} column={column} leads={leads} />
            ))}
          </div>
          <DragOverlay
            dropAnimation={{
              duration: 150,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
            }}
          >
            {activeLead && <LeadCard lead={activeLead} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
