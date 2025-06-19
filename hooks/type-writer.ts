import { useState, useEffect, useRef, useCallback } from 'react'

interface TypingEffectOptions {
  speed?: number
  deleteSpeed?: number
  delay?: number
  enableDelete?: boolean
  pauseAfterTyping?: number
  complete?: () => void
  deleteComplete?: () => void
  manual?: boolean
  randomSpeed?: boolean
  calcDelay?: (text: string) => number
  onTyping?: () => void
  onDeleteStart?: () => void
  [key: string]: any
}

/**
 * 通用打字逻辑
 * @param text 文本
 * @param options 配置项
 * @param options.speed 打字速度
 * @param options.deleteSpeed 删除速度
 * @param options.delay 停顿时间
 * @param options.enableDelete 是否允许删除
 * @param options.pauseAfterTyping 打字完成后停顿时间
 * @param options.complete 打字完成回调
 * @param options.deleteComplete 删除完成回调
 * @param options.manual 是否手动触发
 * @param options.calcDelay 计算停顿时间
 */
export const useTypingEffect = (
  text: string,
  options: TypingEffectOptions = {}
) => {
  const [typingText, setTypingText] = useState('')
  const [typing, setTyping] = useState(!options.manual)
  const charIndexRef = useRef(0)
  const isDeletingRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout>(null)

  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const start = useCallback(
    (action?: string) => {
      const currentOptions = optionsRef.current
      currentOptions?.onTyping?.()

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      if (!action) {
        setTyping(true)
      }

      const typeNextChar = () => {
        if (!isDeletingRef.current && charIndexRef.current < text?.length) {
          setTypingText(text.substring(0, charIndexRef.current + 1))
          charIndexRef.current += 1

          const currentSpeed = currentOptions.randomSpeed
            ? Math.max(
                (currentOptions.speed as number) * (0.1 + Math.random()),
                20
              )
            : (currentOptions.speed as number)

          timerRef.current = setTimeout(
            () => typeNextChar(),
            currentSpeed + (currentOptions?.pauseAfterTyping as number)
          )
        } else if (
          isDeletingRef.current &&
          charIndexRef.current > 0 &&
          currentOptions.enableDelete
        ) {
          if (charIndexRef.current === text?.length) {
            currentOptions?.onDeleteStart?.()
          }
          setTypingText(text.substring(0, charIndexRef.current - 1))
          charIndexRef.current -= 1
          timerRef.current = setTimeout(
            () => typeNextChar(),
            currentOptions.deleteSpeed
          )
        } else if (
          charIndexRef.current === text?.length &&
          !isDeletingRef.current
        ) {
          isDeletingRef.current = true
          const calcDelay =
            currentOptions?.calcDelay?.(text) || currentOptions.delay
          timerRef.current = setTimeout(() => typeNextChar(), calcDelay)
          if (currentOptions.complete) {
            setTyping(false)
            currentOptions.complete()
          }
        } else if (isDeletingRef.current && charIndexRef.current === 0) {
          isDeletingRef.current = false
          timerRef.current = setTimeout(
            () => typeNextChar(),
            currentOptions.speed
          )
          if (currentOptions.deleteComplete) currentOptions.deleteComplete()
        }
      }

      typeNextChar()
    },
    [text]
  )

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    charIndexRef.current = 0
    isDeletingRef.current = false
    setTypingText('')
    setTyping(false)
  }, [])

  useEffect(() => {
    if (!options.manual) {
      start()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [start, options.manual])

  return {
    typingText,
    start,
    reset,
    typing
  }
}
