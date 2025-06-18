'use client'

import { createContext, useContext } from 'use-context-selector'
import { useState, ReactNode, useEffect, useCallback } from 'react'
import { generateId } from 'ai'

type AppContextType = {
  conversationOpened: boolean
  setConversationOpened: (open: boolean) => void
  currentConversationId: string | null
  setCurrentConversationId: (id: string | null) => void
  resetConversationId: () => void
}

export const AppContext = createContext<AppContextType>({
  conversationOpened: false,
  setConversationOpened: (open: boolean) => {},
  currentConversationId: null,
  setCurrentConversationId: (id: string | null) => {},
  resetConversationId: () => {}
})

export const AppContextProvider = (props: {
  children: ReactNode
}) => {
  const [conversationOpened, setConversationOpened] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(generateId(16))
  const resetConversationId = useCallback(() => {
    setCurrentConversationId(generateId(16))
  }, [])

  return (
    <AppContext.Provider value={{
      conversationOpened,
      setConversationOpened,
      currentConversationId,
      setCurrentConversationId,
      resetConversationId
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
