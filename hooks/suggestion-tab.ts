import { CSSProperties, useState, useCallback, useEffect } from 'react'
import { useTypingEffect } from '@/hooks/type-writer'

const suggestions = [
  'name, role, company, linkedinUrl',
  'Jane Doe, Product Manager, Acme Corp, https://www.linkedin.com/in/janedoe',
  '张伟, 产品经理, 星辰科技, https://www.linkedin.com/in/zhang-wei',
  'Macro, Developer, Investoday 团队, https://www.linkedin.com/in/macrooai',
  'Alice Smith, Growth Lead, FinTech Solutions, https://www.linkedin.com/in/alicesmith',
  '李华, 创始人, 创新实验室, https://www.linkedin.com/in/li-hua'
]

export const useSuggestionTab = (props: {
  onTab: (placeholder: string) => void
  input: string
  loading?: boolean
}) => {
  const [tabStyle, setTabStyle] = useState<CSSProperties>({ opacity: 0 })
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholder, setPlaceholder] = useState(suggestions[placeholderIndex])

  const initTabStyle = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = "14px 'Geist', 'Geist Fallback'"
    const textWidth = ctx.measureText(placeholder).width
    setTabStyle({
      left: `${textWidth + 30}px`,
      opacity: 1
    })
    canvas.remove()
  }

  const { typingText, start, reset, typing } = useTypingEffect(placeholder, {
    manual: true,
    speed: 20,
    pauseAfterTyping: 1,
    delay: 3000,
    enableDelete: true,
    complete() {
      initTabStyle()
    },
    deleteComplete() {
      const nextIndex = (placeholderIndex + 1) % suggestions.length
      setPlaceholder(suggestions[nextIndex])
      setPlaceholderIndex(nextIndex)
    },
    onDeleteStart() {
      setTabStyle({ opacity: 0 })
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      start()
    }, 1100)
    return () => {
      reset()
      clearTimeout(timer)
    }
  }, [placeholder, start])

  const handleTab = useCallback(() => {
    reset()
    props?.onTab(placeholder)
    setTabStyle({ opacity: 0 })
  }, [placeholder])

  useEffect(() => {
    if (props.input?.length > 0 || props.loading) {
      reset()
      setTabStyle({ opacity: 0 })
    } else if (props.input?.length === 0 && !typing) {
      const nextIndex = (placeholderIndex + 1) % suggestions.length
      setPlaceholder(suggestions[nextIndex])
      setPlaceholderIndex(nextIndex)
      start()
    }
  }, [props.input, props.loading])

  return {
    tabStyle,
    typingText,
    typing,
    start,
    reset,
    handleTab,
    placeholder
  }
}
